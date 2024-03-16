
/* IMPORT */

import {openInExternal} from 'vscode-extras';
import {getPackageFromUnknown, getPackageFromProject, getPackageFromPrompt} from './utils';

/* MAIN */

const open = async ( names?: string | string[] ): Promise<void> => {

  const pkg = names ? getPackageFromUnknown ( names ) : await getPackageFromPrompt ( JSON.stringify ( getPackageFromProject () ) );

  if ( !pkg ) return;

  const url = `https://npmgraph.js.org/?q=${encodeURIComponent ( `${pkg.name}@${pkg.version}` )}#packages=${encodeURIComponent ( JSON.stringify ( [pkg] ) )}`;

  openInExternal ( url );

};

/* EXPORT */

export {open};
