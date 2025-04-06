// This is a more comprehensive type definition for duplexify
declare module 'duplexify' {
  import { Duplex } from 'stream';
  function duplexify(writable?: NodeJS.WritableStream, readable?: NodeJS.ReadableStream, options?: any): Duplex;
  export = duplexify;
}
