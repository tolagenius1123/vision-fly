"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PrivateJet, PrivateAircraft, PurchasePlane } from "@/assets/images";
import Link from "next/link";

const Services = () => {
	const router = useRouter();

	return (
		<>
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
							quality of your aircraft, safety or travel
							experience; its your jet and its ready when you are.
						</p>
						<Link
							href="/private-charter"
							className="flex items-center gap-3 mt-4 bg-customBlue hover:bg-[#205063] w-[205px] px-6 py-3 rounded-3xl text-white cursor-pointer"
						>
							Charter Flights{" "}
							<ArrowRight className="animate-arrow" />
						</Link>
					</div>
				</div>
				<div className="w-full flex flex-col-reverse md:flex-row">
					<div className="w-full md:w-1/2 text-customBlue py-10 md:py-20 px-10 md:px-20">
						<h1 className="text-2xl md:text-4xl font-bold mt-2">
							Purchasing an Aircraft
						</h1>
						<p className="mt-4">
							We will do the research for you, we will keep you
							educated on the best brands and options, and we will
							secure the absolute best price for used aircraft.
							Flightpath provides insightful purchase planning, a
							consulting service that keeps your best interests in
							mind, plus a detailed needs analysis, travel history
							analysis, financial analysis, and much more.
						</p>
						<Link
							href="/aircraft-purchase"
							className="flex items-center gap-3 mt-4 bg-customBlue hover:bg-[#205063] w-[205px] px-6 py-3 rounded-3xl text-white cursor-pointer"
						>
							Purchase a jet{" "}
							<ArrowRight className="animate-arrow" />
						</Link>
					</div>
					<div className="w-full h-full md:w-1/2">
						<Image
							src={PurchasePlane}
							alt="private plane"
							style={{ objectFit: "cover" }}
						/>
					</div>
				</div>
			</div>
			<div className="aircraftManagementBackgroundPic w-full h-[600px] flex justify-around items-center">
				<div className="bg-white bg-opacity-20 backdrop-blur-xl w-[600px] flex flex-col justify-around gap-3 items-center rounded-lg text-white py-8 px-5 md:px-10">
					<h1 className="font-bold text-2xl md:text-3xl">
						Aircraft Management
					</h1>
					<h2 className="font-bold text-center text-lg md:text-xl">
						When we manage your aircraft we treat it as we would our
						own
					</h2>
					<p className="font-medium md:font-semibold text-center">
						Visionfly management offerings follow the same standard
						as our travel services, and seamlessly tie into them as
						well. It&aposs all about creating a hands-free
						experience for you. When we talk about our private
						flights we like to say that they allow our customers to
						travel on autopilot; our management services are no
						different.
					</p>
					<Link
						href="/"
						className="flex items-center gap-3 mt-4 bg-customBlue hover:bg-[#205063] px-6 py-3 rounded-3xl text-white cursor-pointer"
					>
						Read more <ArrowRight className="animate-arrow" />
					</Link>
				</div>
			</div>
		</>
	);
};

export default Services;
