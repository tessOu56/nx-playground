const { composePlugins, withNx } = require("@nx/webpack")
const { withReact } = require("@nx/react")
const { withModuleFederation } = require("@nx/module-federation/webpack")

const baseConfig = require("./module-federation.config")

module.exports = composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(baseConfig, { dts: false })
)
