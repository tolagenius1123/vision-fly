"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/landing-page/Button";
import Navbar from "@/components/landing-page/Navbar";
import React, { useState } from "react";
import Image from "next/image";
import { EmptyLegPic } from "@/assets/images";
import { ArrowRight, Plane } from "lucide-react";
import Footer from "@/components/landing-page/Footer";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn, generateMonthOptions } from "@/lib/utils";
import toast from "react-hot-toast";

export default function EmptyLeg() {
	const [email, setEmail] = useState("");
	const [isSubscribeOpen, setIsSubscribedOpen] = useState(false);
	const [isInquiryOpen, setIsInquiryOpen] = useState(false);
	const [userInquiryInfo, setUserInquiryInfo] = useState({
		fullName: "",
		emailAddress: "",
		phoneNumber: "",
		numberOfPassengers: "",
		originLocation: "",
		destinationLocation: "",
	});

	const handleInquiryChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.currentTarget;
		setUserInquiryInfo((prev) => ({ ...prev, [name]: value }));
	};

	const subscribe = () => {
		if (!email) {
			toast.error("Please enter a valid email");
			return;
		}

		setIsSubscribedOpen(false);
		toast.success("You have successfully subscribed to our mail list");
	};

	const inquireEmptyLeg = () => {
		console.log(userInquiryInfo);
		setIsInquiryOpen(false);
		toast.success("You request was sent successfully");
	};

	return (
		<main className="h-auto w-full bg-slate-50">
			<Navbar />
			<div className="pt-[150px] md:pt-[100px] w-full h-[100vh] md:h-[120vh] px-5 md:px-20 bg-slate-50 flex flex-col md:flex-row items-center gap-10 md:gap-4">
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
				<div className="w-full md:w-1/2 flex justify-end items-end">
					<Image
						src={EmptyLegPic}
						alt="empty-leg-image"
						className="rounded-xl shadow-xl"
					/>
				</div>
			</div>
			<div className="md:mt-10 w-full px-10 md:px-20 pb-[50px] bg-slate-50">
				<div className="flex flex-col gap-2 text-left md:text-center justify-center items-center">
					<p className="w-auto md:w-[600px] text-customBlue text-center text-2xl md:text-4xl font-semibold">
						Subscribe to receive available empty leg notification
						for FREE
					</p>
				</div>
				<div className="flex  text-center justify-around items-center">
					<Dialog
						open={isSubscribeOpen}
						onOpenChange={() =>
							setIsSubscribedOpen(!isSubscribeOpen)
						}
					>
						<DialogTrigger asChild>
							<div className="flex md:w-auto text-lg md:text-2xl items-center gap-4 md:gap-4 mt-4 bg-customBlue hover:bg-blue-700 px-8 py-3 rounded-[50px] text-white cursor-pointer transition duration-1000 ease-in-out">
								Subscribe{" "}
								<ArrowRight className="animate-arrow h-6 w-6 md:h-10 md:w-10" />
							</div>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<h2 className="text-customBlue font-bold text-xl">
								Subscribe to our mail list
							</h2>
							<div className="flex flex-col gap-1">
								<label className="text-left font-semibold text-customBlue">
									Email
								</label>
								<input
									name="email"
									type="email"
									placeholder="Enter a valid email..."
									className="w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<DialogFooter>
								<button
									type="button"
									className={cn(
										"mt-5 bg-customBlue text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-[#205063] flex items-center justify-around"
									)}
									onClick={subscribe}
								>
									Save
								</button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
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
						<Dialog
							open={isInquiryOpen}
							onOpenChange={() =>
								setIsInquiryOpen(!isInquiryOpen)
							}
						>
							<DialogTrigger asChild>
								<button className="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:bg-blue-700 text-white border border-white px-4 md:px-10 py-2 rounded-3xl cursor-pointer transition duration-1000 ease-in-out">
									Inquire
								</button>
							</DialogTrigger>
							<DialogContent className="custom-scrollbar h-[500px] w-[300px] md:w-[500px] overflow-hidden overflow-y-scroll">
								<DialogHeader>
									<DialogTitle>
										Inquire about this flight
									</DialogTitle>
									<DialogDescription>
										Your contact details to reach you
									</DialogDescription>
								</DialogHeader>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Full Name
									</label>
									<input
										name="fullName"
										type="fullName"
										placeholder="Enter your full name"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.fullName}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Email
									</label>
									<input
										name="emailAddress"
										type="emailAddress"
										placeholder="Enter a valid email"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.emailAddress}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Phone number
									</label>
									<input
										name="phoneNumber"
										type="text"
										placeholder="Enter phone number"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.phoneNumber}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-bold text-customBlue">
										Number of Passengers
									</label>
									<div className="relative w-full cursor-pointer">
										<select
											name="numberOfPassengers"
											id="numberOfPassengers"
											className="block appearance-none w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 pr-10 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none cursor-pointer"
											value={
												userInquiryInfo.numberOfPassengers
											}
											onChange={handleInquiryChange}
										>
											<option
												value=""
												className="text-gray-200"
											>
												Select number of passengers
											</option>
											{generateMonthOptions().map(
												(month) => (
													<option
														key={month}
														value={month}
													>
														{month}
													</option>
												)
											)}
										</select>
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-700">
											<svg
												className="w-4 h-4 mr-2"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</div>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Origin
									</label>
									<input
										name="originLocation"
										type="text"
										placeholder="Enter current location"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.originLocation}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Destination
									</label>
									<textarea
										name="destinationLocation"
										id="destinationLocation"
										placeholder="Enter location or multiple locations"
										className="w-[250px] md:w-full text-sm rounded-lg h-[200px] md:h-[250px] border border-customBlue p-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none resize-none"
										value={
											userInquiryInfo.destinationLocation
										}
										onChange={handleInquiryChange}
									></textarea>
								</div>
								<DialogFooter>
									<button
										type="button"
										className={cn(
											"w-[250px] md:w-full mt-5 bg-customBlue text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-[#205063] flex items-center justify-around"
										)}
										onClick={inquireEmptyLeg}
									>
										Inquire
									</button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
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
						<Dialog
							open={isInquiryOpen}
							onOpenChange={() =>
								setIsInquiryOpen(!isInquiryOpen)
							}
						>
							<DialogTrigger asChild>
								<button className="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:bg-blue-700 text-white border border-white px-4 md:px-10 py-2 rounded-3xl cursor-pointer transition duration-1000 ease-in-out">
									Inquire
								</button>
							</DialogTrigger>
							<DialogContent className="custom-scrollbar h-[500px] w-[300px] md:w-[500px] overflow-hidden overflow-y-scroll">
								<DialogHeader>
									<DialogTitle>
										Inquire about this flight
									</DialogTitle>
									<DialogDescription>
										Your contact details to reach you
									</DialogDescription>
								</DialogHeader>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Full Name
									</label>
									<input
										name="fullName"
										type="fullName"
										placeholder="Enter your full name"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.fullName}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Email
									</label>
									<input
										name="emailAddress"
										type="emailAddress"
										placeholder="Enter a valid email"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.emailAddress}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Phone number
									</label>
									<input
										name="phoneNumber"
										type="text"
										placeholder="Enter phone number"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.phoneNumber}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-bold text-customBlue">
										Number of Passengers
									</label>
									<div className="relative w-full cursor-pointer">
										<select
											name="numberOfPassengers"
											id="numberOfPassengers"
											className="block appearance-none w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 pr-10 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none cursor-pointer"
											value={
												userInquiryInfo.numberOfPassengers
											}
											onChange={handleInquiryChange}
										>
											<option
												value=""
												className="text-gray-200"
											>
												Select number of passengers
											</option>
											{generateMonthOptions().map(
												(month) => (
													<option
														key={month}
														value={month}
													>
														{month}
													</option>
												)
											)}
										</select>
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-700">
											<svg
												className="w-4 h-4 mr-2"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</div>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Origin
									</label>
									<input
										name="originLocation"
										type="text"
										placeholder="Enter current location"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.originLocation}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Destination
									</label>
									<textarea
										name="destinationLocation"
										id="destinationLocation"
										placeholder="Enter location or multiple locations"
										className="w-[250px] md:w-full text-sm rounded-lg h-[200px] md:h-[250px] border border-customBlue p-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none resize-none"
										value={
											userInquiryInfo.destinationLocation
										}
										onChange={handleInquiryChange}
									></textarea>
								</div>
								<DialogFooter>
									<button
										type="button"
										className={cn(
											"w-[250px] md:w-full mt-5 bg-customBlue text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-[#205063] flex items-center justify-around"
										)}
										onClick={inquireEmptyLeg}
									>
										Inquire
									</button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
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
						<Dialog
							open={isInquiryOpen}
							onOpenChange={() =>
								setIsInquiryOpen(!isInquiryOpen)
							}
						>
							<DialogTrigger asChild>
								<button className="mt-2 md:mt-4 md:text-[15px] bg-customBlue hover:bg-blue-700 text-white border border-white px-4 md:px-10 py-2 rounded-3xl cursor-pointer transition duration-1000 ease-in-out">
									Inquire
								</button>
							</DialogTrigger>
							<DialogContent className="custom-scrollbar h-[500px] w-[300px] md:w-[500px] overflow-hidden overflow-y-scroll">
								<DialogHeader>
									<DialogTitle>
										Inquire about this flight
									</DialogTitle>
									<DialogDescription>
										Your contact details to reach you
									</DialogDescription>
								</DialogHeader>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Full Name
									</label>
									<input
										name="fullName"
										type="fullName"
										placeholder="Enter your full name"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.fullName}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Email
									</label>
									<input
										name="emailAddress"
										type="emailAddress"
										placeholder="Enter a valid email"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.emailAddress}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Phone number
									</label>
									<input
										name="phoneNumber"
										type="text"
										placeholder="Enter phone number"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.phoneNumber}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-bold text-customBlue">
										Number of Passengers
									</label>
									<div className="relative w-full cursor-pointer">
										<select
											name="numberOfPassengers"
											id="numberOfPassengers"
											className="block appearance-none w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 pr-10 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none cursor-pointer"
											value={
												userInquiryInfo.numberOfPassengers
											}
											onChange={handleInquiryChange}
										>
											<option
												value=""
												className="text-gray-200"
											>
												Select number of passengers
											</option>
											{generateMonthOptions().map(
												(month) => (
													<option
														key={month}
														value={month}
													>
														{month}
													</option>
												)
											)}
										</select>
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-700">
											<svg
												className="w-4 h-4 mr-2"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</div>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Origin
									</label>
									<input
										name="originLocation"
										type="text"
										placeholder="Enter current location"
										className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
										value={userInquiryInfo.originLocation}
										onChange={handleInquiryChange}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-left font-semibold text-customBlue">
										Destination
									</label>
									<textarea
										name="destinationLocation"
										id="destinationLocation"
										placeholder="Enter location or multiple locations"
										className="w-[250px] md:w-full text-sm rounded-lg h-[200px] md:h-[250px] border border-customBlue p-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none resize-none"
										value={
											userInquiryInfo.destinationLocation
										}
										onChange={handleInquiryChange}
									></textarea>
								</div>
								<DialogFooter>
									<button
										type="button"
										className={cn(
											"w-[250px] md:w-full mt-5 bg-customBlue text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-[#205063] flex items-center justify-around"
										)}
										onClick={inquireEmptyLeg}
									>
										Inquire
									</button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
