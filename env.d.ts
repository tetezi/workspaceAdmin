/// <reference types="vite/client" />
interface ImportMetaEnvType {
  readonly VITE_TITLE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnvType;
}
