import useRequest from "@/hooks/useRequest";
import "./index.less";
import { PORT1 } from "@/api/config/servicePort";
import { useEffect } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
const UseComponent = () => {
	const [data, setData] = useRequest<Menu.MenuOptions[]>(PORT1 + `/menu/list`, "GET");
	async function FetchData() {
		await setData();
	}
	console.log(data, "MenuData");
	useEffect(() => {
		FetchData();
	}, []);

	const columns: ColumnsType<Menu.MenuOptions> = [
		{
			title: "Title",
			dataIndex: "title",
			key: "title"
		}
	];
	return (
		<div className="card content-box">
			<span className="text">UseComponent 🍓🍇🍈🍉{data.value?.length}</span>
			<Table dataSource={data.value ? data.value : []} columns={columns}></Table>
		</div>
	);
};

export default UseComponent;
