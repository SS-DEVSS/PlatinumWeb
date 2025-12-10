/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATINUM_DRIVELINE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}