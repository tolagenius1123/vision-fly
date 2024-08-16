"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import { AddressIcon, EmailIcon, PhoneIcon } from "@/assets/icons";
import toast from "react-hot-toast";

export default function ContactUs() {
	const schema = z.object({
		fullName: z.string().min(1, { message: "Full name is required" }),
		email: z.string().email({ message: "Invalid email address" }),
		subjectOfMail: z.string().min(1, { message: "Subject is required" }),
		message: z.string().min(1, { message: "Message is required" }),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log(data);

		toast.success("Message sent successfully");
		setTimeout(() => {
			reset();
		}, 2000);
	};

	return (
		<div
			id="contact"
			className="bg-white h-auto w-full px-8 md:px-14 py-14 text-custborder-customBlue relative"
		>
			<div className="w-full flex flex-col-reverse md:flex-row gap-2">
				<div className="w-full md:w-1/2">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="h-auto bg-white rounded-xl md:px-14 py-10"
					>
						<h1 className="text-[40px] md:text-[50px] text-customBlue">
							Contact Us
						</h1>
						<div className="mt-5">
							<input
								{...register("fullName")}
								name="fullName"
								type="text"
								placeholder="Full name"
								className="text-sm rounded-3xl w-full h-[40px] border-2 border-customBlue px-5 bg-[#F9F9F9]"
							/>
							{errors.fullName && (
								<p className="text-red-500 mt-1 text-sm">
									{errors.fullName.message as string}
								</p>
							)}
						</div>
						<div className="mt-8">
							<input
								{...register("email")}
								name="email"
								type="text"
								placeholder="Email address"
								className="text-sm rounded-3xl w-full h-[40px] border-2 border-customBlue px-5 bg-[#F9F9F9]"
							/>
							{errors.email && (
								<p className="text-red-500 mt-1 text-sm">
									{errors.email.message as string}
								</p>
							)}
						</div>
						<div className="mt-8">
							<input
								{...register("subjectOfMail")}
								name="subjectOfMail"
								type="text"
								placeholder="Subject"
								className="text-sm  rounded-3xl w-full h-[40px] border-2 border-customBlue px-5 bg-[#F9F9F9]"
							/>
							{errors.subjectOfMail && (
								<p className="text-red-500 mt-1 text-sm">
									{errors.subjectOfMail.message as string}
								</p>
							)}
						</div>
						<div className="mt-8">
							<textarea
								{...register("message")}
								name="message"
								id="message"
								placeholder="Write a brief description of your request"
								className=" text-sm rounded-3xl w-full h-[240px] border-2 border-customBlue px-5 py-3 bg-[#F9F9F9] resize-none"
							></textarea>
							{errors.message && (
								<p className="text-red-500 mt-1 text-sm">
									{errors.message.message as string}
								</p>
							)}
						</div>
						<Button
							btnContent="Send"
							btnStyles="bg-customBlue text-white rounded-3xl cursor-pointer h-[50px] w-[150px] mt-8"
							btnType="submit"
						/>
					</form>
				</div>
				<div className="w-full md:w-1/2 flex md:justify-around mt-10 md:mt-28 text-customBlue">
					<div className="flex flex-col gap-5">
						<div className="flex items-center gap-3">
							<Image src={EmailIcon} alt="email-icon" />
							<p className="text-sm md:text-lg">
								charter@visionfly.com.ng
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Image src={PhoneIcon} alt="phone-icon" />
							<p className="text-sm md:text-lg">
								+234 8101815572, +1 7785224683
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Image src={AddressIcon} alt="address-icon" />
							<p className="text-sm md:text-lg">
								14 Temple street, Abuja, Nigeria.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
