import { fileURLToPath, URL } from 'node:url'

import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_PATH, VITE_OUT_DIR } = loadEnv(mode, process.cwd())

  return {
    base: VITE_BASE_PATH,
    plugins: [vue(), vueJsx()],
    server: {
      host: true
    },
    build: {
      // sourcemap: "hidden",
      outDir: VITE_OUT_DIR
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
}
