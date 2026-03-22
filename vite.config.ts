import { fileURLToPath, URL } from "node:url";
import { ConfigEnv, loadEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vueDevTools from "vite-plugin-vue-devtools"; 
import electronSimple from "vite-plugin-electron/simple";
import native from "vite-plugin-native";
// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_PATH, VITE_OUT_DIR } = loadEnv(mode, process.cwd());

  return {
    base: VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
          }),
        ],
        include: [/\.vue$/, /\.tsx?$/],
      }),
      vueDevTools(),
      electronSimple({
        main: {
          // Shortcut of `build.lib.entry`
          entry: "electron/main.ts",
          vite: {
            plugins: [native({})],
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`
          input: "electron/preload.ts",
        },
      }),
    ],
    server: {
      host: true,
    },
    build: {
      // sourcemap: "hidden",
      outDir: VITE_OUT_DIR,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
      },
    },
  };
};
