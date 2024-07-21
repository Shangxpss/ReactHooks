import welcome from "@/assets/images/welcome01.png";
import "./index.less";
import { Button, Input } from "antd";
import axios from "axios";
import * as esbuild from "esbuild-wasm";
import { memo, useState } from "react";
import { unpkgPathPlugins } from "./unpkgPathPlugins";
import { fetchPlugin } from "./fetchPlugin.ts";
const { TextArea } = Input;
import CodeEditor from "@/components/codeEditor";

const Home = () => {
	const [code, setCode] = useState("");
	// const dispatch = useDispatch();
	const [count, setCount] = useState(0);
	const html = `<head></head>
	<body>
	<div id="root"></div>
		<script>
		
		addEventListener("message",(code)=>{
			eval(code.data)
		},false)
		</script>
	</body>`;
	return (
		<div className="home card">
			<Button
				onClick={async () => {
					const res = await axios.get("/bapi/tours/123");
					console.log(res.data, "data");
				}}
			>
				get
			</Button>
			<Button
				onClick={async () => {
					setCount(count => count + 1);
					const res = await axios.post("/bapi/tours", {
						name: "joey",
						age: count + 1
					});
					console.log(res.data, "data");
					return count;
				}}
			>
				post
			</Button>
			<CodeEditor />
			<img src={welcome} alt="welcome" />
			<MemoChildren />
			<Button onClick={() => setCount(count => count + 1)}>Plus</Button>
			<div>{count}</div>
			<Button
				onClick={async () => {
					const iframe = document.querySelector("iframe");
					iframe!.srcdoc = html;
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
					// eval(esresult.outputFiles[0].text);

					iframe?.contentWindow?.postMessage(esresult.outputFiles[0].text, "*");
				}}
			>
				在线转换
			</Button>
			<div>
				<TextArea value={code} onChange={value => setCode(value.target.value)}></TextArea>
			</div>
			<div id="root1"></div>
			<iframe sandbox="allow-scripts" srcDoc={html}></iframe>
		</div>
	);
};

const Children = () => {
	console.log("refresh");
	return <div>123</div>;
};
const MemoChildren = memo(Children);

export default Home;
