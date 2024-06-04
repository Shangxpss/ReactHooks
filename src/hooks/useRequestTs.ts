import { useState } from "react";
import request from "@/api/index";
import { AxiosRequestConfig } from "axios";
export default function <T = any>(url: string) {
	type Data = {
		value: T | null;
		total: number | null;
		error: string | null;
		loading: boolean;
	};
	const [data, setData] = useState<Data>({
		value: null,
		total: null,
		error: null,
		loading: false
	});
	const fetchData = async (params: { [key: string]: unknown } = {}) => {
		try {
			setData(data => ({ ...data, loading: true }));
			const res: any = await request.service({
				url: url,
				method: "POST",
				data: params,
				baseUrl: url.indexOf("/map/") > -1 ? "mini" : undefined
			} as AxiosRequestConfig);
			console.log(res, "res");
			if (res.code === 200) {
				if (res.rows) {
					setData(data => ({ ...data, value: res.rows, total: res.total }));
					console.log(res.rows, "res.rows");
					console.log(data.value, "data.valu e");
				} else if (res.data) {
					if (Array.isArray(res.data)) {
						setData({ ...data, value: res.data, total: res.total });
					} else {
						if (res.data.list) {
							setData({ ...data, value: res.data.list, total: res.data.total });
						} else {
							console.log(res, "comeHereData");
							setData({ ...data, value: res.data, total: res.total });
						}
					}
				} else {
					setData({ ...data, value: [] as unknown as T });
				}
			} else if (res.list?.length) {
				setData({ ...data, value: res.list, total: res.total });
			} else {
				throw Error(res.msg);
			}
		} catch (err: any) {
			console.log(err, "errerrerr");

			data.error = err;
		} finally {
			setData(data => ({ ...data, loading: false }));
			// if (!controller) {
			// 	data.loading = false;
			// }
		}
	};
	return [data, fetchData] as [Data, (params: { [key: string]: unknown }) => Promise<void>];
}
