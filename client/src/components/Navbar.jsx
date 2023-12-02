import MenuIcon from "@mui/icons-material/Menu";
function Navbar() {
	return (
		<div className="shadow-lg p-4 font-poppings bg-gradient-to-r from-purple-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
			<div className="flex max-w-7xl justify-between items-center mx-auto">
				<div className="flex items-center gap-2">
					<img
						src="https://img.freepik.com/premium-vector/eagle-gradient-logo-design-illustration_474888-842.jpg?size=626&ext=jpg&ga=GA1.1.567223693.1687376094&semt=ais"
						alt="BrandLogo"
						className="w-12 h-12 rounded-full"
					/>
					<h1 className="text-emerald-50 font-sans font-[400] text-[26px] tracking-wider">
						MD
					</h1>
				</div>
				<div className="relative">
					<MenuIcon className="text-3xl cursor-pointer text-white" />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
