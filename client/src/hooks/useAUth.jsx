/* eslint-disable no-unused-vars */
// useAuth.js

import { useState } from "react";

const useAuth = () => {
	const [token, setToken] = useState(localStorage.getItem("token") || "");

	return { token };
};

export default useAuth;
