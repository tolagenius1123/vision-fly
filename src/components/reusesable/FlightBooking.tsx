"use client";
import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	RefObject,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Copy } from "lucide-react";
import { format } from "date-fns";
import {
	cn,
	convertMinutesToHoursAndMinutes,
	formatKoboToNaira,
} from "@/lib/utils";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	dob: dayjs.Dayjs | null | undefined;
	setDob: Dispatch<SetStateAction<dayjs.Dayjs | null | undefined>>;
	isLoading: boolean;
	airlineName: any;
	originCity: any;
	destinationCity: any;
	amount: any;
	flightTime: any;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
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
	dob,
	setDob,
	isLoading,
	airlineName,
	originCity,
	destinationCity,
	amount,
	flightTime,
	step,
	setStep,
}: FlightBookingProps) => {
	const { firstName, middleName, surname, email, phoneNumber } =
		passengerInfo;
	const [countries, setCountries] = useState<Country[]>([]);

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
			console.log(data.data);
			setCountries(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCountries();
	}, []);

	return (
		<DialogContent className="h-[500px] max-w-[425px] rounded-md overflow-y-scroll">
			<DialogHeader>
				<DialogTitle>
					{step === 1
						? "Traveller's Information"
						: "Pay with bank transfer"}
				</DialogTitle>
				<DialogDescription>
					{step === 1
						? "Passengers details must be entered as it appears on the passport or ID."
						: `Booking amount: ${formatKoboToNaira(amount)}`}
				</DialogDescription>
			</DialogHeader>
			<form ref={form} onSubmit={sendEmail}>
				{step === 1 && (
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-2">
							<label
								htmlFor="title"
								className="text-customBlue font-bold"
							>
								Title
							</label>
							<Select
								name="title"
								value={title}
								onValueChange={(value) => setTitle(value)}
							>
								<SelectTrigger className="w-full">
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
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
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
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
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
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
								value={middleName}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-left font-bold text-customBlue">
								Date Of Birth
							</label>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									value={dob}
									onChange={(value) => setDob(value)}
								/>
							</LocalizationProvider>
						</div>
						<div className="flex flex-col gap-2">
							<label
								htmlFor="role"
								className="text-customBlue font-bold"
							>
								Nationality
							</label>
							{/* <Select>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select your nationality" />
								</SelectTrigger>
								<SelectContent>
									{countries.map((country) => (
										<SelectItem
											key={country.code}
											value={country.name}
										>
											{country.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select> */}
							<select
								name="nationality"
								id="nationality"
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
								value={nationality}
								onChange={(e) => setNationality(e.target.value)}
							>
								<option value="">Select nationality</option>{" "}
								{countries.map((country) => (
									<option
										key={country.code}
										value={country.name}
									>
										{country.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-left font-bold text-customBlue">
								Email
							</label>
							<input
								name="email"
								type="email"
								placeholder="Enter a valid email..."
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
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
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
								value={phoneNumber}
								onChange={handleChange}
							/>
						</div>
						{/* HIDDEN INPUTS */}
						<div>
							<input
								type="hidden"
								name="airline"
								value={airlineName}
							/>
							<input
								type="hidden"
								name="origin"
								value={originCity}
							/>
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
								value={convertMinutesToHoursAndMinutes(
									flightTime
								)}
							/>
						</div>
					</div>
				)}
				{step === 2 && (
					<div className="border rounded-xl shadow-md px-5 py-10 flex flex-col gap-2">
						<div className="">
							<Image src={Fcmb} alt="bank-logo" />
						</div>
						<div className="text-sm">
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
						<div className="text-sm">
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
				)}
				{step === 2 && (
					<div className="flex items-center gap-3">
						<button
							onClick={() => setStep(1)}
							type="button"
							className="mt-5 bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around"
						>
							<div className="flex items-center gap-2">
								Previous
							</div>
						</button>
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
				)}
				{step === 1 && (
					<button
						onClick={() => setStep(2)}
						type="button"
						className="bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around"
					>
						<div className="flex items-center gap-2">Continue</div>
					</button>
				)}
			</form>
		</DialogContent>
	);
};

export default FlightBooking;
