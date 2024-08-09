"use client";
import {
	cn,
	convertMinutesToHoursAndMinutes,
	formatDate,
	formatKoboToNaira,
} from "@/lib/utils";
import { FormEvent, useEffect, useState, useRef, ChangeEvent } from "react";
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
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import FlightBooking from "../reusesable/FlightBooking";
import { useRouter } from "next/navigation";

const BookFlight = () => {
	const router = useRouter();
	const [tab, setTab] = useState<number>(1);
	const [airportsFrom, setAirportsFrom] = useState<Airport[]>([]);
	const [airportsTo, setAirportsTo] = useState<Airport[]>([]);
	const [searchFromText, setSearchFromText] = useState("");
	const [searchToText, setSearchToText] = useState("");
	const [date, setDate] = useState<Date>();
	const [originAirport, setOriginAirport] = useState<Airport>();
	const [destinationAirport, setDestinationAirport] = useState<Airport>();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingReturn, setIsLoadingReturn] = useState(false);
	const [isEmailSending, setIsEmailSending] = useState(false);
	const [flightsData, setFlightsData] = useState<any>();
	const [selectedFlightId, setSelectedFlightId] = useState(null);
	const [title, setTitle] = useState("");
	const [nationality, setNationality] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const form = useRef<HTMLFormElement>(null);
	const [oneWayPassengerInfo, setOneWayPassengerInfo] =
		useState<FlightBookingInfo>({
			title: "",
			surname: "",
			firstName: "",
			middleName: "",
			dateOfBirth: "",
			email: "",
			phoneNumber: "",
		});

	const formattedDate = formatDate(date);
	const todaysDate = new Date();

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

	const handleDateSelect = (selectedDate: any) => {
		const selectedDateOnly = new Date(selectedDate.setHours(0, 0, 0, 0));
		const todaysDateOnly = new Date(todaysDate.setHours(0, 0, 0, 0));

		if (selectedDateOnly >= todaysDateOnly) {
			setDate(selectedDate);
		} else {
			toast.error("Please select a date that is today or later.");
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!searchFromText || !searchToText) {
			toast.error("All fields are required");
			return;
		}

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
			setIsLoading(false);
			setFlightsData(data?.data?.airPricedIternaryList);
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		setOneWayPassengerInfo((prev) => ({ ...prev, [name]: value }));
	};

	const sendEmail = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			!oneWayPassengerInfo.firstName ||
			!oneWayPassengerInfo.surname ||
			!oneWayPassengerInfo.email ||
			!oneWayPassengerInfo.phoneNumber ||
			!title ||
			!nationality
		) {
			toast.error("All fields are required");
			return;
		}

		// console.log({ ...oneWayPassengerInfo, title, nationality });

		setIsEmailSending(true);

		if (form.current) {
			const formData = new FormData(form.current);
			formData.forEach((value, key) => {
				console.log(key, value);
			});
			emailjs
				.sendForm(
					"service_7orcrts",
					"template_4hjop5w",
					form.current,
					"9uKWP4-VHkg3gLRx2"
				)
				.then(
					() => {
						setIsEmailSending(false);
						toast.success(
							"Booking order has been registered successfully"
						);
						setIsDialogOpen(false);
						setTimeout(() => {
							router.push("/booking-success");
						}, 2000);
					},
					(error: any) => {
						setIsEmailSending(false);
						console.log("FAILED...", error.text);
					}
				);
		}
		// setTimeout(() => {
		// 	setIsEmailSending(false);
		// }, 3000);
	};

	// ROUND TRIP STATES AND DATA
	const [searchFromRoundTripAirports, setSearchFromRoundTripAirports] =
		useState("");
	const [searchToRoundTripAirports, setSearchToRoundTripAirports] =
		useState("");
	const [airportsFromRoundTrip, setAirportsFromRoundTrip] = useState<
		Airport[]
	>([]);
	const [airportsToRoundTrip, setAirportsToRoundTrip] = useState<Airport[]>(
		[]
	);
	const [originAirportRoundTrip, setOriginAirportRoundTrip] =
		useState<Airport>();
	const [destinationAirportRoundTrip, setDestinationAirportRoundTrip] =
		useState<Airport>();
	const [startDate, setStartDate] = useState<Date>();
	const [returnDate, setReturnDate] = useState<Date>();

	const formattedStartDate = formatDate(startDate);
	const formattedReturnDate = formatDate(returnDate);

	const [flightsReturnData, setFlightsReturnData] = useState<any>();

	const fetchAirportsFromRoundTrip = async (searchText: string) => {
		try {
			let response = await fetch(
				`https://openpoint.co/airports?text=${searchText}&useSstr=1`
			);
			let data = await response.json();
			setAirportsFromRoundTrip(data.airports);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchAirportsToRoundTrip = async (searchText: string) => {
		try {
			let response = await fetch(
				`https://openpoint.co/airports?text=${searchText}&useSstr=1`
			);
			let data = await response.json();
			setAirportsToRoundTrip(data.airports);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchAirportsFromRoundTrip(searchFromRoundTripAirports);
	}, [searchFromRoundTripAirports]);

	useEffect(() => {
		fetchAirportsToRoundTrip(searchToRoundTripAirports);
	}, [searchToRoundTripAirports]);

	const handleStartDateSelect = (selectedDate: any) => {
		const selectedDateOnly = new Date(selectedDate.setHours(0, 0, 0, 0));
		const todaysDateOnly = new Date(todaysDate.setHours(0, 0, 0, 0));

		if (selectedDateOnly >= todaysDateOnly) {
			setStartDate(selectedDate);
		} else {
			toast.error("Please select a date that is today or later.");
		}
	};

	const handleReturnDateSelect = (selectedDate: any) => {
		const selectedDateOnly = new Date(selectedDate.setHours(0, 0, 0, 0));
		const todaysDateOnly = new Date(todaysDate.setHours(0, 0, 0, 0));

		if (selectedDateOnly >= todaysDateOnly) {
			setReturnDate(selectedDate);
		} else {
			toast.error("Please select a date that is today or later.");
		}
	};

	const handleSubmitRoundTrip = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!searchFromRoundTripAirports || !searchToRoundTripAirports) {
			toast.error("All fields are required");
			return;
		}

		setIsLoadingReturn(true);

		const flightRoundSearch = {
			tripDetails: [
				{
					originAirportCode: originAirportRoundTrip?.iata,
					destinationAirportCode: destinationAirportRoundTrip?.iata,
					departureDate: formattedStartDate,
					returnDate: formattedReturnDate,
					departureCity: originAirportRoundTrip?.city,
					arrivalCity: destinationAirportRoundTrip?.city,
					cabinType: "ECONOMY",
				},
			],
			flightType: "ROUND",
			numberOfAdult: 1,
			numberOfChildren: 0,
			numberOfInfant: 0,
			uniqueSession: "klkFCfBxq6Unbg8",
			directFlight: true,
			refundable: false,
			isDayFlight: true,
			prefferedAirlineCodes: [],
			departureCity: originAirportRoundTrip?.city,
			arrivalCity: destinationAirportRoundTrip?.city,
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
					body: JSON.stringify(flightRoundSearch),
				}
			);
			const data = await response.json();
			setIsLoadingReturn(false);
			setFlightsReturnData(data?.data?.airPricedIternaryList);
		} catch (error) {
			console.log(error);
		}

		setIsLoadingReturn(false);
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
					<>
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
									autoComplete="off"
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
									autoComplete="off"
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
											onSelect={handleDateSelect}
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
						{/* Search One Way Trip Data */}
						<div className="mt-5">
							{isLoading ? (
								<TailSpin
									color="#065777"
									height="50px"
									width="50px"
								/>
							) : (
								<>
									{flightsData === null ? (
										<div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
											<h1 className="font-semibold text-lg">
												No Available Flights
											</h1>{" "}
										</div>
									) : (
										// flightsData?.map((flightData: any) => (
										// 	<div key={flightData.id}>
										// 		<div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
										// 			<h1 className="font-semibold text-lg">
										// 				{flightData.airlineName}
										// 			</h1>
										// 			<div className="flex items-center gap-3 justify-around mt-2">
										// 				<div className="text-[12px] md:text-sm">
										// 					<p className="font-medium">
										// 						{
										// 							flightData
										// 								.airOriginDestinationList[0]
										// 								?.firstDepartureTime
										// 						}{" "}
										// 					</p>
										// 					<p className="font-medium">
										// 						{
										// 							flightData
										// 								.airOriginDestinationList[0]
										// 								?.originCity
										// 						}
										// 					</p>
										// 				</div>
										// 				<div className="">
										// 					<h2 className="font-semibold text-sm">
										// 						{convertMinutesToHoursAndMinutes(
										// 							flightData
										// 								.airOriginDestinationList[0]
										// 								?.totalFlightTimeInMs
										// 						)}
										// 					</h2>
										// 					<div className="w-full h-[1px] bg-black"></div>
										// 					<h2 className="font-semibold text-sm">
										// 						{
										// 							flightData.minimumNumberOfStops
										// 						}{" "}
										// 						Stop
										// 					</h2>
										// 				</div>
										// 				<div className="text-[12px] md:text-sm">
										// 					<p className="font-medium">
										// 						{
										// 							flightData
										// 								.airOriginDestinationList[0]
										// 								?.lastArrivalTime
										// 						}{" "}
										// 						{
										// 							flightData
										// 								.airOriginDestinationList[0]
										// 								?.routeSegmentList[1]
										// 								?.arrivalAirportCode
										// 						}
										// 					</p>
										// 					<p className="font-medium">
										// 						{
										// 							flightData
										// 								.airOriginDestinationList[0]
										// 								?.destinationCity
										// 						}
										// 					</p>
										// 				</div>
										// 			</div>
										// 			<div className="mt-2 flex flex-col gap-2">
										// 				<h2 className="font-semibold">
										// 					Price:{" "}
										// 					{formatKoboToNaira(
										// 						flightData.amountInKobo
										// 					)}
										// 				</h2>
										// 				<Dialog
										// 					open={isDialogOpen}
										// 					onOpenChange={
										// 						setIsDialogOpen
										// 					}
										// 				>
										// 					<DialogTrigger
										// 						asChild
										// 					>
										// 						<button className="bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around">
										// 							<div className="flex items-center gap-2">
										// 								Reserve
										// 								<ArrowRight className="animate-arrow" />
										// 							</div>
										// 						</button>
										// 					</DialogTrigger>
										// 					<DialogContent
										// 						key={
										// 							flightData.id
										// 						}
										// 						className="h-[500px] max-w-[425px] rounded-md overflow-y-scroll"
										// 					>
										// 						<DialogHeader>
										// 							<DialogTitle>
										// 								Traveller's
										// 								Information
										// 							</DialogTitle>
										// 							<DialogDescription>
										// 								Passengers
										// 								details
										// 								must be
										// 								entered
										// 								as it
										// 								appears
										// 								on the
										// 								passport
										// 								or ID
										// 							</DialogDescription>
										// 						</DialogHeader>
										// 						<FlightBooking
										// 							form={form}
										// 							handleChange={
										// 								handleChange
										// 							}
										// 							sendEmail={
										// 								sendEmail
										// 							}
										// 							title={
										// 								title
										// 							}
										// 							setTitle={
										// 								setTitle
										// 							}
										// 							nationality={
										// 								nationality
										// 							}
										// 							setNationality={
										// 								setNationality
										// 							}
										// 							dob={
										// 								dateOfBirth
										// 							}
										// 							setDob={
										// 								setDateOfBirth
										// 							}
										// 							passengerInfo={
										// 								oneWayPassengerInfo
										// 							}
										// 							isLoading={
										// 								isEmailSending
										// 							}
										// 							airlineName={
										// 								flightData.airlineName
										// 							}
										// 							originCity={
										// 								flightData
										// 									.airOriginDestinationList[0]
										// 									?.originCity
										// 							}
										// 							destinationCity={
										// 								flightData
										// 									.airOriginDestinationList[0]
										// 									?.destinationCity
										// 							}
										// 							amount={
										// 								flightData.amountInKobo
										// 							}
										// 							flightTime={
										// 								flightData
										// 									.airOriginDestinationList[0]
										// 									?.totalFlightTimeInMs
										// 							}
										// 							step={step}
										// 							setStep={
										// 								setStep
										// 							}
										// 						/>
										// 					</DialogContent>
										// 				</Dialog>
										// 			</div>
										// 		</div>
										// 	</div>
										// ))
										flightsData?.map((flightData: any) => (
											<div key={flightData.id}>
												<div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
													<h1 className="font-semibold text-lg">
														{flightData.airlineName}
													</h1>
													<div className="flex items-center gap-3 justify-around mt-2">
														{/* Flight Details */}
														<div className="text-[12px] md:text-sm">
															<p className="font-medium">
																{
																	flightData
																		.airOriginDestinationList[0]
																		?.firstDepartureTime
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
														<div>
															<h2 className="font-semibold text-sm">
																{convertMinutesToHoursAndMinutes(
																	flightData
																		.airOriginDestinationList[0]
																		?.totalFlightTimeInMs
																)}
															</h2>
															<div className="w-full h-[1px] bg-black"></div>
															<h2 className="font-semibold text-sm">
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
															Price:{" "}
															{formatKoboToNaira(
																flightData.amountInKobo
															)}
														</h2>
														<Dialog
															open={
																selectedFlightId ===
																flightData.id
															}
															onOpenChange={(
																open
															) =>
																setSelectedFlightId(
																	open
																		? flightData.id
																		: null
																)
															}
														>
															<DialogTrigger
																asChild
															>
																<button className="bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around">
																	<div className="flex items-center gap-2">
																		Reserve
																		<ArrowRight className="animate-arrow" />
																	</div>
																</button>
															</DialogTrigger>
															<DialogContent className="h-[500px] w-[300px] md:w-[500px] rounded-md overflow-y-scroll">
																<DialogHeader>
																	<DialogTitle>
																		Traveller&apos;s
																		Information
																	</DialogTitle>
																	<DialogDescription>
																		Passengers
																		details
																		must be
																		entered
																		as it
																		appears
																		on the
																		passport
																		or ID
																	</DialogDescription>
																</DialogHeader>
																{selectedFlightId ===
																	flightData.id && (
																	<FlightBooking
																		form={
																			form
																		}
																		handleChange={
																			handleChange
																		}
																		sendEmail={
																			sendEmail
																		}
																		title={
																			title
																		}
																		setTitle={
																			setTitle
																		}
																		nationality={
																			nationality
																		}
																		setNationality={
																			setNationality
																		}
																		passengerInfo={
																			oneWayPassengerInfo
																		}
																		isLoading={
																			isEmailSending
																		}
																		airlineName={
																			flightData.airlineName
																		}
																		originCity={
																			flightData
																				.airOriginDestinationList[0]
																				?.originCity
																		}
																		destinationCity={
																			flightData
																				.airOriginDestinationList[0]
																				?.destinationCity
																		}
																		amount={
																			flightData.amountInKobo
																		}
																		flightTime={
																			flightData
																				.airOriginDestinationList[0]
																				?.totalFlightTimeInMs
																		}
																	/>
																)}
															</DialogContent>
														</Dialog>
													</div>
												</div>
											</div>
										))
									)}
								</>
							)}
						</div>
					</>
				)}
				{tab === 2 && (
					<>
						<form
							onSubmit={handleSubmitRoundTrip}
							className="h-auto bg-slate-200 w-[300px] md:w-[500px] rounded-xl shadow-lg py-8 px-6 relative"
						>
							<div className="flex flex-col gap-2 ">
								<label className="text-left font-bold text-customBlue">
									FLYING FROM
								</label>
								<input
									value={searchFromRoundTripAirports}
									onChange={(e) =>
										setSearchFromRoundTripAirports(
											e.target.value
										)
									}
									name="currentAirport"
									type="text"
									placeholder="Enter a City or Airport..."
									className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
									autoComplete="off"
								/>
								{airportsFromRoundTrip.length > 1 && (
									<div className="absolute z-10 top-[110px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
										{airportsFromRoundTrip?.map(
											(airportFrom: Airport) => (
												<div
													key={airportFrom._id}
													className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
													onClick={() => {
														setOriginAirportRoundTrip(
															airportFrom
														);
														setSearchFromRoundTripAirports(
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
									value={searchToRoundTripAirports}
									onChange={(e) =>
										setSearchToRoundTripAirports(
											e.target.value
										)
									}
									name="currentAirport"
									type="text"
									placeholder="Enter a City or Airport..."
									className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
									autoComplete="off"
								/>
								{airportsToRoundTrip.length > 0 && (
									<div className="absolute z-10 top-[195px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
										{airportsToRoundTrip?.map(
											(airportTo) => (
												<div
													key={airportTo._id}
													className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
													onClick={() => {
														setDestinationAirportRoundTrip(
															airportTo
														);
														setSearchToRoundTripAirports(
															airportTo.title
														);
													}}
												>
													{airportTo.title}
												</div>
											)
										)}
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
												!startDate &&
													"text-muted-foreground"
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{startDate ? (
												format(startDate, "PPP")
											) : (
												<span>Pick a date</span>
											)}
										</div>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={startDate}
											onSelect={handleStartDateSelect}
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
												!returnDate &&
													"text-muted-foreground"
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{returnDate ? (
												format(returnDate, "PPP")
											) : (
												<span>Pick a date</span>
											)}
										</div>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={returnDate}
											onSelect={handleReturnDateSelect}
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
						{/* Search Two Way Trip Data */}
						<div className="mt-5">
							{isLoadingReturn ? (
								<TailSpin
									color="#065777"
									height="50px"
									width="50px"
								/>
							) : (
								<>
									{flightsReturnData === null ? (
										<div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
											<h1 className="font-semibold text-lg">
												No Available Flights
											</h1>
										</div>
									) : (
										flightsReturnData?.map(
											(flightData: any) => (
												<div key={flightData.id}>
													<div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
														<h1 className="font-semibold text-lg">
															{
																flightData.airlineName
															}
														</h1>
														<div className="flex items-center gap-3 justify-around mt-2">
															<div className="text-[12px] md:text-sm">
																<p className="font-medium">
																	{
																		flightData
																			.airOriginDestinationList[0]
																			?.firstDepartureTime
																	}{" "}
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
																<h2 className="font-semibold text-sm">
																	{convertMinutesToHoursAndMinutes(
																		flightData
																			.airOriginDestinationList[0]
																			?.totalFlightTimeInMs
																	)}
																</h2>
																<div className="w-full h-[1px] bg-black"></div>
																<h2 className="font-semibold text-sm">
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
														<div className="flex items-center gap-3 justify-around mt-2">
															<div className="text-[12px] md:text-sm">
																<p className="font-medium">
																	{
																		flightData
																			.airOriginDestinationList[1]
																			?.firstDepartureTime
																	}{" "}
																</p>
																<p className="font-medium">
																	{
																		flightData
																			.airOriginDestinationList[1]
																			?.originCity
																	}
																</p>
															</div>
															<div className="">
																<h2 className="font-semibold text-sm md:text-lg">
																	{convertMinutesToHoursAndMinutes(
																		flightData
																			.airOriginDestinationList[1]
																			?.totalFlightTimeInMs
																	)}
																</h2>
																<div className="w-10 md:w-20 h-[1px] bg-black"></div>
																<h2 className="font-semibold text-[12px] md:text-lg">
																	{
																		flightData
																			.airOriginDestinationList[1]
																			?.totalStop
																	}{" "}
																	Stop
																</h2>
															</div>
															<div className="text-[12px] md:text-sm">
																<p className="font-medium">
																	{
																		flightData
																			.airOriginDestinationList[1]
																			?.lastArrivalTime
																	}{" "}
																	{
																		flightData
																			.airOriginDestinationList[1]
																			?.routeSegmentList[1]
																			?.arrivalAirportCode
																	}
																</p>
																<p className="font-medium">
																	{
																		flightData
																			.airOriginDestinationList[1]
																			?.destinationCity
																	}
																</p>
															</div>
														</div>
														<div className="mt-2 flex flex-col gap-2">
															<h2 className="font-semibold">
																Price:
																{formatKoboToNaira(
																	flightData.amountInKobo
																)}
															</h2>
															<Dialog
																open={
																	isDialogOpen
																}
																onOpenChange={
																	setIsDialogOpen
																}
															>
																<DialogTrigger
																	asChild
																>
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
																			Let
																			us
																			have
																			your
																			details
																		</DialogTitle>
																		<DialogDescription>
																			We
																			will
																			get
																			back
																			to
																			you
																			on
																			your
																			enquiry
																			as
																			soon
																			as
																			possible
																		</DialogDescription>
																	</DialogHeader>
																</DialogContent>
															</Dialog>
														</div>
													</div>
												</div>
											)
										)
									)}
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default BookFlight;
