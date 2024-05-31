import { AnyAction } from "redux";
import { Login } from "@/redux/interface";
import produce from "immer";

const globalState: Login = {
	token: "",
	name: "",
	avatar: "",
	roles: [],
	permissions: [],
	dept: "",
	phoneNumber: ""
};

// global reducer
const login = (state: Login = globalState, action: AnyAction) =>
	produce(state, draftState => {
		switch (action.type) {
			case "login/setToken":
				draftState.token = action.token;
				break;
			// case types.SET_ASSEMBLY_SIZE:
			// 	draftState.assemblySize = action.assemblySize;
			// 	break;
			// case types.SET_LANGUAGE:
			// 	draftState.language = action.language;
			// 	break;
			// case types.SET_THEME_CONFIG:
			// 	draftState.themeConfig = action.themeConfig;
			// 	break;
			default:
				return draftState;
		}
	});

export default login;
