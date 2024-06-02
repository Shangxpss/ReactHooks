import welcome from "@/assets/images/welcome01.png";
import "./index.less";
import { Button, Input } from "antd";
import * as esbuild from "esbuild-wasm";
import { memo, useEffect, useState } from "react";
import { unpkgPathPlugins } from "./unpkgPathPlugins";
import { fetchPlugin } from "./fetchPlugin.ts";
const { TextArea } = Input;
const Home = () => {
	const [code, setCode] = useState("");
	async function startService() {
		await esbuild.initialize({
			worker: true,
			wasmURL: "/esbuild.wasm"
		});
	}
	useEffect(() => {
		startService();
	}, []);
	// const dispatch = useDispatch();
	const [count, setCount] = useState(0);

	return (
		<div className="home card">
			<img src={welcome} alt="welcome" />
			<MemoChildren />
			<Button onClick={() => setCount(count => count + 1)}>Plus</Button>
			<div>{count}</div>
			<Button
				onClick={async () => {
					const esresult = await esbuild.build({
						entryPoints: ["index.js"],
						bundle: true,
						write: false,
						plugins: [unpkgPathPlugins(), fetchPlugin(code)],
						define: {
							global: "window"
							// "process.env.NODE_ENV": '"production"'
						}
					});
					eval(esresult.outputFiles[0].text);
					// const iframe = document.querySelector("iframe");
					// iframe?.contentWindow?.postMessage(esresult.outputFiles[0].text, "*");
				}}
			>
				在线转换
			</Button>
			<div>
				<TextArea value={code} onChange={value => setCode(value.target.value)}></TextArea>
			</div>
			<div id="root1"></div>
			<iframe
				srcDoc={`<head></head>
							<body>
							<div id="root"></div>
								<script>
								
								addEventListener("message",(code)=>{
									eval(code.data)
								})
								</script>
							</body>`}
			></iframe>
		</div>
	);
};

const Children = () => {
	console.log("refresh");
	return <div>123</div>;
};
const MemoChildren = memo(Children);

export default Home;
