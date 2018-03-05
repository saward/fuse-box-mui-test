const { src, task, exec, context } = require("fuse-box/sparky");
const { FuseBox, WebIndexPlugin, QuantumPlugin } = require("fuse-box");

context(
  class {
    getConfig() {
      return FuseBox.init({
        homeDir: "src",
        output: "dist/$name.js",
        target: "browser@es5",
        sourceMaps: { inline: false, vendor: false }, //Not needed as we are debugging with vscode
        plugins: [
          WebIndexPlugin({ title: "Web Console", template: "src/index.html" }),
          this.isProduction &&
            QuantumPlugin({
              uglify: true,
              treeshake: true,
              bakeApiIntoBundle: "app"
            })
        ]
      });
    }
  }
);

task("default", ["dev"]);

task("dev", async context => {
  const fuse = context.getConfig();
  fuse.dev();
  fuse
    .bundle("app")
    .hmr()
    .watch()
    .instructions(">index.tsx");

  await fuse.run();
});
