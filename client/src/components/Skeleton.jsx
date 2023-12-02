import { Paper } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export default function SkeletonComponent() {
	return (
		<Paper className="w-[300px] py-4 px-3">
			<Skeleton variant="rectangular" width={"100%"} height={200} />

			<div className="flex flex-col gap-3 h-full">
				<div>
					<Skeleton
						variant="text"
						sx={{ fontSize: "2rem" }}
						className="w-2/3"
					/>
					<Skeleton
						variant="rectangular"
						width={"100%"}
						height={60}
					/>
				</div>

				<div className="flex flex-row items-center justify-between gap-3">
					<Skeleton
						variant="rectangular"
						height={60}
						className="flex-grow"
					/>
					<Skeleton variant="rectangular" width={50} height={60} />
				</div>
			</div>
		</Paper>
	);
}
