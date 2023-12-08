import { gql } from "@apollo/client";

export const ME = gql`
	query GetUser($getUserId: Int!) {
		getUser(id: $getUserId) {
			code
			success
			message
			user {
				id
				username
				email
				isAdmin
				tokens {
					token
				}
			}
		}
	}
`;

export const GET_ALL_USERS = gql`
	query GetAllUser {
		getAllUser {
			code
			success
			message
			users {
				id
				username
				email
				isAdmin
				tokens {
					token
				}
			}
		}
	}
`;
