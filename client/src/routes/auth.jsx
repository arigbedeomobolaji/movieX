import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);
	return (
		<>
			{isLogin ? (
				<Login setIsLogin={setIsLogin} />
			) : (
				<Register setIsLogin={setIsLogin} />
			)}
		</>
	);
}
