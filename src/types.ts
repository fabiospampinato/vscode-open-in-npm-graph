
/* MAIN */

type Package = {
  name: string,
  version: string,
  dependencies?: Partial<Record<string, string>>,
  devDependencies?: Partial<Record<string, string>>,
  peerDependencies?: Partial<Record<string, string>>
};

/* EXPORT */

export type {Package};
