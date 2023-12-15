import { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Root() {
	
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div onClick={() => isOpen && setIsOpen(false)}>
			{/* Navbar */}
			<Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
			<Outlet />
		</div>
	);
}
