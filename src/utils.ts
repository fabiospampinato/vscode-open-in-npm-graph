
/* IMPORT */

import {getPackage, prompt} from 'vscode-extras';
import type {Package} from './types';

/* MAIN */

const attempt = <T> ( fn: () => T ): T | undefined => {

  try {

    return fn ();

  } catch {

    return;

  }

};

const castArray = <T> ( value: T | T[] ): T[] => {

  return Array.isArray ( value ) ? value : [value];

};

const castArraySplitted = ( value: string | string[] ): string[] => {

  const splitRe = /[\s,]+/g;
  const splits = castArray ( value ).map ( value => value.split ( splitRe ) ).flat ().filter ( Boolean );

  return splits;

};

const getPackageFromUnknown = ( pkg: unknown ): Package | undefined => {

  if ( isObject ( pkg ) ) {

    const name = isString ( pkg?.name ) ? pkg.name : 'unknown';
    const version = isString ( pkg?.version ) ? pkg.version : '0.0.0';
    const dependencies = isDependencies ( pkg?.dependencies ) ? pkg.dependencies  : undefined;
    const devDependencies = isDependencies ( pkg?.devDependencies ) ? pkg.devDependencies  : undefined;
    const peerDependencies = isDependencies ( pkg?.peerDependencies ) ? pkg.peerDependencies  : undefined;

    return { name, version, dependencies, devDependencies, peerDependencies };

  } else if ( isString ( pkg ) ) {

    const content = attempt ( () => JSON.parse ( pkg ) );

    if ( isObject ( content ) ) {

      return getPackageFromUnknown ( content );

    } else {

      const partsRe = /^((?:@\w+\/)?\w+)(.*)$/;
      const dependencies: Partial<Record<string, string>> = {};

      for ( const dependency of castArraySplitted ( pkg ) ) {

        const parts = dependency.match ( partsRe );

        if ( !parts ) continue;

        const name = parts[1];
        const version = parts[2] || '*';

        dependencies[name] = version;

      }

      return { name: 'unknown', version: '0.0.0', dependencies };

    }

  }

};

const getPackageFromProject = (): Package | undefined => {

  const input = getPackage ()?.content;
  const pkg = getPackageFromUnknown ( input );

  return pkg;

};

const getPackageFromPrompt = async ( value?: string ): Promise<Package | undefined> => {

  const input = await prompt.string ( 'NPM package name...', value );
  const pkg = getPackageFromUnknown ( input );

  return pkg;

};

const isDependencies = ( value: unknown ): value is Partial<Record<string, string>> => {

  if ( !isObject ( value ) ) return false;

  for ( const key in value ) {

    if ( !isString ( value[key] ) ) return false;

  }

  return true;

};

const isObject = ( value: unknown ): value is Record<string, unknown> => {

  return typeof value === 'object' && value !== null;

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

/* EXPORT */

export {attempt, castArray, castArraySplitted, getPackageFromUnknown, getPackageFromProject, getPackageFromPrompt, isObject, isString};
