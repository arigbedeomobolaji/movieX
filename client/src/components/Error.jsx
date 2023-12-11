/* eslint-disable react/prop-types */
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

export default function Error({ error }) {
	const [open, setOpen] = useState(true);
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};
	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
			anchorOrigin={{ vertical: "top", horizontal: "left" }}
		>
			<Alert
				onClose={handleClose}
				severity="error"
				sx={{ width: "100%" }}
			>
				{error.message}
			</Alert>
		</Snackbar>
	);
}
