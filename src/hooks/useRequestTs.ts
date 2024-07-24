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
				data: params
			} as AxiosRequestConfig);
			console.log(res, "res");
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
