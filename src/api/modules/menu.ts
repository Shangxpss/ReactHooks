import http from "@/api/index";

// * 获取菜单列表
export const getMenuListNew = () => {
	return http.get<any>(`/getRouters`);
};
