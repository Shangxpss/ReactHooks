import { Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "@/redux/interface";
import { setThemeConfig } from "@/redux/modules/global/action";

export default function SwitchDark() {
	const { themeConfig }: GlobalState = useSelector((state: any) => state.global);
	const dispatch = useDispatch();
	const onChange = (checked: boolean) => {
		dispatch(setThemeConfig({ ...themeConfig, isDark: checked }));
	};
	return (
		<Switch
			className="dark"
			defaultChecked={themeConfig.isDark}
			checkedChildren={<>🌞</>}
			unCheckedChildren={<>🌜</>}
			onChange={onChange}
		/>
	);
}
