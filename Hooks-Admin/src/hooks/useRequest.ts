/* eslint-disable no-empty */
import { useState } from "react";
import request from "@/api/oldIndex";
import { AxiosRequestConfig } from "axios";
export default function <T = any>(url: string, method: "POST" | "GET" = "POST") {
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
	const fetchData = async (params?: unknown) => {
		try {
			setData(data => ({ ...data, loading: true }));
			const res = await request.request<T>({
				url: url,
				method,
				data: params,
				baseUrl: url.indexOf("/map/") > -1 ? "mini" : undefined
			} as AxiosRequestConfig);
			console.log(res, "res");
			if (res.code === 200) {
				setData(data => ({ ...data, value: res.data! }));
			}
		} catch (err: any) {
			console.log(err, "errerrerr");

			data.error = err;
		} finally {
			setData(data => ({ ...data, loading: false }));
		}
	};
	return [data, fetchData] as [Data, (params?: unknown) => Promise<void>];
}
