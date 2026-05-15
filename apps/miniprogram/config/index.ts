import { defineConfig } from "@tarojs/cli";

export default defineConfig({
  projectName: "dreamscape-miniprogram",
  date: "2026-05-13",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: "react",
  compiler: {
    type: "webpack5"
  },
  cache: {
    enable: true
  },
  mini: {},
  h5: {
    publicPath: "/",
    staticDirectory: "static"
  }
});
