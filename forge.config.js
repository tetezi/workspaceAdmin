import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
export default {
  // 核心打包配置
  packagerConfig: {
    // 1. 只包含 dist 目录下的所有文件/子目录（关键配置）
    files: [
      "dist/**/*", // glob 模式：匹配 dist 下所有内容
    ],
    // 2. 排除不需要的文件/目录（按需调整）
    ignore: [
      /^\/src$/, // 排除 src 源码目录
      /^\/\.git$/, // 排除 .git 版本控制目录
      /^\/node_modules\/(?!(electron)).*/, // 排除 node_modules 中非 electron 相关依赖（可选）
      /^\/\.env$/, // 排除环境变量文件
      /^\/package-lock.json$/, // 排除包锁文件
      /^\/README.md$/, // 排除说明文档
      /^\/forge.config.js$/, // 排除 forge 配置文件（可选）
    ],
    asar: true, // 推荐开启：将文件打包为 asar 包（更安全）
  },
  // 重构依赖配置（默认即可）
  rebuildConfig: {},
  // 打包器（生成不同平台安装包）
  makers: [
    {
      name: "@electron-forge/maker-squirrel", // Windows 安装包
      config: {},
    },
    {
      name: "@electron-forge/maker-zip", // Mac 压缩包
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb", // Linux deb 包
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm", // Linux rpm 包
      config: {},
    },
  ],
  // 安全插件（默认推荐配置）
  plugins: [
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
