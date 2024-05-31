import axios from "axios";

import * as esbuild from "esbuild-wasm";
export function unpkgPathPlugins(code: string): esbuild.Plugin {
	return {
		name: "unpkg-path-plugins",
		setup(build) {
			build.onResolve({ filter: /.*/ }, async args => {
				console.log(args, "resolve");
				if (args.path === "index.js") {
					return { path: args.path, namespace: "a" };
				}
				if (args.path.includes("./") || args.path.includes("../")) {
					const newpath = new URL(args.path, args.importer + "/");
					console.log(newpath, "newpathnewpath");
					return { path: newpath.href, namespace: "a" };
				}
				return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
			});

			build.onLoad({ filter: /.*/ }, async args => {
				console.log(args, "onLoad");
				if (args.path === "index.js") {
					return {
						loader: "jsx",
						contents: code
					};
				}
				const { data } = await axios.get(args.path);
				return {
					loader: "jsx",
					// path: `https://unpkg.com/${args.path}`,
					contents: data
				};
			});
		}
	};
}
