"use client";
import { cn, formatDate } from "@/lib/utils";
import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Button from "./Button";
import { TailSpin } from "react-loader-spinner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

const BookFlight = () => {
	const [tab, setTab] = useState<number>(1);
	const [airportsFrom, setAirportsFrom] = useState<Airport[]>([]);
	const [airportsTo, setAirportsTo] = useState<Airport[]>([]);
	const [searchFromText, setSearchFromText] = useState("");
	const [searchToText, setSearchToText] = useState("");
	const [date, setDate] = useState<Date>();
	const [originAirport, setOriginAirport] = useState<Airport>();
	const [destinationAirport, setDestinationAirport] = useState<Airport>();
	const [isLoading, setIsLoading] = useState(false);
	const [flightsData, setFlightsData] = useState<any>();
	const formattedDate = formatDate(date);

	const fetchAirportsFrom = async (searchText: string) => {
		try {
			let response = await fetch(
				`https://openpoint.co/airports?text=${searchText}&useSstr=1`
			);
			let data = await response.json();
			setAirportsFrom(data.airports);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchAirportsTo = async (searchText: string) => {
		try {
			let response = await fetch(
				`https://openpoint.co/airports?text=${searchText}&useSstr=1`
			);
			let data = await response.json();
			setAirportsTo(data.airports);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchAirportsFrom(searchFromText);
	}, [searchFromText]);

	useEffect(() => {
		fetchAirportsTo(searchToText);
	}, [searchToText]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const flightSearch = {
			tripDetails: [
				{
					originAirportCode: originAirport?.iata,
					destinationAirportCode: destinationAirport?.iata,
					departureDate: formattedDate,
					departureCity: originAirport?.city,
					arrivalCity: destinationAirport?.city,
					cabinType: "ECONOMY",
				},
			],
			flightType: "ONE_WAY",
			numberOfAdult: 1,
			numberOfChildren: 0,
			numberOfInfant: 0,
			uniqueSession: "frJ6zU1bGSLdJ86",
			directFlight: true,
			refundable: false,
			isDayFlight: true,
			prefferedAirlineCodes: [],
			departureCity: originAirport?.city,
			arrivalCity: destinationAirport?.city,
		};

		try {
			const response = await fetch(
				"https://api.travelbeta.com/v1/api/flight",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Api-Key": "24c9mti53ykc31z1t5u5",
					},
					body: JSON.stringify(flightSearch),
				}
			);
			const data = await response.json();
			console.log(data);
			setFlightsData(data?.data?.airPricedIternaryList);
		} catch (error) {
			console.log(error);
		}

		// setSearchFromText("");
		// setSearchToText("");
		// setDate(undefined);
		setIsLoading(false);
	};

	const sendEmail = () => {
		toast.success(
			"Flight Inquiry was successfull, our admin will reach out to you in within 24 hours"
		);
	};

	return (
		<div className="w-full px-20 pt-[50px] md:pt-[100px] pb-[50px] md:pb-[150px] bg-slate-50">
			<div className="flex flex-col gap-2 text-center justify-center items-center">
				<p className="text-customBlue text-xl md:text-2xl font-semibold">
					FLY WITH VISION FLY
				</p>
				<h1 className="text-customBlue text-2xl md:text-4xl font-bold mt-2">
					Search & Book Flights
				</h1>
				<div className="mt-3">
					<div className="w-[300px] md:w-[500px] flex items-center gap-2 p-2 rounded-lg shadow-sm bg-slate-200">
						<div
							className={cn(
								"px-2 w-1/2 py-2 font-semibold rounded-sm cursor-pointer hover:bg-customBlue hover:text-white",
								tab === 1
									? "bg-customBlue text-white"
									: "bg-white"
							)}
							onClick={() => setTab(1)}
						>
							One Way
						</div>
						<div
							className={cn(
								"px-2 w-1/2 py-2 font-semibold rounded-sm cursor-pointer hover:bg-customBlue hover:text-white",
								tab === 2
									? "bg-customBlue text-white"
									: "bg-white"
							)}
							onClick={() => setTab(2)}
						>
							Round Trip
						</div>
					</div>
				</div>
				{tab === 1 && (
					<form
						onSubmit={handleSubmit}
						className="h-auto bg-slate-200 w-[300px] md:w-[500px] rounded-xl shadow-lg py-8 px-6 relative"
					>
						<div className="flex flex-col gap-2 ">
							<label className="text-left font-bold text-customBlue">
								FLYING FROM
							</label>
							<input
								value={searchFromText}
								onChange={(e) =>
									setSearchFromText(e.target.value)
								}
								name="currentAirport"
								type="text"
								placeholder="Enter a City or Airport..."
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
							/>
							{airportsFrom.length > 1 && (
								<div className="absolute z-10 top-[110px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
									{airportsFrom?.map(
										(airportFrom: Airport) => (
											<div
												key={airportFrom._id}
												className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
												onClick={() => {
													setOriginAirport(
														airportFrom
													);
													setSearchFromText(
														airportFrom.title
													);
												}}
											>
												{airportFrom.title}
											</div>
										)
									)}
								</div>
							)}
						</div>
						<div className="flex flex-col gap-2 mt-5">
							<label className="text-left font-bold text-customBlue">
								FLYING TO
							</label>
							<input
								value={searchToText}
								onChange={(e) =>
									setSearchToText(e.target.value)
								}
								name="currentAirport"
								type="text"
								placeholder="Enter a City or Airport..."
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
							/>
							{airportsTo.length > 0 && (
								<div className="absolute z-10 top-[195px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
									{airportsTo?.map((airportTo) => (
										<div
											key={airportTo._id}
											className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
											onClick={() => {
												setDestinationAirport(
													airportTo
												);
												setSearchToText(
													airportTo.title
												);
											}}
										>
											{airportTo.title}
										</div>
									))}
								</div>
							)}
						</div>
						<div className="mt-5 flex flex-col gap-2">
							<label className="text-left font-bold text-customBlue">
								DATE
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<div
										className={cn(
											"w-full bg-white text-customBlue cursor-pointer flex items-center gap-2 p-2 justify-start text-left font-normal border border-customBlue rounded-lg",
											!date && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date ? (
											format(date, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</div>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
						<Button
							btnContent={
								isLoading
									? "Searching..."
									: "Search for flights"
							}
							btnStyles={cn(
								"w-full p-2 bg-customBlue hover:bg-[#205063] text-white rounded-lg mt-10",
								isLoading && "opacity-20"
							)}
							btnType="submit"
							isDisabled={isLoading}
						/>
					</form>
				)}
				{tab === 2 && (
					<form
						onSubmit={handleSubmit}
						className="h-auto bg-slate-200 w-[300px] md:w-[500px] rounded-xl shadow-lg py-8 px-6 relative"
					>
						<div className="flex flex-col gap-2 ">
							<label className="text-left font-bold text-customBlue">
								FLYING FROM
							</label>
							<input
								value={searchFromText}
								onChange={(e) =>
									setSearchFromText(e.target.value)
								}
								name="currentAirport"
								type="text"
								placeholder="Enter a City or Airport..."
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
							/>
							{airportsFrom.length > 1 && (
								<div className="absolute z-10 top-[110px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
									{airportsFrom?.map(
										(airportFrom: Airport) => (
											<div
												key={airportFrom._id}
												className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
												onClick={() => {
													setOriginAirport(
														airportFrom
													);
													setSearchFromText(
														airportFrom.title
													);
												}}
											>
												{airportFrom.title}
											</div>
										)
									)}
								</div>
							)}
						</div>
						<div className="flex flex-col gap-2 mt-5">
							<label className="text-left font-bold text-customBlue">
								FLYING TO
							</label>
							<input
								value={searchToText}
								onChange={(e) =>
									setSearchToText(e.target.value)
								}
								name="currentAirport"
								type="text"
								placeholder="Enter a City or Airport..."
								className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
							/>
							{airportsTo.length > 0 && (
								<div className="absolute z-10 top-[195px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
									{airportsTo?.map((airportTo) => (
										<div
											key={airportTo._id}
											className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
											onClick={() => {
												setDestinationAirport(
													airportTo
												);
												setSearchToText(
													airportTo.title
												);
											}}
										>
											{airportTo.title}
										</div>
									))}
								</div>
							)}
						</div>
						<div className="mt-5 flex flex-col gap-2">
							<label className="text-left font-bold text-customBlue">
								DATE
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<div
										className={cn(
											"w-full bg-white text-customBlue cursor-pointer flex items-center gap-2 p-2 justify-start text-left font-normal border border-customBlue rounded-lg",
											!date && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date ? (
											format(date, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</div>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className="mt-5 flex flex-col gap-2">
							<label className="text-left font-bold text-customBlue">
								RETURN DATE
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<div
										className={cn(
											"w-full bg-white text-customBlue cursor-pointer flex items-center gap-2 p-2 justify-start text-left font-normal border border-customBlue rounded-lg",
											!date && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date ? (
											format(date, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</div>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
						<Button
							btnContent={
								isLoading
									? "Searching..."
									: "Search for flights"
							}
							btnStyles={cn(
								"w-full p-2 bg-customBlue hover:bg-[#205063] text-white rounded-lg mt-10",
								isLoading && "opacity-20"
							)}
							btnType="submit"
							isDisabled={isLoading}
						/>
					</form>
				)}

				{/* Search Data */}
				<div className="mt-5">
					{isLoading ? (
						<TailSpin color="#065777" height="50px" width="50px" />
					) : (
						<>
							{flightsData &&
								flightsData?.map((flightData: any) => (
									<div key={flightData.id}>
										<div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
											<h1 className="font-semibold text-lg">
												{flightData.airlineName}
											</h1>
											<div className="flex items-center gap-3 justify-around mt-2">
												<div className="text-[12px] md:text-sm">
													<p className="font-medium">
														{
															flightData
																.airOriginDestinationList[0]
																?.firstDepartureTime
														}{" "}
														{
															flightData
																.airOriginDestinationList[0]
																?.originCityCode
														}
													</p>
													<p className="font-medium">
														{
															flightData
																.airOriginDestinationList[0]
																?.originCity
														}
													</p>
												</div>
												<div className="">
													<h2 className="font-semibold text-sm md:text-lg">
														{
															flightData
																.airOriginDestinationList[0]
																?.totalFlightTimeInMs
														}
													</h2>
													<div className="w-10 md:w-20 h-[1px] bg-black"></div>
													<h2 className="font-semibold text-[12px] md:text-lg">
														{
															flightData.minimumNumberOfStops
														}{" "}
														Stop
													</h2>
												</div>
												<div className="text-[12px] md:text-sm">
													<p className="font-medium">
														{
															flightData
																.airOriginDestinationList[0]
																?.lastArrivalTime
														}{" "}
														{
															flightData
																.airOriginDestinationList[0]
																?.routeSegmentList[1]
																?.arrivalAirportCode
														}
													</p>
													<p className="font-medium">
														{
															flightData
																.airOriginDestinationList[0]
																?.destinationCity
														}
													</p>
												</div>
											</div>
											<div className="mt-2 flex flex-col gap-2">
												<h2 className="font-semibold">
													Price: N
													{flightData.amountInKobo}
												</h2>
												<Dialog>
													<DialogTrigger asChild>
														<button className="bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around">
															<div className="flex items-center gap-2">
																Inquire
																<ArrowRight className="animate-arrow" />
															</div>
														</button>
													</DialogTrigger>
													<DialogContent className="max-w-[425px] rounded-md">
														<DialogHeader>
															<DialogTitle>
																Let us have your
																details
															</DialogTitle>
															<DialogDescription>
																We will get back
																to you on your
																enquiry as soon
																as possible
															</DialogDescription>
														</DialogHeader>
														<div className="grid gap-4 py-4">
															<div className="flex flex-col gap-2">
																<label className="text-left font-bold text-customBlue">
																	Email
																</label>
																<input
																	name="email"
																	type="email"
																	placeholder="Enter a valid email..."
																	className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
																/>
															</div>
															<div className="flex flex-col gap-2">
																<label className="text-left font-bold text-customBlue">
																	Phone number
																</label>
																<input
																	name="email"
																	type="text"
																	placeholder="Enter a valid phone number..."
																	className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
																/>
															</div>
														</div>
														<DialogFooter>
															<DialogClose>
																<button
																	type="button"
																	onClick={() =>
																		sendEmail()
																	}
																	className="bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around"
																>
																	<div className="flex items-center gap-2">
																		Send
																	</div>
																</button>
															</DialogClose>
														</DialogFooter>
													</DialogContent>
												</Dialog>
											</div>
										</div>
									</div>
								))}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookFlight;
