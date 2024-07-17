"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "./Button";
import PrivateAircraft from "@/assets/images/private-aircraft.jpg";
import { ArrowRight } from "lucide-react";

const Services = () => {
	const router = useRouter();

	return (
		<div className="w-full flex flex-col">
			<div className="w-full flex flex-col md:flex-row">
				<div className="w-full md:w-1/2">
					<Image
						src={PrivateAircraft}
						alt="private plane"
						className="h-full"
					/>
				</div>
				<div className="w-full md:w-1/2 text-customBlue py-10 md:py-20 px-10 md:px-20">
					<h1 className="text-2xl md:text-4xl font-bold mt-2">
						You provide the destination, we provide the jet.
					</h1>
					<p className="mt-4">
						Where do you want to go today? Let us know, and in
						little as 8 hours, your private jet will be ready to
						take you there. Imagine no longer worrying about the
						quality of your aircraft, safety or travel experience;
						it's your jet and it's ready when you are.
					</p>
					<div className="flex items-center gap-3 mt-4 bg-customBlue hover:bg-[#205063] w-[205px] px-6 py-3 rounded-3xl text-white cursor-pointer">
						Charter Flights <ArrowRight className="animate-arrow" />
					</div>
				</div>
			</div>
			<div className="w-full flex flex-col-reverse md:flex-row">
				<div className="w-full md:w-1/2 text-customBlue py-10 md:py-20 px-10 md:px-20">
					<h1 className="text-2xl md:text-4xl font-bold mt-2">
						Purchasing an Aircraft
					</h1>
					<p className="mt-4">
						We’ll do the research for you, we’ll keep you educated
						on the best brands and options, and we’ll secure the
						absolute best price for used aircraft. Flightpath
						provides insightful purchase planning, a consulting
						service that keeps your best interests in mind, plus a
						detailed needs analysis, travel history analysis,
						financial analysis, and much more.
					</p>
					<div className="flex items-center gap-3 mt-4 bg-customBlue hover:bg-[#205063] w-[205px] px-6 py-3 rounded-3xl text-white cursor-pointer">
						Purchase a jet <ArrowRight className="animate-arrow" />
					</div>
				</div>
				<div className="w-full md:w-1/2">
					<Image src={PrivateAircraft} alt="private plane" />
				</div>
			</div>
		</div>
	);
};

export default Services;
