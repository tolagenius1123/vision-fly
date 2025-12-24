"use client";
import {
        cn,
        convertMinutesToHoursAndMinutes,
        formatDate,
        formatKoboToNaira,
} from "@/lib/utils";
import { FormEvent, useEffect, useState, useRef, ChangeEvent } from "react";
import { format } from "date-fns";
import { ArrowRight, Calendar as CalendarIcon, ArrowLeftRight, Plus, Minus, PlaneTakeoff, PlaneLanding } from "lucide-react";
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
        const [selectedRoundTripFlightId, setSelectedRoundTripFlightId] =
                useState(null);
        const [title, setTitle] = useState("");
        const [nationality, setNationality] = useState("");
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [hasSearched, setHasSearched] = useState(false);
        const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
        const [adults, setAdults] = useState(1);
        const [children, setChildren] = useState(0);
        const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
        const [returnDate, setReturnDate] = useState<Date>();
        const [showBookingModal, setShowBookingModal] = useState(false);
        const [passengerNames, setPassengerNames] = useState<string[]>([]);
        const [bookingEmail, setBookingEmail] = useState("");
        const [bookingPhone, setBookingPhone] = useState("");
        const [editingOrigin, setEditingOrigin] = useState(false);
        const [editingDestination, setEditingDestination] = useState(false);
        const [allAirports, setAllAirports] = useState<any[]>([]);

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

        useEffect(() => {
                const fetchAllAirports = async () => {
                        try {
                                const response = await fetch(
                                        "https://raw.githubusercontent.com/mwgg/Airports/master/airports.json"
                                );
                                const data = await response.json();
                                // Convert object to array and filter only entries with IATA codes
                                const airportsArray = Object.values(data).filter((airport: any) => airport.iata);
                                setAllAirports(airportsArray);
                        } catch (error) {
                                console.log("Error fetching airports:", error);
                        }
                };
                fetchAllAirports();
        }, []);

        const filterAirports = (searchText: string) => {
                if (!searchText || searchText.length < 1) return [];
                const lowerSearch = searchText.toLowerCase();
                return allAirports
                        .filter((airport: any) => {
                                const iataMatch = airport.iata?.toLowerCase().includes(lowerSearch);
                                const cityMatch = airport.city?.toLowerCase().includes(lowerSearch);
                                const nameMatch = airport.name?.toLowerCase().includes(lowerSearch);
                                const countryMatch = airport.country?.toLowerCase().includes(lowerSearch);
                                return iataMatch || cityMatch || nameMatch || countryMatch;
                        })
                        .slice(0, 10)
                        .map((airport: any) => ({
                                _id: airport.iata,
                                iata: airport.iata,
                                city: airport.city,
                                country: airport.country,
                                title: airport.name,
                        }));
        };

        useEffect(() => {
                setAirportsFrom(filterAirports(searchFromText) as any);
        }, [searchFromText, allAirports]);

        useEffect(() => {
                setAirportsTo(filterAirports(searchToText) as any);
        }, [searchToText, allAirports]);

        const handleDateSelect = (selectedDate: any) => {
                if (!selectedDate) return;
                
                const selectedDateOnly = new Date(selectedDate.setHours(0, 0, 0, 0));
                const todaysDateOnly = new Date(todaysDate.setHours(0, 0, 0, 0));

                if (selectedDateOnly >= todaysDateOnly) {
                        setDate(selectedDate);
                } else {
                        toast.error("Please select a date that is today or later.");
                }
        };

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
                setHasSearched(true);
                e.preventDefault();

                // Validate one-way trip: origin, destination, and departure date required
                if (!originAirport || !destinationAirport || !date) {
                        toast.error("Please select departing airport, arriving airport, and departure date");
                        return;
                }

                // Validation passed - open booking modal immediately
                setShowBookingModal(true);
                setPassengerNames(Array(adults + children).fill(""));
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

                // try {
                //      const response = await fetch(
                //              "https://api.travelbeta.com/v1/api/flight",
                //              {
                //                      method: "POST",
                //                      headers: {
                //                              "Content-Type": "application/json",
                //                              "X-Api-Key": "24c9mti53ykc31z1t5u5",
                //                      },
                //                      body: JSON.stringify(flightSearch),
                //              }
                //      );
                //      const data = await response.json();
                //      setIsLoading(false);
                //      setFlightsData(data?.data?.airPricedIternaryList);
                // } catch (error) {
                //      console.log(error);
                // }

                setTimeout(() => {
                        setIsLoading(false);
                }, 3000);
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
                //      setIsEmailSending(false);
                // }, 3000);
        };

        // ROUND TRIP STATES AND DATA
        const [roundTripTitle, setRoundTripTitle] = useState("");
        const [isRoundTripEmailSending, setIsRoundTripEmailSending] =
                useState(false);

        const [twoWayPassengerInfo, setTwoWayPassengerInfo] =
                useState<FlightBookingInfo>({
                        title: "",
                        surname: "",
                        firstName: "",
                        middleName: "",
                        dateOfBirth: "",
                        email: "",
                        phoneNumber: "",
                });
        const [roundTripNationality, setRoundTripNationality] = useState("");

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
        const [roundTripReturnDate, setRoundTripReturnDate] = useState<Date>();

        const formattedStartDate = formatDate(startDate);
        const formattedReturnDate = formatDate(roundTripReturnDate);

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
                if (!selectedDate) return;
                
                const selectedDateOnly = new Date(selectedDate.setHours(0, 0, 0, 0));
                const todaysDateOnly = new Date(todaysDate.setHours(0, 0, 0, 0));

                if (selectedDateOnly >= todaysDateOnly) {
                        setStartDate(selectedDate);
                } else {
                        toast.error("Please select a date that is today or later.");
                }
        };

        const handleReturnDateSelect = (selectedDate: any) => {
                if (!selectedDate) return;
                
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

                // Validate round-trip: origin, destination, departure date, and return date required
                if (!originAirportRoundTrip || !destinationAirportRoundTrip || !startDate || !roundTripReturnDate) {
                        toast.error("Please select departing airport, arriving airport, departure date, and return date");
                        return;
                }

                // Validation passed - open booking modal immediately
                setShowBookingModal(true);
                setPassengerNames(Array(adults + children).fill(""));

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
                        setFlightsReturnData(data?.data?.airPricedIternaryList);
                        setIsLoadingReturn(false);
                } catch (error) {
                        console.log(error);
                        setIsLoadingReturn(false);
                }

                setTimeout(() => {
                        setIsLoadingReturn(false);
                }, 3000);
        };

        const sendRoundTripEmail = (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (
                        !twoWayPassengerInfo.firstName ||
                        !twoWayPassengerInfo.surname ||
                        !twoWayPassengerInfo.email ||
                        !twoWayPassengerInfo.phoneNumber ||
                        !roundTripTitle ||
                        !roundTripNationality
                ) {
                        toast.error("All fields are required");
                        return;
                }

                setIsRoundTripEmailSending(true);

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
                                                setIsRoundTripEmailSending(false);
                                                toast.success(
                                                        "Booking order has been registered successfully"
                                                );
                                                setIsDialogOpen(false);
                                                setTimeout(() => {
                                                        router.push("/booking-success");
                                                }, 2000);
                                        },
                                        (error: any) => {
                                                setIsRoundTripEmailSending(false);
                                                console.log("FAILED...", error.text);
                                        }
                                );
                }
                setTimeout(() => {
                        setIsRoundTripEmailSending(false);
                }, 3000);
        };

        const handleRoundTripChange = (e: ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.currentTarget;
                setTwoWayPassengerInfo((prev) => ({ ...prev, [name]: value }));
        };

        return (
                <div
                        id="bookflight"
                        className="w-full px-20 pt-[50px] md:pt-[100px] pb-[50px] md:pb-[150px] bg-slate-50"
                >
                        <div className="flex flex-col gap-2 text-center justify-center items-center">
                                <p className="text-customBlue text-xl md:text-2xl font-semibold">
                                        FLY WITH VISION FLY
                                </p>
                                <h1 className="text-customBlue text-2xl md:text-4xl font-bold mt-2">
                                        Search & Book Flights
                                </h1>
                                {tab === 1 && (
                                        <>
                                                <form
                                                        onSubmit={handleSubmit}
                                                        className="w-full max-w-6xl bg-white rounded-2xl shadow-lg py-6 px-8 relative"
                                                >
                                                        {/* Top Row: Trip Type & Passengers */}
                                                        <div className="flex flex-col md:flex-row md:items-center justify-center gap-6 mb-6 pb-4 border-b border-gray-200">
                                                                <select
                                                                        value={tripType}
                                                                        onChange={(e) => setTripType(e.target.value as "one-way" | "round-trip")}
                                                                        className="px-4 py-2 bg-customBlue text-white rounded-lg text-sm font-semibold focus:outline-none hover:bg-blue-700 transition cursor-pointer"
                                                                >
                                                                        <option value="one-way">One-Way</option>
                                                                        <option value="round-trip">Round-Trip</option>
                                                                </select>
                                                                <div className="flex items-center gap-2 relative">
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                                                                                className="px-4 py-2 bg-customBlue text-white rounded-lg text-sm font-semibold focus:outline-none hover:bg-blue-700 transition cursor-pointer"
                                                                        >
                                                                                {adults + children} {adults + children === 1 ? "Passenger" : "Passengers"}
                                                                        </button>
                                                                        {showPassengerDropdown && (
                                                                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-48 z-50">
                                                                                        <div className="flex items-center justify-between mb-3">
                                                                                                <span className="text-sm font-medium text-customBlue">Adults (16+)</span>
                                                                                                <div className="flex items-center gap-2">
                                                                                                        <button
                                                                                                                type="button"
                                                                                                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                                                                                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                                                                        >
                                                                                                                <Minus size={16} className="text-customBlue" />
                                                                                                        </button>
                                                                                                        <span className="w-6 text-center text-sm font-semibold">{adults}</span>
                                                                                                        <button
                                                                                                                type="button"
                                                                                                                onClick={() => setAdults(adults + 1)}
                                                                                                                className="p-1 bg-customBlue rounded hover:bg-blue-700"
                                                                                                        >
                                                                                                                <Plus size={16} className="text-white" />
                                                                                                        </button>
                                                                                                </div>
                                                                                        </div>
                                                                                        <div className="flex items-center justify-between">
                                                                                                <span className="text-sm font-medium text-customBlue">Children (2-15)</span>
                                                                                                <div className="flex items-center gap-2">
                                                                                                        <button
                                                                                                                type="button"
                                                                                                                onClick={() => setChildren(Math.max(0, children - 1))}
                                                                                                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                                                                        >
                                                                                                                <Minus size={16} className="text-customBlue" />
                                                                                                        </button>
                                                                                                        <span className="w-6 text-center text-sm font-semibold">{children}</span>
                                                                                                        <button
                                                                                                                type="button"
                                                                                                                onClick={() => setChildren(children + 1)}
                                                                                                                className="p-1 bg-customBlue rounded hover:bg-blue-700"
                                                                                                        >
                                                                                                                <Plus size={16} className="text-white" />
                                                                                                        </button>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        </div>

                                                        {/* Main Search Row - Horizontal Layout */}
                                                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4 items-center">
                                                                {/* Departure Airport */}
                                                                <div className="relative">
                                                                        <div 
                                                                                onClick={() => {
                                                                                        if (!editingOrigin) {
                                                                                                setEditingOrigin(true);
                                                                                                if (originAirport?.iata) {
                                                                                                        setSearchFromText(originAirport.iata);
                                                                                                }
                                                                                        }
                                                                                }}
                                                                                className={`border-2 rounded-lg p-6 min-h-28 flex flex-col justify-center items-start transition relative cursor-text ${
                                                                                        editingOrigin 
                                                                                                ? 'border-customBlue bg-white shadow-md' 
                                                                                                : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                                                                }`}
                                                                        >
                                                                                {editingOrigin ? (
                                                                                        <div className="w-full">
                                                                                                <div className="text-xs text-gray-500 mb-1">From</div>
                                                                                                <input
                                                                                                        autoFocus
                                                                                                        value={searchFromText}
                                                                                                        onChange={(e) => setSearchFromText(e.target.value)}
                                                                                                        onBlur={() => {
                                                                                                                setTimeout(() => {
                                                                                                                        if (!searchFromText && !originAirport?.iata) {
                                                                                                                                setEditingOrigin(false);
                                                                                                                        }
                                                                                                                }, 200);
                                                                                                        }}
                                                                                                        placeholder=""
                                                                                                        className="text-lg font-medium bg-transparent focus:outline-none text-customBlue w-full"
                                                                                                        autoComplete="off"
                                                                                                />
                                                                                        </div>
                                                                                ) : originAirport?.iata ? (
                                                                                        <div className="text-center w-full">
                                                                                                <div className="text-4xl font-bold text-customBlue">{originAirport.iata}</div>
                                                                                                <div className="text-sm text-gray-600 mt-1">{originAirport.city}, {originAirport.country}</div>
                                                                                                <div className="text-xs text-gray-400 mt-2">Click to change</div>
                                                                                        </div>
                                                                                ) : (
                                                                                        <div className="flex flex-col items-center gap-3 w-full">
                                                                                                <PlaneTakeoff size={48} className="text-gray-300" />
                                                                                                <span className="text-sm text-gray-400">Departing from</span>
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                        {/* Helper Tooltip */}
                                                                        {editingOrigin && airportsFrom.length === 0 && (
                                                                                <div className="absolute z-20 top-full left-0 mt-2 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs">
                                                                                        Enter the city name, airport code, province or country/region.
                                                                                </div>
                                                                        )}
                                                                        {editingOrigin && airportsFrom.length > 0 && (
                                                                                <div className="absolute z-10 top-full left-0 mt-1 w-full max-h-72 flex flex-col gap-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                                                                                        {airportsFrom?.map((airportFrom: any) => (
                                                                                                <div
                                                                                                        key={airportFrom._id}
                                                                                                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                                                                                        onClick={() => {
                                                                                                                setOriginAirport(airportFrom);
                                                                                                                setSearchFromText("");
                                                                                                                setEditingOrigin(false);
                                                                                                        }}
                                                                                                >
                                                                                                        <div className="flex items-start justify-between gap-3">
                                                                                                                <div className="bg-customBlue text-white px-2 py-1 rounded font-bold text-sm min-w-12 text-center">
                                                                                                                        {airportFrom.iata}
                                                                                                                </div>
                                                                                                                <div className="flex-1">
                                                                                                                        <div className="font-semibold text-customBlue text-sm">{airportFrom.city}, {airportFrom.country}</div>
                                                                                                                        <div className="text-xs text-gray-500 mt-1">{airportFrom.title}</div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        )}
                                                                </div>

                                                                {/* Swap Button */}
                                                                <div className="flex justify-center">
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                        const temp = originAirport;
                                                                                        setOriginAirport(destinationAirport);
                                                                                        setDestinationAirport(temp);
                                                                                        const tempText = searchFromText;
                                                                                        setSearchFromText(searchToText);
                                                                                        setSearchToText(tempText);
                                                                                }}
                                                                                className="p-2 text-customBlue hover:bg-gray-100 rounded-full transition"
                                                                        >
                                                                                {tripType === "one-way" ? (
                                                                                        <ArrowRight size={24} />
                                                                                ) : (
                                                                                        <ArrowLeftRight size={24} />
                                                                                )}
                                                                        </button>
                                                                </div>

                                                                {/* Arrival Airport */}
                                                                <div className="relative">
                                                                        <div 
                                                                                onClick={() => {
                                                                                        if (!editingDestination) {
                                                                                                setEditingDestination(true);
                                                                                                if (destinationAirport?.iata) {
                                                                                                        setSearchToText(destinationAirport.iata);
                                                                                                }
                                                                                        }
                                                                                }}
                                                                                className={`border-2 rounded-lg p-6 min-h-28 flex flex-col justify-center items-start transition relative cursor-text ${
                                                                                        editingDestination 
                                                                                                ? 'border-customBlue bg-white shadow-md' 
                                                                                                : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                                                                }`}
                                                                        >
                                                                                {editingDestination ? (
                                                                                        <div className="w-full">
                                                                                                <div className="text-xs text-gray-500 mb-1">To</div>
                                                                                                <input
                                                                                                        autoFocus
                                                                                                        value={searchToText}
                                                                                                        onChange={(e) => setSearchToText(e.target.value)}
                                                                                                        onBlur={() => {
                                                                                                                setTimeout(() => {
                                                                                                                        if (!searchToText && !destinationAirport?.iata) {
                                                                                                                                setEditingDestination(false);
                                                                                                                        }
                                                                                                                }, 200);
                                                                                                        }}
                                                                                                        placeholder=""
                                                                                                        className="text-lg font-medium bg-transparent focus:outline-none text-customBlue w-full"
                                                                                                        autoComplete="off"
                                                                                                />
                                                                                        </div>
                                                                                ) : destinationAirport?.iata ? (
                                                                                        <div className="text-center w-full">
                                                                                                <div className="text-4xl font-bold text-customBlue">{destinationAirport.iata}</div>
                                                                                                <div className="text-sm text-gray-600 mt-1">{destinationAirport.city}, {destinationAirport.country}</div>
                                                                                                <div className="text-xs text-gray-400 mt-2">Click to change</div>
                                                                                        </div>
                                                                                ) : (
                                                                                        <div className="flex flex-col items-center gap-3 w-full">
                                                                                                <PlaneLanding size={48} className="text-gray-300" />
                                                                                                <span className="text-sm text-gray-400">Arriving in</span>
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                        {/* Helper Tooltip */}
                                                                        {editingDestination && airportsTo.length === 0 && (
                                                                                <div className="absolute z-20 top-full left-0 mt-2 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs">
                                                                                        Enter the city name, airport code, province or country/region.
                                                                                </div>
                                                                        )}
                                                                        {editingDestination && airportsTo.length > 0 && (
                                                                                <div className="absolute z-10 top-full left-0 mt-1 w-full max-h-72 flex flex-col gap-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                                                                                        {airportsTo?.map((airportTo: any) => (
                                                                                                <div
                                                                                                        key={airportTo._id}
                                                                                                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                                                                                        onClick={() => {
                                                                                                                setDestinationAirport(airportTo);
                                                                                                                setSearchToText("");
                                                                                                                setEditingDestination(false);
                                                                                        }}
                                                                                                >
                                                                                                        <div className="flex items-start justify-between gap-3">
                                                                                                                <div className="bg-customBlue text-white px-2 py-1 rounded font-bold text-sm min-w-12 text-center">
                                                                                                                        {airportTo.iata}
                                                                                                                </div>
                                                                                                                <div className="flex-1">
                                                                                                                        <div className="font-semibold text-customBlue text-sm">{airportTo.city}, {airportTo.country}</div>
                                                                                                                        <div className="text-xs text-gray-500 mt-1">{airportTo.title}</div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        )}
                                                                </div>

                                                                {/* Date Fields */}
                                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                                        <div>
                                                                                <Popover>
                                                                                        <PopoverTrigger asChild>
                                                                                                <div className="text-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition">
                                                                                                        <div className="text-xs text-gray-600 mb-1">Departure</div>
                                                                                                        <div className="text-sm font-semibold text-customBlue">
                                                                                                                {date ? format(date, "MMM dd") : "Select date"}
                                                                                                        </div>
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
                                                                        {tripType === "round-trip" && (
                                                                                <div>
                                                                                        <Popover>
                                                                                                <PopoverTrigger asChild>
                                                                                                        <div className="text-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition">
                                                                                                                <div className="text-xs text-gray-600 mb-1">Return</div>
                                                                                                                <div className="text-sm font-semibold text-customBlue">
                                                                                                                        {returnDate ? format(returnDate, "MMM dd") : "Select date"}
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </PopoverTrigger>
                                                                                                <PopoverContent className="w-auto p-0">
                                                                                                        <Calendar
                                                                                                                mode="single"
                                                                                                                selected={returnDate}
                                                                                                                onSelect={setReturnDate}
                                                                                                                initialFocus
                                                                                                        />
                                                                                                </PopoverContent>
                                                                        </Popover>
                                                                        </div>
                                                                        )}
                                                                </div>

                                                                {/* Search Button */}
                                                                <div className="flex justify-center">
                                                                        <button
                                                                                type="submit"
                                                                                disabled={isLoading}
                                                                                className="w-full px-8 py-3 bg-customBlue text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                                                        >
                                                                                {isLoading ? "Searching..." : "Search"}
                                                                        </button>
                                                                </div>
                                                        </div>

                                                        {/* Booking Inquiry Modal */}
                                                        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                                                                <DialogContent className="w-[90vw] max-w-2xl max-h-96 overflow-y-auto">
                                                                        <DialogHeader>
                                                                                <DialogTitle className="text-customBlue">Flight Booking Inquiry</DialogTitle>
                                                                                <DialogDescription>
                                                                                        Please provide details for all {adults + children} passenger(s)
                                                                                </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="grid grid-cols-1 gap-4">
                                                                                {passengerNames.map((_, idx) => (
                                                                                        <input
                                                                                                key={idx}
                                                                                                type="text"
                                                                                                placeholder={`Passenger ${idx + 1} Full Name`}
                                                                                                value={passengerNames[idx]}
                                                                                                onChange={(e) => {
                                                                                                        const newNames = [...passengerNames];
                                                                                                        newNames[idx] = e.target.value;
                                                                                                        setPassengerNames(newNames);
                                                                                                }}
                                                                                                className="px-3 py-2 border border-customBlue rounded-lg text-sm focus:outline-none focus:border-blue-700"
                                                                                        />
                                                                                ))}
                                                                                <input
                                                                                        type="email"
                                                                                        placeholder="Email Address"
                                                                                        value={bookingEmail}
                                                                                        onChange={(e) => setBookingEmail(e.target.value)}
                                                                                        className="px-3 py-2 border border-customBlue rounded-lg text-sm focus:outline-none focus:border-blue-700"
                                                                                />
                                                                                <input
                                                                                        type="tel"
                                                                                        placeholder="Phone Number"
                                                                                        value={bookingPhone}
                                                                                        onChange={(e) => setBookingPhone(e.target.value)}
                                                                                        className="px-3 py-2 border border-customBlue rounded-lg text-sm focus:outline-none focus:border-blue-700"
                                                                                />
                                                                                <p className="text-xs text-gray-600 mt-2">
                                                                                        Thank you for your inquiry. Our team will process your request and email you the best available rates shortly. Please check your promotion or spam folder if you do not receive a confirmation within the next few minutes.
                                                                                </p>
                                                                        </div>
                                                                        <button
                                                                                onClick={() => {
                                                                                        setShowBookingModal(false);
                                                                                        toast.success("Your inquiry has been submitted successfully!");
                                                                                }}
                                                                                className="w-full mt-4 px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-blue-700 transition"
                                                                        >
                                                                                Submit Inquiry
                                                                        </button>
                                                                </DialogContent>
                                                        </Dialog>
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
                                                                        {!flightsData ||
                                                                                (hasSearched && (
                                                                                        <div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
                                                                                                <h1 className="font-semibold text-lg">
                                                                                                        No Available Flights
                                                                                                </h1>
                                                                                        </div>
                                                                                ))}

                                                                        {flightsData &&
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
                                                                                ))}
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

// {
//      tab === 2 && (
//              <>
//                      <form
//                              onSubmit={handleSubmitRoundTrip}
//                              className="h-auto bg-slate-200 w-[300px] md:w-[500px] rounded-xl shadow-lg py-8 px-6 relative"
//                      >
//                              <div className="flex flex-col gap-2 ">
//                                      <label className="text-left font-bold text-customBlue">
//                                              FLYING FROM
//                                      </label>
//                                      <input
//                                              value={searchFromRoundTripAirports}
//                                              onChange={(e) =>
//                                                      setSearchFromRoundTripAirports(
//                                                              e.target.value
//                                                      )
//                                              }
//                                              name="currentAirport"
//                                              type="text"
//                                              placeholder="Enter a City or Airport..."
//                                              className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
//                                              autoComplete="off"
//                                      />
//                                      {airportsFromRoundTrip.length > 1 && (
//                                              <div className="absolute z-10 top-[110px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
//                                                      {airportsFromRoundTrip?.map(
//                                                              (airportFrom: Airport) => (
//                                                                      <div
//                                                                              key={airportFrom._id}
//                                                                              className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
//                                                                              onClick={() => {
//                                                                                      setOriginAirportRoundTrip(
//                                                                                              airportFrom
//                                                                                      );
//                                                                                      setSearchFromRoundTripAirports(
//                                                                                              airportFrom.title
//                                                                                      );
//                                                                              }}
//                                                                      >
//                                                                              {airportFrom.title}
//                                                                      </div>
//                                                              )
//                                                      )}
//                                              </div>
//                                      )}
//                              </div>
//                              <div className="flex flex-col gap-2 mt-5">
//                                      <label className="text-left font-bold text-customBlue">
//                                              FLYING TO
//                                      </label>
//                                      <input
//                                              value={searchToRoundTripAirports}
//                                              onChange={(e) =>
//                                                      setSearchToRoundTripAirports(
//                                                              e.target.value
//                                                      )
//                                              }
//                                              name="currentAirport"
//                                              type="text"
//                                              placeholder="Enter a City or Airport..."
//                                              className="text-sm rounded-lg h-[35px] md:h-[40px] border border-customBlue px-2 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
//                                              autoComplete="off"
//                                      />
//                                      {airportsToRoundTrip.length > 0 && (
//                                              <div className="absolute z-10 top-[195px] w-[80%] max-h-[300px] p-2 flex flex-col gap-2 overflow-y-scroll bg-white rounded-lg">
//                                                      {airportsToRoundTrip?.map(
//                                                              (airportTo) => (
//                                                                      <div
//                                                                              key={airportTo._id}
//                                                                              className="bg-slate-200 text-sm text-customBlue p-2 rounded-lg cursor-pointer hover:bg-slate-300"
//                                                                              onClick={() => {
//                                                                                      setDestinationAirportRoundTrip(
//                                                                                              airportTo
//                                                                                      );
//                                                                                      setSearchToRoundTripAirports(
//                                                                                              airportTo.title
//                                                                                      );
//                                                                              }}
//                                                                      >
//                                                                              {airportTo.title}
//                                                                      </div>
//                                                              )
//                                                      )}
//                                              </div>
//                                      )}
//                              </div>
//                              <div className="mt-5 flex flex-col gap-2">
//                                      <label className="text-left font-bold text-customBlue">
//                                              DATE
//                                      </label>
//                                      <Popover>
//                                              <PopoverTrigger asChild>
//                                                      <div
//                                                              className={cn(
//                                                                      "w-full bg-white text-customBlue cursor-pointer flex items-center gap-2 p-2 justify-start text-left font-normal border border-customBlue rounded-lg",
//                                                                      !startDate &&
//                                                                              "text-muted-foreground"
//                                                              )}
//                                                      >
//                                                              <CalendarIcon className="mr-2 h-4 w-4" />
//                                                              {startDate ? (
//                                                                      format(startDate, "PPP")
//                                                              ) : (
//                                                                      <span>Pick a date</span>
//                                                              )}
//                                                      </div>
//                                              </PopoverTrigger>
//                                              <PopoverContent className="w-auto p-0">
//                                                      <Calendar
//                                                              mode="single"
//                                                              selected={startDate}
//                                                              onSelect={handleStartDateSelect}
//                                                              initialFocus
//                                                      />
//                                              </PopoverContent>
//                                      </Popover>
//                              </div>
//                              <div className="mt-5 flex flex-col gap-2">
//                                      <label className="text-left font-bold text-customBlue">
//                                              RETURN DATE
//                                      </label>
//                                      <Popover>
//                                              <PopoverTrigger asChild>
//                                                      <div
//                                                              className={cn(
//                                                                      "w-full bg-white text-customBlue cursor-pointer flex items-center gap-2 p-2 justify-start text-left font-normal border border-customBlue rounded-lg",
//                                                                      !returnDate &&
//                                                                              "text-muted-foreground"
//                                                              )}
//                                                      >
//                                                              <CalendarIcon className="mr-2 h-4 w-4" />
//                                                              {returnDate ? (
//                                                                      format(returnDate, "PPP")
//                                                              ) : (
//                                                                      <span>Pick a date</span>
//                                                              )}
//                                                      </div>
//                                              </PopoverTrigger>
//                                              <PopoverContent className="w-auto p-0">
//                                                      <Calendar
//                                                              mode="single"
//                                                              selected={returnDate}
//                                                              onSelect={
//                                                                      handleReturnDateSelect
//                                                              }
//                                                              initialFocus
//                                                      />
//                                              </PopoverContent>
//                                      </Popover>
//                              </div>
//                              <Button
//                                      btnContent={
//                                              isLoadingReturn
//                                                      ? "Searching..."
//                                                      : "Search for flights"
//                                      }
//                                      btnStyles={cn(
//                                              "w-full p-2 bg-customBlue hover:bg-[#205063] text-white rounded-lg mt-10",
//                                              isLoadingReturn && "opacity-20"
//                                      )}
//                                      btnType="submit"
//                                      isDisabled={isLoadingReturn}
//                              />
//                      </form>
//                      {/* Search Two Way Trip Data */}
//                      <div className="mt-5">
//                              {isLoadingReturn ? (
//                                      <TailSpin
//                                              color="#065777"
//                                              height="50px"
//                                              width="50px"
//                                      />
//                              ) : (
//                                      <>
//                                              {!flightsReturnData ? (
//                                                      <div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
//                                                              <h1 className="font-semibold text-lg">
//                                                                      No Available Flights
//                                                              </h1>
//                                                      </div>
//                                              ) : (
//                                                      flightsReturnData?.map(
//                                                              (flightData: any) => (
//                                                                      <div key={flightData.id}>
//                                                                              <div className="mt-4 w-[300px] md:w-[500px] rounded-xl text-customBlue bg-slate-200 shadow-md py-4 px-6">
//                                                                                      <h1 className="font-semibold text-lg">
//                                                                                              {
//                                                                                                      flightData.airlineName
//                                                                                              }
//                                                                                      </h1>
//                                                                                      <div className="flex items-center gap-3 justify-around mt-2">
//                                                                                              <div className="text-[12px] md:text-sm">
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                              ?.firstDepartureTime
//                                                                                                              }{" "}
//                                                                                                      </p>
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                              ?.originCity
//                                                                                                              }
//                                                                                                      </p>
//                                                                                              </div>
//                                                                                              <div className="">
//                                                                                                      <h2 className="font-semibold text-sm">
//                                                                                                              {convertMinutesToHoursAndMinutes(
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                              ?.totalFlightTimeInMs
//                                                                                                              )}
//                                                                                                      </h2>
//                                                                                                      <div className="w-full h-[1px] bg-black"></div>
//                                                                                                      <h2 className="font-semibold text-sm">
//                                                                                                              {
//                                                                                                                      flightData.minimumNumberOfStops
//                                                                                                              }{" "}
//                                                                                                              Stop
//                                                                                                      </h2>
//                                                                                              </div>
//                                                                                              <div className="text-[12px] md:text-sm">
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                              ?.lastArrivalTime
//                                                                                                              }{" "}
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                              ?.routeSegmentList[1]
//                                                                                                                              ?.arrivalAirportCode
//                                                                                                              }
//                                                                                                      </p>
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                              ?.destinationCity
//                                                                                                              }
//                                                                                                      </p>
//                                                                                              </div>
//                                                                                      </div>
//                                                                                      <div className="flex items-center gap-3 justify-around mt-2">
//                                                                                              <div className="text-[12px] md:text-sm">
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                              ?.firstDepartureTime
//                                                                                                              }{" "}
//                                                                                                      </p>
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                              ?.originCity
//                                                                                                              }
//                                                                                                      </p>
//                                                                                              </div>
//                                                                                              <div className="">
//                                                                                                      <h2 className="font-semibold text-sm">
//                                                                                                              {convertMinutesToHoursAndMinutes(
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                              ?.totalFlightTimeInMs
//                                                                                                              )}
//                                                                                                      </h2>
//                                                                                                      <div className="w-10 md:w-20 h-[1px] bg-black"></div>
//                                                                                                      <h2 className="font-semibold text-[12px] text-sm">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                              ?.totalStop
//                                                                                                              }{" "}
//                                                                                                              Stop
//                                                                                                      </h2>
//                                                                                              </div>
//                                                                                              <div className="text-[12px] md:text-sm">
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                              ?.lastArrivalTime
//                                                                                                              }
//                                                                                                      </p>
//                                                                                                      <p className="font-medium">
//                                                                                                              {
//                                                                                                                      flightData
//                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                              ?.destinationCity
//                                                                                                              }
//                                                                                                      </p>
//                                                                                              </div>
//                                                                                      </div>
//                                                                                      <div className="mt-2 flex flex-col gap-2">
//                                                                                              <h2 className="font-semibold">
//                                                                                                      Price:
//                                                                                                      {formatKoboToNaira(
//                                                                                                              flightData.amountInKobo
//                                                                                                      )}
//                                                                                              </h2>
//                                                                                              <Dialog
//                                                                                                      open={
//                                                                                                              selectedRoundTripFlightId ===
//                                                                                                              flightData.id
//                                                                                                      }
//                                                                                                      onOpenChange={(
//                                                                                                              open
//                                                                                                      ) =>
//                                                                                                              setSelectedRoundTripFlightId(
//                                                                                                                      open
//                                                                                                                              ? flightData.id
//                                                                                                                              : null
//                                                                                                              )
//                                                                                                      }
//                                                                                              >
//                                                                                                      <DialogTrigger
//                                                                                                              asChild
//                                                                                                      >
//                                                                                                              <button className="bg-customBlue text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-[#205063] flex items-center justify-around">
//                                                                                                                      <div className="flex items-center gap-2">
//                                                                                                                              Reserve
//                                                                                                                              <ArrowRight className="animate-arrow" />
//                                                                                                                      </div>
//                                                                                                              </button>
//                                                                                                      </DialogTrigger>
//                                                                                                      <DialogContent className="h-[500px] w-[300px] md:w-[500px] rounded-md overflow-y-scroll">
//                                                                                                              <DialogHeader>
//                                                                                                                      <DialogTitle>
//                                                                                                                              Traveller&apos;s
//                                                                                                                              Information
//                                                                                                                      </DialogTitle>
//                                                                                                                      <DialogDescription>
//                                                                                                                              Passengers
//                                                                                                                              details
//                                                                                                                              must
//                                                                                                                              be
//                                                                                                                              entered
//                                                                                                                              as
//                                                                                                                              it
//                                                                                                                              appears
//                                                                                                                              on
//                                                                                                                              the
//                                                                                                                              passport
//                                                                                                                              or
//                                                                                                                              ID
//                                                                                                                      </DialogDescription>
//                                                                                                              </DialogHeader>
//                                                                                                              {selectedRoundTripFlightId ===
//                                                                                                                      flightData.id && (
//                                                                                                                      <FlightBooking
//                                                                                                                              form={
//                                                                                                                                      form
//                                                                                                                              }
//                                                                                                                              handleChange={
//                                                                                                                                      handleRoundTripChange
//                                                                                                                              }
//                                                                                                                              sendEmail={
//                                                                                                                                      sendRoundTripEmail
//                                                                                                                              }
//                                                                                                                              title={
//                                                                                                                                      roundTripTitle
//                                                                                                                              }
//                                                                                                                              setTitle={
//                                                                                                                                      setRoundTripTitle
//                                                                                                                              }
//                                                                                                                              nationality={
//                                                                                                                                      roundTripNationality
//                                                                                                                              }
//                                                                                                                              setNationality={
//                                                                                                                                      setRoundTripNationality
//                                                                                                                              }
//                                                                                                                              passengerInfo={
//                                                                                                                                      twoWayPassengerInfo
//                                                                                                                              }
//                                                                                                                              isLoading={
//                                                                                                                                      isRoundTripEmailSending
//                                                                                                                              }
//                                                                                                                              airlineName={
//                                                                                                                                      flightData.airlineName
//                                                                                                                              }
//                                                                                                                              originCity={
//                                                                                                                                      flightData
//                                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                                              ?.originCity
//                                                                                                                              }
//                                                                                                                              destinationCity={
//                                                                                                                                      flightData
//                                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                                              ?.destinationCity
//                                                                                                                              }
//                                                                                                                              amount={
//                                                                                                                                      flightData.amountInKobo
//                                                                                                                              }
//                                                                                                                              flightTime={
//                                                                                                                                      flightData
//                                                                                                                                              .airOriginDestinationList[0]
//                                                                                                                                              ?.totalFlightTimeInMs
//                                                                                                                              }
//                                                                                                                              returnOriginCity={
//                                                                                                                                      flightData
//                                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                                              ?.originCity
//                                                                                                                              }
//                                                                                                                              returnDestinationCity={
//                                                                                                                                      flightData
//                                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                                              ?.destinationCity
//                                                                                                                              }
//                                                                                                                              returnFlightTime={
//                                                                                                                                      flightData
//                                                                                                                                              .airOriginDestinationList[1]
//                                                                                                                                              ?.totalFlightTimeInMs
//                                                                                                                              }
//                                                                                                                      />
//                                                                                                              )}
//                                                                                                      </DialogContent>
//                                                                                              </Dialog>
//                                                                                      </div>
//                                                                              </div>
//                                                                      </div>
//                                                              )
//                                                      )
//                                              )}
//                                      </>
//                              )}
//                      </div>
//              </>
//      );
// }
