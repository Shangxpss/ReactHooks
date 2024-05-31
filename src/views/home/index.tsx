import welcome from "@/assets/images/welcome01.png";
import "./index.less";
import { Button, Input } from "antd";
import * as esbuild from "esbuild-wasm";
import { memo, useEffect, useRef, useState } from "react";
import { unpkgPathPlugins } from "./unpkgPathPlugins";
import axios from "axios";
const { TextArea } = Input;
const Home = () => {
	const [code, setCode] = useState("");
	const [result, setResult] = useState("");
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
	const Father = useRef<HTMLDivElement>(null);
	const [inputWord, setInputWord] = useState("");
	// const html123 = `
	// <head></head>
	// <body>
	// <div>123</div>
	// </body>
	// `;
	return (
		<div className="home card">
			<div ref={Father} className="father">
				<Input value={inputWord} onChange={value => setInputWord(value.target.value)}></Input>
				<div style={{ width: "60px" }} className="children">
					{inputWord}
				</div>
				<Button
					onClick={() => {
						console.log(Father, "Father");
						if (Father.current) {
							const children = Father.current.querySelector(".children");
							const scrollWith = children?.scrollWidth;
							console.log(scrollWith, "scrollWith");
						}
					}}
				>
					tipTools
				</Button>
			</div>
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
						plugins: [unpkgPathPlugins(code)]
					});
					console.log(result, "result");
					setResult(esresult.outputFiles[0].text);
					eval(esresult.outputFiles[0].text);
				}}
			>
				在线转换
			</Button>
			<Button
				onClick={async () => {
					const res = await axios.get("bapi");
					console.log(res, "res");
				}}
			>
				获取数据
			</Button>
			<div>
				<TextArea value={code} onChange={value => setCode(value.target.value)}></TextArea>
			</div>
			{/* <div>{result}</div> */}
			<div id="root1"></div>
			<iframe
				srcDoc="<head></head>
							<body>
								<div>123</div>
							</body>"
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
