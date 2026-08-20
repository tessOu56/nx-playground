/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORY_PUBLIC_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
