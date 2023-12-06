/* eslint-disable no-throw-literal */
export const errorFormat = (body, status) => {
	return {
		extensions: {
			response: { body, status },
		},
	};
};
