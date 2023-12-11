import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
	query CurrentUser {
		currentUser {
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
