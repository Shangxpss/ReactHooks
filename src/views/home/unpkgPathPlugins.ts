import * as esbuild from "esbuild-wasm";

export function unpkgPathPlugins(): esbuild.Plugin {
	return {
		name: "unpkg-path-plugins",
		setup(build) {
			build.onResolve({ filter: /(^index\.js$)/ }, args => {
				return {
					path: args.path,
					namespace: "a"
				};
			});
			build.onResolve({ filter: /^\.+\// }, args => {
				const nestUrl = new URL(args.path, "https://unpkg.com" + args.resolveDir + "/");
				return { path: nestUrl.href, namespace: "a" };
			});
			build.onResolve({ filter: /.*/ }, async args => {
				return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
			});
		}
	};
}
