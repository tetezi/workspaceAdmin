/// <reference types="vite/client" />

interface ImportMetaEnvType {
  readonly VITE_TITLE: string;
  readonly VITE_MINI_TITLE: string;
  readonly VITE_APP_BASE_API_URL: string;
  readonly VITE_APP_ID: UUID;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnvType;
}
