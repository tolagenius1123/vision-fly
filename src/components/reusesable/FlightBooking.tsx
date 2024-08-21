"use client";
import { ChangeEvent, FormEvent, RefObject, useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Copy } from "lucide-react";
import {
	cn,
	convertMinutesToHoursAndMinutes,
	formatKoboToNaira,
	generateDayOptions,
	generateMonthOptions,
	generateYearOptions,
} from "@/lib/utils";
import Image from "next/image";
import { Fcmb } from "@/assets/images";

type FlightBookingProps = {
	form: RefObject<HTMLFormElement>;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	sendEmail: (e: FormEvent<HTMLFormElement>) => void;
	title: string;
	setTitle: (value: string) => void;
	nationality: string;
	setNationality: (value: string) => void;
	passengerInfo: FlightBookingInfo;
	isLoading: boolean;
	airlineName: any;
	originCity: any;
	destinationCity: any;
	amount: any;
	flightTime: any;
	returnOriginCity?: any;
	returnDestinationCity?: any;
	returnFlightTime?: any;
};

const FlightBooking = ({
	form,
	handleChange,
	sendEmail,
	title,
	setTitle,
	nationality,
	setNationality,
	passengerInfo,
	isLoading,
	airlineName,
	originCity,
	destinationCity,
	amount,
	flightTime,
	returnOriginCity,
	returnDestinationCity,
	returnFlightTime,
}: FlightBookingProps) => {
	const { firstName, middleName, surname, email, phoneNumber } =
		passengerInfo;
	const [countries, setCountries] = useState<Country[]>([]);
	const [dateOfBirth, setDateOfBirth] = useState({
		day: "",
		month: "",
		year: "",
	});

	const { day, month, year } = dateOfBirth;
	const dob = `${day}/${month}/${year}`;

	const handleDateOfBirth = (e: FormEvent<HTMLSelectElement>) => {
		const { name, value } = e.currentTarget;
		setDateOfBirth((prev) => ({ ...prev, [name]: value }));
	};

	const accountNumber = "2086216595";

	// console.log(passengerInfo);

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

	const getCountries = async () => {
		try {
			const response = await fetch(
				"https://api.travelbeta.com/v1/api/flight/get-countries",
				{
					headers: {
						"x-api-key": "24c9mti53ykc31z1t5u5",
					},
				}
			);

			const data = await response.json();
			setCountries(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCountries();
	}, []);

	return (
		<form ref={form} onSubmit={sendEmail} className="">
			<div className="w-full grid gap-4 py-4">
				<div className="w-full flex flex-col gap-2">
					<label
						htmlFor="title"
						className="text-customBlue font-bold text-left"
					>
						Title
					</label>
					<Select
						name="title"
						value={title}
						onValueChange={(value) => setTitle(value)}
					>
						<SelectTrigger className="w-[250px] md:w-full">
							<SelectValue placeholder="Select title" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Mr">Mr</SelectItem>
							<SelectItem value="Mrs">Mrs</SelectItem>
							<SelectItem value="Miss">Miss</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-left font-bold text-customBlue">
						Surname
					</label>
					<input
						name="surname"
						type="text"
						placeholder="Surname"
						className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
						value={surname}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-left font-bold text-customBlue">
						First Name
					</label>
					<input
						name="firstName"
						type="text"
						placeholder="firstname"
						className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
						value={firstName}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-left font-bold text-customBlue">
						Middle Name (optional)
					</label>
					<input
						name="middleName"
						type="text"
						placeholder="Middle Name"
						className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
						value={middleName}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-left font-bold text-customBlue">
						Date Of Birth
					</label>
					<div className="w-full flex items-center gap-2">
						<div className="relative w-1/3">
							<select
								name="day"
								id="day"
								className="block appearance-none w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 pr-10 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
								value={dateOfBirth.day}
								onChange={handleDateOfBirth}
							>
								<option value="">Day</option>
								{generateDayOptions().map((day) => (
									<option key={day} value={day}>
										{day}
									</option>
								))}
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
						<div className="relative w-1/3">
							<select
								name="month"
								id="month"
								className="block appearance-none w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 pr-10 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
								value={dateOfBirth.month}
								onChange={handleDateOfBirth}
							>
								<option value="">Month</option>
								{generateMonthOptions().map((month) => (
									<option key={month} value={month}>
										{month}
									</option>
								))}
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

						<div className="relative w-1/2">
							<select
								name="year"
								id="year"
								className="block appearance-none w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 pr-10 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
								value={dateOfBirth.year}
								onChange={handleDateOfBirth}
							>
								<option value="">Year</option>
								{generateYearOptions().map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
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
				</div>
				<div className="relative">
					<div className="flex flex-col gap-2">
						<label
							htmlFor="nationality"
							className="text-customBlue font-bold"
						>
							Nationality
						</label>
						<select
							name="nationality"
							id="nationality"
							className="block appearance-none w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
							value={nationality}
							onChange={(e) => setNationality(e.target.value)}
						>
							<option value="">Select nationality</option>{" "}
							{countries.map((country) => (
								<option key={country.code} value={country.name}>
									{country.name}
								</option>
							))}
						</select>
						<div className="pointer-events-none absolute inset-y-0 top-8 right-0 flex items-center text-gray-700">
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
				<div className="flex flex-col gap-2">
					<label className="text-left font-bold text-customBlue">
						Email
					</label>
					<input
						name="email"
						type="email"
						placeholder="Enter a valid email..."
						className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
						value={email}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-left font-bold text-customBlue">
						Phone number
					</label>
					<input
						name="phoneNumber"
						type="text"
						placeholder="Enter a valid phone number..."
						className="w-[250px] md:w-full text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
						value={phoneNumber}
						onChange={handleChange}
					/>
				</div>
				{/* HIDDEN INPUTS */}
				<div>
					<input type="hidden" name="airline" value={airlineName} />
					<input type="hidden" name="origin" value={originCity} />
					<input
						type="hidden"
						name="destination"
						value={destinationCity}
					/>
					<input
						type="hidden"
						name="price"
						value={formatKoboToNaira(amount)}
					/>
					<input
						type="hidden"
						name="flightTime"
						value={convertMinutesToHoursAndMinutes(flightTime)}
					/>
					<input type="hidden" name="dateOfBirth" value={dob} />
					<input
						type="hidden"
						name="returnAirline"
						value={airlineName}
					/>
					<input
						type="hidden"
						name="returnOrigin"
						value={returnOriginCity}
					/>
					<input
						type="hidden"
						name="returnDestination"
						value={returnDestinationCity}
					/>
					<input
						type="hidden"
						name="returnFlightTime"
						value={convertMinutesToHoursAndMinutes(
							returnFlightTime
						)}
					/>
				</div>
			</div>
			<div className="flex flex-col text-gray-500">
				<p className="text-sm">Pay with bank transfer</p>
				<p className="text-sm">{`Booking amount: ${formatKoboToNaira(
					amount
				)}`}</p>
			</div>
			<div className="mt-2 border rounded-xl shadow-md px-5 py-5 flex flex-col gap-3">
				<div className="">
					<Image src={Fcmb} alt="bank-logo" />
				</div>
				<div className="text-sm">
					<h2 className="font-semibold">First City Monument Bank</h2>
					<p>
						<span className="font-semibold">Account Name:</span>
					</p>
					<p>Vision Fly</p>
				</div>
				<div className="text-sm">
					<div className="flex items-center justify-between">
						<div className="">
							<p className="font-semibold">Account Number:</p>
							<p>2086216595</p>
						</div>
						<button type="button" onClick={handleCopy}>
							<Copy className="h-4 w-4 text-gray-500" />
						</button>
					</div>
				</div>
			</div>
			<div className="">
				<button
					type="submit"
					disabled={isLoading}
					className={cn(
						"mt-5 bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around",
						isLoading && "opacity-30"
					)}
				>
					{isLoading ? "Booking..." : "Book now"}
				</button>
			</div>
		</form>
	);
};

export default FlightBooking;
