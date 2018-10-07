const { FuseBox, WebIndexPlugin, SVGPlugin, CSSPlugin, SassPlugin, QuantumPlugin } = require("fuse-box");
const { src, task, context } = require("fuse-box/sparky");

context({
  isProduction: false,
  getConfig() {
    return FuseBox.init({
      homeDir : "./src",
      output : "./dist/$name.js",
      useTypescriptCompiler : true,
      plugins: [
        [ SassPlugin({outputStyle: "compressed"}), 
          CSSPlugin()
        ],
        CSSPlugin(),
        SVGPlugin(),
        WebIndexPlugin({
            template : "src/index.html"
        }),
        this.isProduction && QuantumPlugin({
          bakeApiIntoBundle: "app",
          css : true,
          treeshake: true,
          uglify: true
        })
      ]
    });
  },
  createAppBundle(fuse) {
    const app = fuse
      .bundle("app")
      .instructions(">[index.js]");
      if (!this.isProduction) {
        app.watch()
          .hmr();  
      }
    return app;    
  },
  createVendorBundle(fuse) {
    const app = fuse
      .bundle("vendor")
      .instructions("~index.js");
    return app;    
  }
});

task("clean", () => src("dist").clean("dist").exec() );

task("default", ["clean"], async (context) => {
  const fuse = context.getConfig();

  fuse.dev({port:8080});
  context.createVendorBundle(fuse);
  context.createAppBundle(fuse);
  await fuse.run();  
});

task("dist", ["clean"], async (context) => {
  context.isProduction = true;
  const fuse = context.getConfig();

  context.createVendorBundle(fuse);
  context.createAppBundle(fuse);
  await fuse.run();  
});