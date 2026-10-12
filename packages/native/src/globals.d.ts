// Metro resolves static `require()` calls for assets (fonts, images) and for
// optional modules wrapped in try/catch. React Native's types do not declare it.
declare function require(id: string): any
