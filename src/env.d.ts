/// <reference path="../.astro/types.d.ts" />

declare module 'jsonld' {
  interface RemoteDocument {
    contextUrl: string | null;
    documentUrl: string;
    document: Record<string, unknown>;
  }

  interface CanonizeOptions {
    algorithm?: string;
    format?: string;
    documentLoader?: (url: string) => Promise<RemoteDocument>;
  }

  const jsonld: {
    canonize: (input: Record<string, unknown>, options?: CanonizeOptions) => Promise<string>;
  };

  export default jsonld;
}
