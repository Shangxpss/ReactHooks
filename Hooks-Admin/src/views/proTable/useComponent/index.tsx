import styles from "./index.module.less";
import request from "@/api";
import * as d3 from "d3";
import { Button, Form, Input } from "antd";

import { useEffect, useRef, useState } from "react";
const UseComponent = () => {
	//tree logic
	const [count, setCount] = useState(0);
	const onFinish = async (values: { Name: string; Parent: string }) => {
		const res = await request.post("/api/person/add", values);
		console.log(res, "checkChunk");
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	interface Person {
		id: string;
		name: string;
		parent: string;
	}
	const [Person, setPerson] = useState<Person[]>([]);

	const treeContainer = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any>>();
	const svg = useRef<d3.Selection<SVGSVGElement, unknown, HTMLElement, any>>();
	const container = useRef<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();

	const centerPoint: [number, number] = [0, 0];
	async function getData() {
		const person = await request.get<{ data: Person[] }>("/api/person/");

		setPerson(() => {
			const newTreeData = person.data.map(item => (item.name === "root" ? { ...item, parent: "" } : item));
			console.log(newTreeData, "Person");
			const stratify = d3
				.stratify<Person>()
				.id(d => d.name)
				.parentId(d => d.parent);

			const rootNode = stratify(newTreeData);
			console.log(rootNode, "rootNode");
			treeContainer.current = d3.select(".treeRoot");
			if (!treeContainer.current) return newTreeData;
			const clientWidth = treeContainer.current.node()!.clientWidth;
			const clientHeight = treeContainer.current.node()!.clientHeight;
			centerPoint[0] = clientWidth / 2;
			centerPoint[1] = clientHeight / 2;

			svg.current = treeContainer.current.append("svg").attr("width", clientWidth).attr("height", clientHeight);
			container.current = svg.current.append("g").attr("class", "container");
			DrawRoot();
			return newTreeData;
		});
	}

	function DrawRoot() {
		if (!container.current) return;
		const title = container.current
			.append("g")
			.attr("id", "RootTitle")
			.attr("transform", `translate(${centerPoint[0]}, ${centerPoint[1]})`);

		title.append("rect").attr("width", 100).attr("height", 20).attr("rx", 5).attr("ry", 5).attr("fill", "blue");
		title.append("text").text("Root").attr("fill", "black");
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<div className="card content-box">
			<div className={styles.tree}>
				<div className="treeRoot"></div>
				{count}
				<Button onClick={() => setCount(count + 1)}>autoAdd</Button>
				<div className={styles.tree}>
					<div className="title">
						{Person.map(item => (
							<div key={item.id}>{item.name}</div>
						))}
					</div>
					<div>
						<Form
							name="basic"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
						>
							<Form.Item label="Name" name="Name" rules={[{ required: true, message: "Please input your name!" }]}>
								<Input />
							</Form.Item>

							<Form.Item label="Parent" name="Parent" rules={[{ required: true, message: "Please input your parent!" }]}>
								<Input />
							</Form.Item>

							<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Form>
					</div>
					<div>
						<Form
							name="basic"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							onFinish={async values => {
								const Person = await request.put("/api/person/", values);
								console.log(Person, "Person");
							}}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
						>
							<Form.Item label="Name" name="Name" rules={[{ required: true, message: "Please input your name!" }]}>
								<Input />
							</Form.Item>

							<Form.Item label="Parent" name="Parent" rules={[]}>
								<Input />
							</Form.Item>

							<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
								<Button type="primary" htmlType="submit">
									Update
								</Button>
							</Form.Item>
						</Form>
					</div>
					<div>
						<Button
							onClick={async () => {
								const Person = await request.get<{ data: Person[] }>("/api/person/list", { parentName: "root" });
								setPerson(Person.data);
							}}
						>
							list
						</Button>
						<Button
							onClick={async () => {
								const Person = await request.get<{ data: Person[] }>("/api/person/");
								setPerson(Person.data);
							}}
						>
							list All
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UseComponent;
