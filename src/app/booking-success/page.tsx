"use client";
import { Fcmb } from "@/assets/images";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BookingSuccess = () => {
	const accountNumber = "2086216595";

	const handleCopy = () => {
		navigator.clipboard
			.writeText(accountNumber)
			.then(() => {
				console.log("Account number copied to clipboard!");
				// You can add feedback to the user here, such as showing a toast notification
			})
			.catch((err) => {
				console.error("Failed to copy account number: ", err);
			});
	};

	return (
		<div className="h-screen w-full bg-white flex items-center justify-around p-5 md:p-0">
			<div className="w-full md:w-1/2 flex flex-col gap-2 items-center">
				<div className="flex flex-col gap-2 items-center">
					<div className="p-3 bg-slate-200 rounded-full">
						<Check className="h-12 w-12 text-green-500" />
					</div>
					<h1 className="text-xl font-semibold">
						Booking Confirmation
					</h1>
					<p className="text-sm w-10/12">
						Thank you, your booking order will be processed soon.
						You will be contacted soon by our agent as your booking
						is being processed
					</p>
					<Link
						href="/"
						className="px-4 py-2 bg-customBlue hover:bg-[#205063] text-white rounded-lg mt-2"
					>
						Back Home
					</Link>
				</div>
				<div className="mt-2 flex flex-col text-center gap-3">
					<h1 className="text-sm font-semibold">
						If you haven&apos;t made payment, you can transfer to
						the any of the banks below
					</h1>
					<div className="flex items-center justify-around">
						<div className="w-full md:w-1/2 bg-white border rounded-xl shadow-md px-5 py-10 flex flex-col gap-2">
							<div className="">
								<Image src={Fcmb} alt="bank-logo" />
							</div>
							<div className="text-left text-sm">
								<h2 className="font-semibold">
									First City Monument Bank
								</h2>
								<p>
									<span className="font-semibold">
										Account Name:
									</span>
								</p>
								<p>Vision Fly</p>
							</div>
							<div className="text-left text-sm">
								<div className="flex items-center justify-between">
									<div className="">
										<p className="font-semibold">
											Account Number:
										</p>
										<p>2086216595</p>
									</div>
									<button type="button" onClick={handleCopy}>
										<Copy className="h-4 w-4 text-gray-500" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingSuccess;
