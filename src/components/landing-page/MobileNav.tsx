"use client";
import Image from "next/image";
import Link from "next/link";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";
// import { FacebookIcon, InstagramIcon, MobileMenu } from "@/assets/icons";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import { Menu } from "lucide-react";

export default function MobileNav() {
	const pathName = usePathname();
	const router = useRouter();
	return (
		<Sheet>
			<SheetTrigger asChild>
				<button className="cursor-pointer md:hidden">
					<Menu className="text-[#065777] h-10 w-10" />
				</button>
			</SheetTrigger>
			<SheetContent>
				<div className="mt-5">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-4">
							<Link
								href="/#home"
								className={`font-medium hover:text-lightGreen ${
									pathName === "/#home"
										? "text-customBlue"
										: "text-customBlack"
								}`}
							>
								<SheetClose>Home</SheetClose>
							</Link>
							<Link
								href="/#services"
								className={`font-medium hover:text-lightGreen ${
									pathName === "/empty-leg"
										? "text-customBlue"
										: "text-customBlack"
								}`}
							>
								<SheetClose>Empty Leg</SheetClose>
							</Link>
							<Link
								href="/"
								className={`font-medium hover:text-lightGreen ${
									pathName === "/private-charter"
										? "text-customBlue"
										: "text-customBlack"
								}`}
							>
								<SheetClose>Private Charter</SheetClose>
							</Link>
							{/* <Link
								href=""
								className={`font-medium hover:text-lightGreen ${
									pathName === "/"
										? "text-customBlue"
										: "text-customBlack"
								}`}
							>
								<SheetClose>Vacation Packages</SheetClose>
							</Link> */}
							{/* <Link
								href="/"
								className={`font-medium hover:text-lightGreen ${
									pathName === "/"
										? "text-customBlue"
										: "text-customBlack"
								}`}
							>
								<SheetClose>Aircraft Purchase</SheetClose>
							</Link> */}
							{/* <Link
								href="/"
								className={`font-medium hover:text-lightGreen ${
									pathName === "/"
										? "text-customBlue"
										: "text-customBlack"
								}`}
							>
								<SheetClose>Aircraft Management</SheetClose>
							</Link> */}
						</div>
						<Button
							btnType="button"
							btnStyles="bg-customBlue w-[150px] hover:bg-lightGreen py-2 rounded-3xl text-white cursor-pointer"
							btnContent="Book Flight"
							handleSubmit={() => router.push("#bookflight")}
						/>
					</div>
					{/* <div className="mt-5">
						<h2>socials</h2>
						<div className="flex items-center gap-4">
							<Link href="/">
								<Image src={FacebookIcon} alt="facebook" />
							</Link>
							<Link href="/">
								<Image src={InstagramIcon} alt="instagram" />
							</Link>
						</div>
					</div> */}
				</div>
			</SheetContent>
		</Sheet>
	);
}
