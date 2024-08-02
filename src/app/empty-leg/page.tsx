"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/landing-page/Button";
import Navbar from "@/components/landing-page/Navbar";
import React from "react";
import Image from "next/image";
import { EmptyLegPic } from "@/assets/images";
import { ArrowRight, Plane } from "lucide-react";
import Footer from "@/components/landing-page/Footer";

export default function EmptyLeg() {
	const router = useRouter();

	return (
		<main className="h-auto w-full bg-slate-50">
			<Navbar />
			<div className="pt-[150px] md:pt-[100px] w-full h-[110vh] md:h-[120vh] px-5 md:px-20 bg-slate-50 flex flex-col md:flex-row items-center gap-10 md:gap-4">
				<div className="w-full md:w-1/2">
					<h1 className="text-[50px] md:text-[60px] leading-[55px] md:leading-none font-semibold">
						Empty Leg
					</h1>
					<p className="text-lg md:text-xl mt-4 md:mt-5">
						Empty legs are all private charter flights that fly
						without passengers on their way to reposition themselves
						from one airport to another. Browse our list below and
						save up to 90% on the price of your private jet flight
						today.
					</p>
				</div>
				<div className="w-full md:w-1/2 flex justify-end  items-end">
					<Image
						src={EmptyLegPic}
						alt="empty-leg-image"
						className="w-[500px] h-[300px] md:h-[450px] rounded-lg shadow-xl"
					/>
				</div>
			</div>
			<div className="mt-5 md:mt-10 w-full px-10 md:px-20 pt-[10px] md:pt-[50px] pb-[50px] bg-slate-50">
				<div className="flex flex-col gap-2 text-left md:text-center justify-center items-center">
					<p className="w-auto md:w-[600px] text-customBlue text-center text-2xl md:text-4xl font-semibold">
						Subscribe to receive available empty leg notification
						for FREE
					</p>
				</div>
				<div className="flex  text-center justify-around items-center">
					<div className="flex w-[280px] md:w-auto text-xl md:text-2xl items-center gap-8 mt-4 bg-customBlue hover:bg-[#205063] px-6 py-3 rounded-3xl text-white cursor-pointer">
						Subscribe for free{" "}
						<ArrowRight className="animate-arrow h-6 w-6 md:h-10 md:w-10" />
					</div>
				</div>
			</div>
			<div className="w-full px-10 md:px-20 pt-[20px] md:pt-[40px] pb-[50px] md:pb-[150px] bg-slate-50">
				<div className="flex flex-col gap-2 text-center justify-center items-center">
					<p className="text-customBlue text-xl md:text-4xl">
						CHECK OUT OUR FREQUENT EMPTY LEG ROUTES
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-10">
					<div className="w-auto h-auto md:h-[300px] md:w-[350px] border border-customBlue rounded-lg shadow-xl p-5 flex flex-col items-center justify-center cursor-pointer ">
						<p className="text-customBlue text-xl font-semibold">
							ABUJA TO LAGOS
						</p>
						<Plane className="h-[100px] w-[100px] text-customBlue " />
						<p className="mt-2 text-customBlue text-xl font-bold">
							$1000
						</p>
						<p className="text-customBlue text-center">
							Available from 1st of September
						</p>
						<Button
							btnStyles="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:text-white text-white border border-white px-4 md:px-10 py-2 rounded-3xl text-white cursor-pointer transition duration-1000 ease-in-out"
							btnType="button"
							btnContent="INQUIRE"
							handleSubmit={() => router.push("/")}
						/>
					</div>
					<div className="w-auto h-auto md:h-[300px] md:w-[350px] border border-customBlue rounded-lg shadow-xl p-5 flex flex-col items-center justify-center cursor-pointer">
						<p className="text-customBlue text-xl font-semibold">
							ABUJA TO LAGOS
						</p>
						<Plane className="h-[100px] w-[100px] text-customBlue " />
						<p className="mt-2 text-customBlue text-xl font-bold">
							$1000
						</p>
						<p className="text-customBlue text-center">
							Available from 1st of September
						</p>
						<Button
							btnStyles="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:text-white text-white border border-white px-4 md:px-10 py-2 rounded-3xl text-white cursor-pointer transition duration-1000 ease-in-out"
							btnType="button"
							btnContent="INQUIRE"
							handleSubmit={() => router.push("/")}
						/>
					</div>
					<div className="w-auto h-auto md:h-[300px] md:w-[350px] border border-customBlue rounded-lg shadow-xl p-5 flex flex-col items-center justify-center cursor-pointer">
						<p className="text-customBlue text-xl font-semibold">
							ABUJA TO LAGOS
						</p>
						<Plane className="h-[100px] w-[100px] text-customBlue " />
						<p className="mt-2 text-customBlue text-xl font-bold">
							$1000
						</p>
						<p className="text-customBlue text-center">
							Available from 1st of September
						</p>
						<Button
							btnStyles="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:text-white text-white border border-white px-4 md:px-10 py-2 rounded-3xl text-white cursor-pointer transition duration-1000 ease-in-out"
							btnType="button"
							btnContent="INQUIRE"
							handleSubmit={() => router.push("/")}
						/>
					</div>
					<div className="w-auto h-auto md:h-[300px] md:w-[350px] border border-customBlue rounded-lg shadow-xl p-5 flex flex-col items-center justify-center cursor-pointer">
						<p className="text-customBlue text-xl font-semibold">
							ABUJA TO LAGOS
						</p>
						<Plane className="h-[100px] w-[100px] text-customBlue " />
						<p className="mt-2 text-customBlue text-xl font-bold">
							$1000
						</p>
						<p className="text-customBlue text-center">
							Available from 1st of September
						</p>
						<Button
							btnStyles="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:text-white text-white border border-white px-4 md:px-10 py-2 rounded-3xl text-white cursor-pointer transition duration-1000 ease-in-out"
							btnType="button"
							btnContent="INQUIRE"
							handleSubmit={() => router.push("/")}
						/>
					</div>
					<div className="w-auto h-auto md:h-[300px] md:w-[350px] border border-customBlue rounded-lg shadow-xl p-5 flex flex-col items-center justify-center cursor-pointer">
						<p className="text-customBlue text-xl font-semibold">
							ABUJA TO LAGOS
						</p>
						<Plane className="h-[100px] w-[100px] text-customBlue " />
						<p className="mt-2 text-customBlue text-xl font-bold">
							$1000
						</p>
						<p className="text-customBlue text-center">
							Available from 1st of September
						</p>
						<Button
							btnStyles="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:text-white text-white border border-white px-4 md:px-10 py-2 rounded-3xl text-white cursor-pointer transition duration-1000 ease-in-out"
							btnType="button"
							btnContent="INQUIRE"
							handleSubmit={() => router.push("/")}
						/>
					</div>
					<div className="w-auto h-auto md:h-[300px] md:w-[350px] border border-customBlue rounded-lg shadow-xl p-5 flex flex-col items-center justify-center cursor-pointer">
						<p className="text-customBlue text-xl font-semibold">
							ABUJA TO LAGOS
						</p>
						<Plane className="h-[100px] w-[100px] text-customBlue " />
						<p className="mt-2 text-customBlue text-xl font-bold">
							$1000
						</p>
						<p className="text-customBlue text-center">
							Available from 1st of September
						</p>
						<Button
							btnStyles="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:text-white text-white border border-white px-4 md:px-10 py-2 rounded-3xl text-white cursor-pointer transition duration-1000 ease-in-out"
							btnType="button"
							btnContent="INQUIRE"
							handleSubmit={() => router.push("/")}
						/>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
