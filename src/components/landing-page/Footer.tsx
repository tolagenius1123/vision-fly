import Image from "next/image";
import Link from "next/link";
import FooterIcon from "@/assets/icons/vision.svg";
import { FacebookIcon, IgIcon } from "@/assets/icons";

export default function Footer() {
	return (
		<div className="bg-customBlue h-auto text-white w-full flex flex-col gap-10 md:gap-0 md:flex-row justify-around md:justify-between px-10 md:px-20 py-12">
			<Image src={FooterIcon} alt="footer-icon" className="h-32 w-40" />
			<div className="flex flex-col md:flex-row gap-14 md:gap-20 mb-20">
				<div>
					<h2 className="text-xl font-semibold">Private Charter</h2>
					<div className="flex text-sm flex-col gap-3 mt-2">
						<Link href="/#home">Local: +2348101815572</Link>
						<Link href="/#about">International: +17785224683</Link>
					</div>
				</div>
				<div>
					<h2 className="text-xl font-semibold">Aircraft Purchase</h2>
					<div className="flex text-sm flex-col gap-3 mt-2">
						<Link href="/login">charter@visionfly.com.ng</Link>
					</div>
				</div>
				<div>
					<h2 className="text-xl font-semibold">Follow us</h2>
					<div className="flex text-sm gap-3 mt-2">
						<Link href="/">
							<Image src={FacebookIcon} alt="facebook-icon" />
						</Link>
						<Link href="/">
							<Image src={IgIcon} alt="instagram-icon" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
