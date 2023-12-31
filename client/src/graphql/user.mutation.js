import { gql } from "@apollo/client";

export const CREATE_USER = gql`
	mutation CreateUser($data: UserInput) {
		createUser(data: $data) {
			code
			success
			message
			user {
				id
				username
				email
				isAdmin
			}
			token
		}
	}
`;

export const LOGIN_USER = gql`
	mutation LoginUser($email: String!, $password: String!) {
		loginUser(email: $email, password: $password) {
			code
			success
			message
			user {
				id
				username
				email
				isAdmin
			}
			token
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout($userId: Int!, $token: String!) {
		logout(id: $userId, token: $token) {
			code
			success
			message
			user {
				id
				username
				email
				isAdmin
			}
		}
	}
`;
export const LOGOUT_ALL = gql`
	mutation LogoutAll($userId: Int!) {
		logoutAll(id: $userId) {
			code
			success
			message
			user {
				id
				username
				email
				isAdmin
			}
		}
	}
`;

export const DELETE_USER = gql`
	mutation DeleteUser($deleteUserId: Int!) {
		deleteUser(id: $deleteUserId) {
			code
			success
			message
			user {
				id
				username
				email
				isAdmin
			}
		}
	}
`;
