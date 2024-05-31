import axios from "axios";

import * as esbuild from "esbuild-wasm";
export function unpkgPathPlugins(code: string): esbuild.Plugin {
	return {
		name: "unpkg-path-plugins",
		setup(build) {
			build.onResolve({ filter: /.*/ }, async args => {
				if (args.path === "index.js") {
					return { path: args.path, namespace: "a" };
				}
				if (args.path.includes("./") || args.path.includes("../")) {
					// const newpath = new URL(args.path, args.importer + "/");
					const nestUrl = new URL(args.resolveDir, args.importer + "/");
					console.log(nestUrl, "nestUrl");
					return { path: nestUrl.href, namespace: "a" };
				}
				return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
			});

			build.onLoad({ filter: /.*/ }, async args => {
				if (args.path === "index.js") {
					return {
						loader: "jsx",
						contents: code
					};
				}
				const res = await axios.get(args.path);
				console.log(res, "data");
				const newUrl = new URL("./", res.request.responseURL);
				return {
					loader: "jsx",
					// path: `https://unpkg.com/${args.path}`,
					contents: res.data,
					resolveDir: newUrl.href
				};
			});
		}
	};
}
