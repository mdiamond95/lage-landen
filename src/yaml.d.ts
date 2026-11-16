// A .yaml import gives the file's data, parsed at build time (see vite.config.ts).
declare module '*.yaml' {
  const data: unknown
  export default data
}
