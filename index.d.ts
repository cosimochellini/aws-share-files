// next/types/global declares '*.module.css' but not plain '*.css', and TypeScript 6
// checks side-effect imports against a declaration. pages/_app.tsx imports
// '../styles/globals.css' for its side effect only, so the module has no shape worth
// describing -- declaring it is what tells the compiler the import is intentional
// rather than a typo.
declare module '*.css';
