const { composePlugins, withNx } = require("@nx/webpack")
const { withReact } = require("@nx/react")
const { withModuleFederation } = require("@nx/module-federation/webpack")

const baseConfig = require("./module-federation.config")

const prodConfig = {
  ...baseConfig,
  remotes: [
    ["mfe-ui", "/nx-playground/mfe-ui/"],
  ],
}

module.exports = composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(prodConfig, { dts: false })
)
