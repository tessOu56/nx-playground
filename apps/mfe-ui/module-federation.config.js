/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 */
module.exports = {
  name: "mfe-ui",
  exposes: {
    "./Button": "./src/Button.jsx",
    "./Module": "./src/remote-entry.js",
  },
}
