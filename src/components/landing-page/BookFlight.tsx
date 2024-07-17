"use client";
import { cn } from "@/lib/utils";
import { FormEvent, useEffect, useState } from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Button from "./Button";
import { v4 as uuidv4 } from "uuid";
import { TailSpin } from "react-loader-spinner";

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

	const todaysDate = new Date();
	const formattedDate = todaysDate.toISOString();

	const todayTs = todaysDate.getTime();
	const dateTs = date?.getTime();

	const fetchAirportsFrom = async (searchText: string) => {
		try {
			let response = await fetch(
				`https://openpoint.co/airports?text=${searchText}&useSstr=1`
			);
			let data = await response.json();
			console.log(data.airports);
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
			console.log(data.airports);
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
		setIsLoading(true);
		e.preventDefault();

		// if (!searchFromText || searchToText){}

		const flightSearch = {
			opIds: ["54b7e593e636e96f3af16ce1"],
			rUDBR: false,
			from: originAirport?.title,
			to: destinationAirport?.title,
			fromId: originAirport?._id,
			toId: destinationAirport?._id,
			fromLat: originAirport?.lat,
			fromLng: originAirport?.lng,
			toLat: destinationAirport?.lat,
			toLng: destinationAirport?.lng,
			ts: todayTs,
			fromDate: formattedDate,
			returnDate: null,
			trip: "oneWay",
			promoteOpIds: true,
			legs: [
				{
					fromAirport: {
						_id: originAirport?._id,
						city: originAirport?.city,
						elevation: originAirport?.elevation,
						name: originAirport?.name,
						title: originAirport?.title,
						loc: originAirport?.loc,
						country: originAirport?.country,
						region: originAirport?.region,
						iata: originAirport?.iata,
						continent: originAirport?.continent,
						icao: originAirport?.icao,
						lat: originAirport?.lat,
						lng: originAirport?.lng,
						type: originAirport?.type,
						id: originAirport?.id,
						length_ft: originAirport?.length_ft,
						width_ft: originAirport?.width_ft,
						surface: originAirport?.surface,
						lastUpdated: originAirport?.lastUpdated,
						sstr: originAirport?.sstr,
						tzCode: originAirport?.tzCode,
					},
					toAirport: {
						_id: destinationAirport?._id,
						city: destinationAirport?.city,
						elevation: destinationAirport?.elevation,
						name: destinationAirport?.name,
						title: destinationAirport?.title,
						loc: destinationAirport?.loc,
						country: destinationAirport?.country,
						region: destinationAirport?.region,
						iata: destinationAirport?.iata,
						continent: destinationAirport?.continent,
						icao: destinationAirport?.icao,
						lat: destinationAirport?.lat,
						lng: destinationAirport?.lng,
						type: destinationAirport?.type,
						id: destinationAirport?.id,
						length_ft: destinationAirport?.length_ft,
						width_ft: destinationAirport?.width_ft,
						surface: destinationAirport?.surface,
						lastUpdated: destinationAirport?.surface,
						sstr: destinationAirport?.sstr,
						tzCode: destinationAirport?.tzCode,
					},
					fromDate: formattedDate,
					returnDate: null,
					dateOpened: false,
					returnDateOpened: false,
					depTime: null,
					returnDepTime: null,
					from: originAirport?.title,
					to: destinationAirport?.title,
					fromId: originAirport?._id,
					toId: destinationAirport?._id,
					fromLat: originAirport?.lat,
					fromLng: originAirport?.lng,
					toLat: destinationAirport?.lat,
					toLng: destinationAirport?.lng,
					ts: dateTs,
					fromDateStr: formattedDate,
				},
			],
			source: "eq",
			checkRunways: true,
			matchOneWays: true,
		};

		try {
			const response = await fetch("https://flyeasy.co/api/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(flightSearch),
			});
			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.log(error);
		}

		setSearchFromText("");
		setSearchToText("");
		setDate(undefined);
		setIsLoading(false);
	};

	return (
		<div className="w-full px-20 pt-[50px] md:pt-[100px] pb-[50px] md:pb-[150px] bg-slate-50">
			<div className="flex flex-col gap-2 text-center justify-center items-center">
				<p className="text-customBlue text-xl md:text-2xl font-semibold">
					FLY WITH VISION FLY🚀🚀🚀
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
				{/* <div className="mt-5">
					{isLoading ? (
						<TailSpin color="#065777" radius={"10px"} />
					) : (
						<div>
							<h1>Data was fetched successfully!</h1>
						</div>
					)}
				</div> */}
			</div>
		</div>
	);
};

export default BookFlight;
