// import { useEffect } from "react";
import { Table, DatePicker, Button, Space, TableColumnType, Input, InputRef } from "antd";
import useAuthButtons from "@/hooks/useAuthButtons";
// import useRequestTs from "@/hooks/useRequestTs";
import "./index.less";
import request from "@/api";
import { useRef, useState } from "react";
import { FilterDropdownProps } from "antd/lib/table/interface";

interface DataType {
	key: string;
	name: string;
	age: number;
	address: string;
}
type DataIndex = keyof DataType;
const socket = new WebSocket("/ws/api/ws");
const UseHooks = () => {
	socket.onopen = function (e) {
		console.log(e, "eeeeeeee");
		socket.send("My name is John");
	};
	socket.onmessage = function (event) {
		console.log(event, "event");
	};
	// 按钮权限
	const { BUTTONS } = useAuthButtons();
	const { RangePicker } = DatePicker;
	// const [data, fetchData] = useRequestTs<any>("/opportunity/record/getCKSJList");
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(["1", "2", "3"]);
	// const [searchText, setSearchText] = useState("");
	// const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef<InputRef>(null);
	// async function requestData() {
	// 	await fetchData({
	// 		csj: 1,
	// 		pageNum: 1,
	// 		pageSize: 10,
	// 		corpName: "",
	// 		codes: null
	// 	});
	// 	console.log(data, "data");
	// }

	const dataSource: DataType[] = [
		{
			key: "1",
			name: "胡彦斌",
			age: 32,
			address: "西湖区湖底公园1号"
		},
		{
			key: "2",
			name: "胡彦祖",
			age: 42,
			address: "西湖区湖底公园1号"
		},
		{
			key: "3",
			name: "刘彦祖",
			age: 18,
			address: "西湖区湖底公园1号"
		},
		{
			key: "4",
			name: "刘彦祖",
			age: 18,
			address: "翻斗大街翻斗花园二号楼1001室"
		},
		{
			key: "5",
			name: "刘彦祖",
			age: 18,
			address: "翻斗大街翻斗花园二号楼1001室"
		}
	];
	function handleSearch(selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: DataIndex) {
		confirm();
		console.log(dataIndex);
	}
	const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
		filterDropdown({ selectedKeys, setSelectedKeys, confirm /* clearFilters */ }) {
			return (
				<div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
					<Input
						ref={searchInput}
						placeholder={`Search ${dataIndex}`}
						value={selectedKeys[0]}
						onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
						style={{ marginBottom: 8, display: "block" }}
					/>
				</div>
			);
		},
		onFilter(value, record) {
			return record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase());
		}
	});

	const columns: any[] = [
		{
			title: "姓名",
			dataIndex: "name",
			key: "name",
			align: "center",
			...getColumnSearchProps("name")
		},
		{
			title: "年龄",
			dataIndex: "age",
			key: "age",
			align: "center",
			...getColumnSearchProps("age")
		},
		{
			title: "住址",
			dataIndex: "address",
			key: "address",
			align: "center",
			width: "50%"
		}
	];
	const [count, setCount] = useState(0);
	return (
		<div className="card content-box">
			<div className="date">
				<span>切换国际化的时候看我 😎 ：</span>
				<RangePicker />
			</div>
			<div className="auth">
				<Space>
					{BUTTONS.add && (
						<Button
							onClick={async () => {
								// await requestData();
								const res = await request.post("/api/auth/register", {
									Name: "admin",
									Email: "270291223@qq.com",
									Password: "123456abc!",
									PasswordConfirm: "123456abc!",
									Photo: "img"
								});
								console.log(res, "res");
							}}
							type="primary"
						>
							注册
						</Button>
					)}
					<Button
						onClick={async () => {
							// await requestData();
							const res = await request.post("/api/auth/login", {
								Email: "270291223@qq.com",
								Password: "123456abc!"
							});
							console.log(res, "res");
						}}
						type="primary"
					>
						登陆
					</Button>
					<Button
						onClick={async () => {
							// await requestData();
							const res = await request.get("/api/users/me");
							console.log(res, "res");
						}}
						type="primary"
					>
						GetMe
					</Button>
					{BUTTONS.delete && (
						<Button
							onClick={() => {
								setCount(count + 1);
								setCount(count => count + 1);
							}}
							type="primary"
						>
							我是 Admin 能看到的按钮
						</Button>
					)}
					{
						<Button
							type="primary"
							onClick={() => {
								const res = request.post("/api/posts/", {
									Title: "numberOne",
									Content: "numberOneContent",
									Image: "numberOneImage"
								});
								console.log(res, "res");
							}}
						>
							我是 User 能看到的按钮
						</Button>
					}
				</Space>
			</div>
			<Table
				rowSelection={{
					selectedRowKeys,
					onChange(newSelectedKeys) {
						setSelectedRowKeys(newSelectedKeys);
					}
				}}
				bordered={true}
				dataSource={dataSource}
				columns={columns}
			/>
		</div>
	);
};

export default UseHooks;
