import Stack from "@mui/material/Stack";
import React from "react";

export default function EmptyTableMessage() {
	return (
		<Stack
			sx={{
				backgroundColor: "#E2E2EB",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "50%",
				color: "#F65A46",
				marginTop: 2.75,
			}}
		>
			Data tidak ditemukan
		</Stack>
	);
}
