import * as types from "@/redux/mutation-types";
import { ThemeConfigProp } from "@/redux/interface/index";
import { loginAdmin } from "@/api/modules/login";
import { Login } from "@/api/interface";

// * setToken
export const setLoginToken = (loginParams: Partial<Login.ReqLoginForm>) => {
	return async function (dispatch: any) {
		const res: any = await loginAdmin<{ token: string }>(loginParams);
		console.log(res, "Loginres");
		dispatch({ type: "login/setToken", token: res?.token });
	};
};

// * setAssemblySize
export const setAssemblySize = (assemblySize: string) => ({
	type: types.SET_ASSEMBLY_SIZE,
	assemblySize
});

// * setLanguage
export const setLanguage = (language: string) => ({
	type: types.SET_LANGUAGE,
	language
});

// * setThemeConfig
export const setThemeConfig = (themeConfig: ThemeConfigProp) => ({
	type: types.SET_THEME_CONFIG,
	themeConfig
});
