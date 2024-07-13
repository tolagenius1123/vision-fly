"use client";
import { VisionFlyIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";

type NavbarProps = {};

const Navbar = ({}: NavbarProps) => {
	const pathName = usePathname();
	const router = useRouter();

	return (
		<div className="w-full py-4 px-20 flex items-center justify-between fixed top-0 z-30 shadow-lg bg-white">
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
						className={`font-medium text-[#065777] hover:text-lightGreen border-b hover:border-[#065777] ${
							pathName === "/"
								? "text-customGreen"
								: "text-customBlack"
						}`}
					>
						About Us
					</Link>
					<Link
						href="/"
						className={`font-medium text-[#065777] hover:text- ${
							pathName === "/"
								? "text-customGreen"
								: "text-customBlack"
						}`}
					>
						Private Charter
					</Link>
				</div>
				<Button
					btnStyles="bg-[#065777] hover:bg-[#205063] px-4 py-2 rounded-3xl text-white cursor-pointer"
					btnType="button"
					btnContent="Book Flight"
					handleSubmit={() => router.push("/")}
				/>
			</div>
		</div>
	);
};

export default Navbar;
