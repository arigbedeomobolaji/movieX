/* eslint-disable no-throw-literal */
export function validOperation(allowedField, updateObject) {
	const providedFields = Array.isArray(updateObject)
		? updateObject
		: Object.keys(updateObject);
	if (!providedFields.length) {
		throw {
			status: 400,
			warning:
				"No Data was provided. Are you sure you want to update the database.",
		};
	}
	const validOperation = providedFields.every((field, index) =>
		allowedField.includes(field)
	);
	if (!validOperation) {
		throw {
			error: "The allowed fields are 'title','description','posterUrl'and'rating",
		};
	}
	return providedFields;
}
