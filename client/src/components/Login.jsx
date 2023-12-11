/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useMutation } from "@apollo/client";
import { Button, Checkbox, Form, Input } from "antd";
import { LOGIN_USER } from "../graphql/user.mutation";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userVar } from "../graphql/cache";
import Error from "./Error";

const Login = ({ setIsLogin }) => {
	const [loginUser, { data }] = useMutation(LOGIN_USER);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { state } = useLocation();
	const from = state?.from || "/";

	useEffect(() => {
		if (data?.loginUser?.token) {
			localStorage.setItem("token", JSON.stringify(data.loginUser.token));
			userVar(data.loginUser.user);
			navigate(from);
			return;
		}

		if (data?.loginUser?.success === false) {
			setError({
				message: data?.loginUser?.message,
			});
		}
	}, [data, navigate, from, loginUser]);

	const onFinish = (values) => {
		loginUser({
			variables: {
				email: values.email,
				password: values.password,
			},
		});
	};
	const onFinishFailed = (errorInfo) => {
		console.log(errorInfo);
	};

	return (
		<>
			{error && <Error error={error} />}
			<Form
				className="mzw-w-[350px] mx-auto bg-gray-50 flex flex-col rounded-md shadow-md justify-center mt-10 p-5 font-poppings"
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				style={{
					maxWidth: 600,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your Email!",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					name="remember"
					valuePropName="checked"
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>
				<p className="text-center text-gray-400">
					You don't have an account?{" "}
					<Button
						className="bg-transparent border-none outline-none shadow-none font-poppings"
						onClick={() => setIsLogin(false)}
					>
						Register
					</Button>
				</p>
				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Login
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};
export default Login;
