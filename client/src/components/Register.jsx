/* eslint-disable react/prop-types */
import { Button, Checkbox, Form, Input } from "antd";
import { CREATE_USER } from "../graphql/user.mutation";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { userVar } from "../graphql/cache";
import Error from "./Error";

const Register = ({ setIsLogin }) => {
	const [createUser, { data }] = useMutation(CREATE_USER);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { state } = useLocation();
	useEffect(() => {
		if (data?.createUser?.token) {
			localStorage.setItem(
				"token",
				JSON.stringify(data.createUser.token)
			);
			userVar(data.createUser.user);
			navigate(state?.from || "/");
			return;
		}

		if (data?.createUser?.success === false) {
			setError({
				message: data?.createUser?.message,
			});
		}
	}, [data, navigate, state]);

	const onFinish = (values) => {
		createUser({
			variables: {
				data: {
					email: values.email,
					password: values.password,
					username: values.username,
				},
			},
		});
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
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
					label="Username"
					name="username"
					rules={[
						{
							required: true,
							message: "Please input your username!",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your email!",
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
					You do have an account?{" "}
					<Button
						className="bg-transparent border-none outline-none shadow-none font-poppings"
						onClick={() => setIsLogin(true)}
					>
						Sign in
					</Button>
				</p>
				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Register
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default Register;
