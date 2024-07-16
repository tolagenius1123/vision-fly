"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import MobileNav from "./MobileNav";
import VisionFlyIcon from "../../assets/icons/vision-fly-icon.png";

type NavbarProps = {};

const Navbar = ({}: NavbarProps) => {
	const pathName = usePathname();
	const router = useRouter();

	return (
		<div className="w-full py-4 px-10 md:px-20 flex items-center justify-between fixed top-0 z-30 shadow-lg bg-white">
			<div>
				<Image
					src={VisionFlyIcon}
					alt="vision-fly-icon"
					height={90}
					width={90}
				/>
			</div>
			<div className="hidden md:flex items-center gap-14">
				<div className="flex items-center gap-8">
					<Link
						href="/"
						className={`custom-link font-medium text-customBlue text-sm ${
							pathName === "/"
								? "text-customGreen"
								: "text-customBlack"
						}`}
					>
						About Us
					</Link>
					<Link
						href="/"
						className={`custom-link font-medium text-customBlue text-sm hover:text- ${
							pathName === "/"
								? "text-customGreen"
								: "text-customBlack"
						}`}
					>
						Private Charter
					</Link>
					<Link
						href="/"
						className={`custom-link font-medium text-customBlue text-sm hover:text- ${
							pathName === "/"
								? "text-customGreen"
								: "text-customBlack"
						}`}
					>
						Vacation Packages
					</Link>
					<Link
						href="/"
						className={`custom-link font-medium text-customBlue text-sm hover:text- ${
							pathName === "/"
								? "text-customGreen"
								: "text-customBlack"
						}`}
					>
						Aircraft Purchase
					</Link>
					<Link
						href="/"
						className={`custom-link font-medium text-customBlue text-sm hover:text- ${
							pathName === "/"
								? "text-customGreen"
								: "text-customBlack"
						}`}
					>
						Aircraft Manangement
					</Link>
				</div>
				<Button
					btnStyles="bg-customBlue hover:bg-[#205063] px-4 py-2 rounded-3xl text-white cursor-pointer"
					btnType="button"
					btnContent="Book Flight"
					handleSubmit={() => router.push("/")}
				/>
			</div>
			<MobileNav />
		</div>
	);
};

export default Navbar;
