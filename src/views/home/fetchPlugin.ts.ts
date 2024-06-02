import axios from "axios";
import localforage from "localforage";
import * as esbuild from "esbuild-wasm";

const fileCache = localforage.createInstance({
	name: "filecache"
});

export function fetchPlugin(code: string): esbuild.Plugin {
	return {
		name: "fetchPlugin",

		setup(build) {
			build.onLoad({ filter: /(^index.js$)/ }, () => {
				return {
					loader: "jsx",
					contents: code
				};
			});

			build.onLoad({ filter: /.*/ }, async args => {
				const cachedResult = await fileCache.getItem(args.path);
				if (cachedResult) {
					return cachedResult;
				}
			});

			build.onLoad({ filter: /.css$/ }, async args => {
				const { data, request } = await axios.get(args.path);
				const escaped = data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");
				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents: `
				const style = document.createElement('style');
				style.innerText = '${escaped}';
				document.head.appendChild(style);
			`,
					resolveDir: new URL("./", request.responseURL).pathname
				};
				await fileCache.setItem(args.path, result);
				return result;
			});

			build.onLoad({ filter: /.*/ }, async args => {
				const { data, request } = await axios.get(args.path);

				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents: data,
					resolveDir: new URL("./", request.responseURL).pathname
				};
				await fileCache.setItem(args.path, result);
				return result;
			});
		}
	};
}
