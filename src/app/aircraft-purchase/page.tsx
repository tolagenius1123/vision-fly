import { EmptyLegPic, AircraftPurchase as Aircraft } from "@/assets/images";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import Image from "next/image";

export default function AircraftPurchase() {
	return (
		<main className="h-auto w-full bg-slate-50">
			<Navbar />
			<div className="pt-[150px] md:pt-[100px] w-full h-[100vh] md:h-[120vh] px-5 md:px-20 bg-slate-50 flex flex-col md:flex-row items-center gap-10 md:gap-4">
				<div className="w-full md:w-1/2">
					<h1 className="text-[50px] md:text-[60px] leading-[50px] md:leading-[70px] font-semibold">
						Thinking About Buying an Aircraft ?
					</h1>
					<p className="text-xl md:text-[30px] mt-4 md:mt-2">
						Let us take care of everything
					</p>
				</div>
				<div className="w-full md:w-1/2 flex justify-end items-end">
					<Image
						src={Aircraft}
						alt="aircraft-purchase"
						className="rounded-xl shadow-xl"
					/>
				</div>
			</div>
			<Footer />
		</main>
	);
}
