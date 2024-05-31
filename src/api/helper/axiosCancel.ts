import { AxiosRequestConfig } from "axios";
import { isFunction } from "@/utils/is/index";
import qs from "qs";

// * 声明一个 Map 用于存储每个请求的标识 和 取消函数
let pendingMap = new Map<string, AbortController>();
// * 序列化参数
export const getPendingUrl = (config: AxiosRequestConfig) =>
	[config.method, config.url, qs.stringify(config.data), qs.stringify(config.params)].join("&");

export class AxiosCanceler {
	/**
	 * @description: 添加请求
	 * @param {Object} config
	 */
	addPending(config: AxiosRequestConfig) {
		// * 在请求开始前，对之前的请求做检查取消操作
		this.removePending(config);
		const url = getPendingUrl(config);
		const controller = new AbortController();
		config.signal = controller.signal;
		if (!pendingMap.has(url)) {
			pendingMap.set(url, controller);
		}
	}

	/**
	 * @description: 移除请求
	 * @param {Object} config
	 */
	async removePending(config: AxiosRequestConfig) {
		const url = getPendingUrl(config);
		console.log(pendingMap, "pendingMap");
		if (pendingMap.has(url)) {
			// 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
			const abortController = pendingMap.get(url);
			abortController && abortController.abort();
			pendingMap.delete(url);
		}
	}

	/**
	 * @description: 清空所有pending
	 */
	removeAllPending() {
		pendingMap.forEach(cancel => {
			cancel && isFunction(cancel) && cancel();
		});
		pendingMap.clear();
	}

	/**
	 * @description: 重置
	 */
	reset(): void {
		pendingMap = new Map<string, AbortController>();
	}
}
