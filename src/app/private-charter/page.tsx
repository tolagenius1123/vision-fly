"use client";
import Navbar from "@/components/landing-page/Navbar";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, ChevronDown, ArrowRight, ArrowLeftRight, Plane, Shield, PlaneTakeoff, PlaneLanding, Plus, Minus } from "lucide-react";
import Footer from "@/components/landing-page/Footer";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Airport {
        _id: string;
        name: string;
        city: string;
        country: string;
        iata: string;
        title: string;
}

function PrivateCharterContent() {
        const searchParams = useSearchParams();
        const [allAirports, setAllAirports] = useState<any[]>([]);
        const [airportsFrom, setAirportsFrom] = useState<Airport[]>([]);
        const [airportsTo, setAirportsTo] = useState<Airport[]>([]);
        const [searchFromText, setSearchFromText] = useState("");
        const [searchToText, setSearchToText] = useState("");
        const [originAirport, setOriginAirport] = useState<Airport>();
        const [destinationAirport, setDestinationAirport] = useState<Airport>();
        const [date, setDate] = useState<Date>();
        const [returnDate, setReturnDate] = useState<Date>();
        const [adults, setAdults] = useState(1);
        const [children, setChildren] = useState(0);
        const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
        const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);
        const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
        const [editingOrigin, setEditingOrigin] = useState(false);
        const [editingDestination, setEditingDestination] = useState(false);
        const [departureDateOpen, setDepartureDateOpen] = useState(false);
        const [returnDateOpen, setReturnDateOpen] = useState(false);
        const [fieldErrors, setFieldErrors] = useState({
                origin: false,
                destination: false,
                departureDate: false,
                returnDate: false,
        });

        const [showCharterModal, setShowCharterModal] = useState(false);
        const [charterForm, setCharterForm] = useState({
                fullName: "",
                email: "",
                phone: "",
                additionalNeeds: "",
        });
        const [passengerNames, setPassengerNames] = useState<string[]>([]);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [paramsApplied, setParamsApplied] = useState(false);

        useEffect(() => {
                const fetchAllAirports = async () => {
                        try {
                                const response = await fetch(
                                        "https://raw.githubusercontent.com/mwgg/Airports/master/airports.json"
                                );
                                const data = await response.json();
                                const airportsArray = Object.values(data).filter((airport: any) => airport.iata);
                                setAllAirports(airportsArray);
                        } catch (error) {
                                console.log("Error fetching airports:", error);
                        }
                };
                fetchAllAirports();
        }, []);

        useEffect(() => {
                if (paramsApplied) return;
                
                const origin = searchParams.get("origin");
                const originCode = searchParams.get("originCode");
                const destination = searchParams.get("destination");
                const destinationCode = searchParams.get("destinationCode");

                if (origin && originCode) {
                        setOriginAirport({
                                _id: originCode,
                                iata: originCode,
                                city: origin,
                                country: "",
                                title: `${origin} Airport`,
                                name: `${origin} Airport`,
                        });
                }

                if (destination && destinationCode) {
                        setDestinationAirport({
                                _id: destinationCode,
                                iata: destinationCode,
                                city: destination,
                                country: "",
                                title: `${destination} Airport`,
                                name: `${destination} Airport`,
                        });
                }

                if (origin || destination) {
                        setParamsApplied(true);
                }
        }, [searchParams, paramsApplied]);

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
                                name: airport.name,
                        }));
        };

        useEffect(() => {
                setAirportsFrom(filterAirports(searchFromText) as any);
        }, [searchFromText, allAirports]);

        useEffect(() => {
                setAirportsTo(filterAirports(searchToText) as any);
        }, [searchToText, allAirports]);

        const handleCharterFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const { name, value } = e.target;
                setCharterForm((prev) => ({ ...prev, [name]: value }));
        };

        const handleRequestCharter = () => {
                const errors = {
                        origin: !originAirport,
                        destination: !destinationAirport,
                        departureDate: !date,
                        returnDate: tripType === "round-trip" && !returnDate,
                };

                setFieldErrors(errors);

                if (errors.origin || errors.destination || errors.departureDate || errors.returnDate) {
                        toast.error("Please fill in all required fields");
                        setTimeout(() => setFieldErrors({ origin: false, destination: false, departureDate: false, returnDate: false }), 2000);
                        return;
                }

                const totalPax = adults + children;
                setPassengerNames(Array(totalPax).fill(""));
                setShowCharterModal(true);
        };

        const handleSubmitCharter = async () => {
                if (!charterForm.fullName || !charterForm.email || !charterForm.phone) {
                        toast.error("Please fill in all required fields");
                        return;
                }

                if (passengerNames.some(name => !name.trim())) {
                        toast.error("Please enter all passenger names");
                        return;
                }

                setIsSubmitting(true);

                const requestData = {
                        tripType: tripType === "one-way" ? "One-Way" : "Round-Trip",
                        origin: originAirport ? `${originAirport.iata} - ${originAirport.city}, ${originAirport.country}` : "",
                        destination: destinationAirport ? `${destinationAirport.iata} - ${destinationAirport.city}, ${destinationAirport.country}` : "",
                        departureDate: date ? format(date, "MMMM dd, yyyy") : "",
                        returnDate: returnDate ? format(returnDate, "MMMM dd, yyyy") : "",
                        contactName: charterForm.fullName,
                        contactEmail: charterForm.email,
                        contactPhone: charterForm.phone,
                        passengerCount: adults + children,
                        passengerList: passengerNames.join("\n"),
                        notes: charterForm.additionalNeeds || "",
                };

                try {
                        const response = await fetch('/api/private-charter', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(requestData),
                        });

                        setIsSubmitting(false);

                        if (response.ok) {
                                setShowCharterModal(false);
                                toast.success("Your charter request has been submitted successfully!");
                                setCharterForm({ fullName: "", email: "", phone: "", additionalNeeds: "" });
                                setPassengerNames([]);
                                setOriginAirport(undefined);
                                setDestinationAirport(undefined);
                                setDate(undefined);
                                setReturnDate(undefined);
                                setSearchFromText("");
                                setSearchToText("");
                        } else {
                                toast.error("Failed to send request. Please try again.");
                        }
                } catch (error) {
                        setIsSubmitting(false);
                        console.error("Charter request error:", error);
                        toast.error("Failed to send request. Please try again.");
                }
        };

        const totalPassengers = adults + children;

        return (
                <main className="h-auto w-full bg-slate-50">
                        <Navbar />
                        
                        {/* Hero Section */}
                        <div className="relative w-full min-h-screen flex flex-col items-center justify-center pt-[120px] pb-12 px-4 md:px-20">
                                <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                                backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
                                        }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                                
                                <div className="relative z-10 text-center mb-8 max-w-3xl">
                                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                                                Your Schedule, Your Rules.
                                        </h1>
                                        <p className="text-lg md:text-xl text-gray-200">
                                                Experience the ultimate freedom of private flight. Enter your route below to get an instant quote estimate from our fleet managers.
                                        </p>
                                </div>

                                {/* Search Card */}
                                <div className="relative z-10 w-full max-w-6xl bg-white rounded-2xl shadow-lg py-6 px-4 md:px-8">
                                        {/* Top Row: Trip Type & Passengers */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 md:gap-6 mb-6 pb-4 border-b border-gray-200">
                                                <div className="relative w-full md:w-auto">
                                                        <button
                                                                type="button"
                                                                onClick={() => setShowTripTypeDropdown(!showTripTypeDropdown)}
                                                                className="w-full md:w-auto flex flex-row items-center justify-center gap-2 px-4 py-2 bg-customBlue text-white rounded-lg text-sm font-semibold focus:outline-none hover:bg-blue-700 transition cursor-pointer"
                                                        >
                                                                <span>{tripType === "one-way" ? "One-Way" : "Round-Trip"}</span>
                                                                <ChevronDown size={16} className="text-white" />
                                                        </button>
                                                        {showTripTypeDropdown && (
                                                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg py-2 w-full md:w-40 z-50">
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                        setTripType("one-way");
                                                                                        setShowTripTypeDropdown(false);
                                                                                        setReturnDate(undefined);
                                                                                }}
                                                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${tripType === "one-way" ? "text-customBlue font-semibold" : "text-gray-700"}`}
                                                                        >
                                                                                One-Way
                                                                        </button>
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                        setTripType("round-trip");
                                                                                        setShowTripTypeDropdown(false);
                                                                                }}
                                                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${tripType === "round-trip" ? "text-customBlue font-semibold" : "text-gray-700"}`}
                                                                        >
                                                                                Round-Trip
                                                                        </button>
                                                                </div>
                                                        )}
                                                </div>
                                                <div className="relative w-full md:w-auto">
                                                        <button
                                                                type="button"
                                                                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                                                                className="w-full md:w-auto flex flex-row items-center justify-center gap-2 px-4 py-2 bg-customBlue text-white rounded-lg text-sm font-semibold focus:outline-none hover:bg-blue-700 transition cursor-pointer"
                                                        >
                                                                <span>{totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}</span>
                                                                <ChevronDown size={16} className="text-white" />
                                                        </button>
                                                        {showPassengerDropdown && (
                                                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full md:w-52 z-50">
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
                                                                        <div className="flex items-center justify-between mb-4">
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
                                                                        <div className="flex justify-end border-t border-gray-200 pt-3">
                                                                                <button
                                                                                        type="button"
                                                                                        onClick={() => setShowPassengerDropdown(false)}
                                                                                        className="text-customBlue text-sm font-semibold hover:underline"
                                                                                >
                                                                                        Close
                                                                                </button>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>

                                        {/* Main Search Row */}
                                        <div className="flex flex-col gap-4 md:flex-row md:gap-2 md:items-center">
                                                {/* Departure Airport */}
                                                <div className="relative w-full md:w-[280px]">
                                                        <div 
                                                                onClick={() => {
                                                                        if (!editingOrigin) {
                                                                                setEditingOrigin(true);
                                                                                if (originAirport?.iata) {
                                                                                        setSearchFromText(originAirport.iata);
                                                                                }
                                                                        }
                                                                }}
                                                                className={`border-2 rounded-lg p-6 min-h-28 flex flex-col justify-center items-center transition relative cursor-text ${
                                                                        fieldErrors.origin
                                                                                ? 'border-red-500 bg-red-50 animate-pulse'
                                                                                : editingOrigin 
                                                                                        ? 'border-customBlue bg-white shadow-md' 
                                                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                                {editingOrigin ? (
                                                                        <div className="w-full">
                                                                                <div className="text-xs text-gray-500 mb-1 text-center">From</div>
                                                                                <input
                                                                                        autoFocus
                                                                                        value={searchFromText}
                                                                                        onChange={(e) => setSearchFromText(e.target.value)}
                                                                                        onBlur={() => {
                                                                                                setTimeout(() => {
                                                                                                        if (!searchFromText && !originAirport?.iata) {
                                                                                                                setEditingOrigin(false);
                                                                                                        }
                                                                                                }, 250);
                                                                                        }}
                                                                                        placeholder="Search city or airport..."
                                                                                        className="text-lg font-medium bg-transparent focus:outline-none text-customBlue w-full text-center"
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
                                                        {editingOrigin && airportsFrom.length === 0 && searchFromText.length > 0 && (
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
                                                                className="p-2 text-customBlue hover:bg-gray-100 rounded-full transition rotate-90 md:rotate-0"
                                                        >
                                                                {tripType === "round-trip" ? (
                                                                        <ArrowLeftRight size={24} />
                                                                ) : (
                                                                        <ArrowRight size={24} />
                                                                )}
                                                        </button>
                                                </div>

                                                {/* Destination Airport */}
                                                <div className="relative w-full md:w-[280px]">
                                                        <div 
                                                                onClick={() => {
                                                                        if (!editingDestination) {
                                                                                setEditingDestination(true);
                                                                                if (destinationAirport?.iata) {
                                                                                        setSearchToText(destinationAirport.iata);
                                                                                }
                                                                        }
                                                                }}
                                                                className={`border-2 rounded-lg p-6 min-h-28 flex flex-col justify-center items-center transition relative cursor-text ${
                                                                        fieldErrors.destination
                                                                                ? 'border-red-500 bg-red-50 animate-pulse'
                                                                                : editingDestination 
                                                                                        ? 'border-customBlue bg-white shadow-md' 
                                                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                                {editingDestination ? (
                                                                        <div className="w-full">
                                                                                <div className="text-xs text-gray-500 mb-1 text-center">To</div>
                                                                                <input
                                                                                        autoFocus
                                                                                        value={searchToText}
                                                                                        onChange={(e) => setSearchToText(e.target.value)}
                                                                                        onBlur={() => {
                                                                                                setTimeout(() => {
                                                                                                        if (!searchToText && !destinationAirport?.iata) {
                                                                                                                setEditingDestination(false);
                                                                                                        }
                                                                                                }, 250);
                                                                                        }}
                                                                                        placeholder="Search city or airport..."
                                                                                        className="text-lg font-medium bg-transparent focus:outline-none text-customBlue w-full text-center"
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
                                                        {editingDestination && airportsTo.length === 0 && searchToText.length > 0 && (
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

                                                {/* Departure Date */}
                                                <div className="w-full md:w-auto md:flex-1">
                                                        <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
                                                                <PopoverTrigger asChild>
                                                                        <div
                                                                                className={`border-2 rounded-lg p-4 min-h-20 flex flex-col justify-center items-center transition cursor-pointer ${
                                                                                        fieldErrors.departureDate
                                                                                                ? 'border-red-500 bg-red-50 animate-pulse'
                                                                                                : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                                                                }`}
                                                                        >
                                                                                <CalendarIcon className="text-customBlue mb-1" size={24} />
                                                                                <span className="text-xs text-gray-500">Departure</span>
                                                                                <span className="text-sm font-semibold text-customBlue">
                                                                                        {date ? format(date, "MMM dd") : "Select"}
                                                                                </span>
                                                                        </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0 bg-white" align="center">
                                                                        <Calendar
                                                                                mode="single"
                                                                                selected={date}
                                                                                onSelect={(selectedDate) => {
                                                                                        setDate(selectedDate);
                                                                                        setDepartureDateOpen(false);
                                                                                        if (returnDate && selectedDate && selectedDate > returnDate) {
                                                                                                setReturnDate(undefined);
                                                                                        }
                                                                                }}
                                                                                disabled={(date) => date < new Date()}
                                                                                initialFocus
                                                                        />
                                                                </PopoverContent>
                                                        </Popover>
                                                </div>

                                                {/* Return Date (only for round-trip) */}
                                                {tripType === "round-trip" && (
                                                        <div className="w-full md:w-auto md:flex-1">
                                                                <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                                                                        <PopoverTrigger asChild>
                                                                                <div
                                                                                        className={`border-2 rounded-lg p-4 min-h-20 flex flex-col justify-center items-center transition cursor-pointer ${
                                                                                                fieldErrors.returnDate
                                                                                                        ? 'border-red-500 bg-red-50 animate-pulse'
                                                                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                                                                        }`}
                                                                                >
                                                                                        <CalendarIcon className="text-customBlue mb-1" size={24} />
                                                                                        <span className="text-xs text-gray-500">Return</span>
                                                                                        <span className="text-sm font-semibold text-customBlue">
                                                                                                {returnDate ? format(returnDate, "MMM dd") : "Select"}
                                                                                        </span>
                                                                                </div>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0 bg-white" align="center">
                                                                                <Calendar
                                                                                        mode="single"
                                                                                        selected={returnDate}
                                                                                        onSelect={(selectedDate) => {
                                                                                                setReturnDate(selectedDate);
                                                                                                setReturnDateOpen(false);
                                                                                        }}
                                                                                        disabled={(d) => d < new Date() || (date ? d < date : false)}
                                                                                        initialFocus
                                                                                />
                                                                        </PopoverContent>
                                                                </Popover>
                                                        </div>
                                                )}

                                                {/* Request Charter Button */}
                                                <button
                                                        type="button"
                                                        onClick={handleRequestCharter}
                                                        className="w-full md:w-auto bg-customBlue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition flex items-center justify-center gap-2"
                                                >
                                                        <Plane size={20} />
                                                        <span className="hidden md:inline">Request Charter</span>
                                                        <span className="md:hidden">Request</span>
                                                </button>
                                        </div>
                                </div>
                        </div>

                        {/* Charter Request Modal */}
                        <Dialog open={showCharterModal} onOpenChange={setShowCharterModal}>
                                <DialogContent className="w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto">
                                        <DialogHeader>
                                                <DialogTitle className="text-customBlue text-xl md:text-2xl">Customize Your Private Journey</DialogTitle>
                                                <DialogDescription asChild>
                                                        <div className="text-gray-600 mt-2">
                                                                <p className="mb-2">
                                                                        <strong>{originAirport?.city}</strong> to <strong>{destinationAirport?.city}</strong>
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                        {tripType === "round-trip" ? "Round-Trip" : "One-Way"} | {date ? format(date, "MMM dd, yyyy") : ""}
                                                                        {tripType === "round-trip" && returnDate && ` - ${format(returnDate, "MMM dd, yyyy")}`}
                                                                </p>
                                                                <p className="text-sm text-gray-500">{totalPassengers} {totalPassengers === 1 ? "passenger" : "passengers"}</p>
                                                        </div>
                                                </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex flex-col gap-4 mt-4">
                                                <div className="flex flex-col gap-1">
                                                        <label className="text-sm font-semibold text-customBlue">Contact Name *</label>
                                                        <input
                                                                name="fullName"
                                                                type="text"
                                                                placeholder="Enter main contact's full name"
                                                                className="w-full text-sm rounded-lg h-[45px] border border-gray-300 px-3 placeholder:text-gray-400 focus:border-2 focus:border-customBlue focus:outline-none"
                                                                value={charterForm.fullName}
                                                                onChange={handleCharterFormChange}
                                                        />
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                        <label className="text-sm font-semibold text-customBlue">Email Address *</label>
                                                        <input
                                                                name="email"
                                                                type="email"
                                                                placeholder="Enter your email"
                                                                className="w-full text-sm rounded-lg h-[45px] border border-gray-300 px-3 placeholder:text-gray-400 focus:border-2 focus:border-customBlue focus:outline-none"
                                                                value={charterForm.email}
                                                                onChange={handleCharterFormChange}
                                                        />
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                        <label className="text-sm font-semibold text-customBlue">Phone Number *</label>
                                                        <input
                                                                name="phone"
                                                                type="tel"
                                                                placeholder="Enter your phone number"
                                                                className="w-full text-sm rounded-lg h-[45px] border border-gray-300 px-3 placeholder:text-gray-400 focus:border-2 focus:border-customBlue focus:outline-none"
                                                                value={charterForm.phone}
                                                                onChange={handleCharterFormChange}
                                                        />
                                                </div>

                                                {passengerNames.length > 0 && (
                                                        <div className="flex flex-col gap-2">
                                                                <label className="text-sm font-semibold text-customBlue">Passenger Manifest *</label>
                                                                <p className="text-xs text-gray-500">Enter the full name for each passenger</p>
                                                                {passengerNames.map((name, index) => (
                                                                        <input
                                                                                key={index}
                                                                                type="text"
                                                                                placeholder={`Passenger ${index + 1} full name`}
                                                                                className="w-full text-sm rounded-lg h-[45px] border border-gray-300 px-3 placeholder:text-gray-400 focus:border-2 focus:border-customBlue focus:outline-none"
                                                                                value={name}
                                                                                onChange={(e) => {
                                                                                        const newNames = [...passengerNames];
                                                                                        newNames[index] = e.target.value;
                                                                                        setPassengerNames(newNames);
                                                                                }}
                                                                        />
                                                                ))}
                                                        </div>
                                                )}

                                                <div className="flex flex-col gap-1">
                                                        <label className="text-sm font-semibold text-customBlue">Additional Travel Needs</label>
                                                        <textarea
                                                                name="additionalNeeds"
                                                                placeholder="E.g., Catering requests, ground transport, travelling with pets, or specific aircraft preference..."
                                                                className="w-full text-sm rounded-lg h-[120px] border border-gray-300 p-3 placeholder:text-gray-400 focus:border-2 focus:border-customBlue focus:outline-none resize-none"
                                                                value={charterForm.additionalNeeds}
                                                                onChange={handleCharterFormChange}
                                                        />
                                                </div>
                                        </div>

                                        <DialogFooter className="flex flex-col gap-3 mt-4">
                                                <button
                                                        type="button"
                                                        onClick={handleSubmitCharter}
                                                        disabled={isSubmitting}
                                                        className="w-full bg-customBlue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                        {isSubmitting ? "Sending..." : "Receive Quote"}
                                                </button>
                                                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                                                        <Shield size={12} />
                                                        Our charter team will review your requirements and send a bespoke quote within 2 hours.
                                                </p>
                                        </DialogFooter>
                                </DialogContent>
                        </Dialog>

                        <Footer />
                </main>
        );
}

const PrivateCharter = () => {
        return (
                <Suspense fallback={
                        <main className="h-auto w-full bg-slate-50">
                                <Navbar />
                                <div className="min-h-screen flex items-center justify-center">
                                        <div className="text-customBlue text-lg">Loading...</div>
                                </div>
                                <Footer />
                        </main>
                }>
                        <PrivateCharterContent />
                </Suspense>
        );
};

export default PrivateCharter;
