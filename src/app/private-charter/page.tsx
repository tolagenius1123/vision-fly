"use client";
import Navbar from "@/components/landing-page/Navbar";
import React, { useState, useEffect, useRef } from "react";
import { MapPin, Calendar as CalendarIcon, Users, ChevronDown, ArrowRight, Plane, Shield } from "lucide-react";
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
import emailjs from "@emailjs/browser";

interface Airport {
        name: string;
        city: string;
        country: string;
        iata: string;
}

const PrivateCharter = () => {
        const [allAirports, setAllAirports] = useState<Airport[]>([]);
        const [airportsFrom, setAirportsFrom] = useState<Airport[]>([]);
        const [airportsTo, setAirportsTo] = useState<Airport[]>([]);
        const [searchFromText, setSearchFromText] = useState("");
        const [searchToText, setSearchToText] = useState("");
        const [originAirport, setOriginAirport] = useState<Airport>();
        const [destinationAirport, setDestinationAirport] = useState<Airport>();
        const [date, setDate] = useState<Date>();
        const [passengers, setPassengers] = useState(1);
        const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
        const [editingOrigin, setEditingOrigin] = useState(false);
        const [editingDestination, setEditingDestination] = useState(false);
        const [departureDateOpen, setDepartureDateOpen] = useState(false);
        const [fieldErrors, setFieldErrors] = useState({
                origin: false,
                destination: false,
                departureDate: false,
        });

        const [showCharterModal, setShowCharterModal] = useState(false);
        const [charterForm, setCharterForm] = useState({
                fullName: "",
                email: "",
                phone: "",
                additionalNeeds: "",
        });
        const [isSubmitting, setIsSubmitting] = useState(false);

        useEffect(() => {
                const fetchAirports = async () => {
                        try {
                                const response = await fetch(
                                        "https://raw.githubusercontent.com/datasets/airport-codes/master/data/airport-codes.csv"
                                );
                                const csvText = await response.text();
                                const lines = csvText.split("\n").slice(1);
                                const parsedAirports = lines
                                        .map((line) => {
                                                const columns = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                                                if (columns && columns.length >= 9) {
                                                        return {
                                                                name: columns[2]?.replace(/"/g, "") || "",
                                                                city: columns[10]?.replace(/"/g, "") || "",
                                                                country: columns[5]?.replace(/"/g, "") || "",
                                                                iata: columns[9]?.replace(/"/g, "") || "",
                                                        };
                                                }
                                                return null;
                                        })
                                        .filter(
                                                (airport) =>
                                                        airport !== null &&
                                                        airport.iata &&
                                                        airport.iata !== "" &&
                                                        airport.iata !== "-" &&
                                                        airport.name
                                        ) as Airport[];
                                setAllAirports(parsedAirports);
                        } catch (error) {
                                console.error("Error fetching airports:", error);
                        }
                };

                fetchAirports();
        }, []);

        const searchAirportsFrom = (query: string) => {
                setSearchFromText(query);
                if (query.length < 2) {
                        setAirportsFrom([]);
                        return;
                }
                const filtered = allAirports
                        .filter(
                                (airport) =>
                                        airport.name.toLowerCase().includes(query.toLowerCase()) ||
                                        airport.city.toLowerCase().includes(query.toLowerCase()) ||
                                        airport.iata.toLowerCase().includes(query.toLowerCase())
                        )
                        .slice(0, 10);
                setAirportsFrom(filtered);
        };

        const searchAirportsTo = (query: string) => {
                setSearchToText(query);
                if (query.length < 2) {
                        setAirportsTo([]);
                        return;
                }
                const filtered = allAirports
                        .filter(
                                (airport) =>
                                        airport.name.toLowerCase().includes(query.toLowerCase()) ||
                                        airport.city.toLowerCase().includes(query.toLowerCase()) ||
                                        airport.iata.toLowerCase().includes(query.toLowerCase())
                        )
                        .slice(0, 10);
                setAirportsTo(filtered);
        };

        const handleRequestCharter = () => {
                const errors = {
                        origin: !originAirport,
                        destination: !destinationAirport,
                        departureDate: !date,
                };

                setFieldErrors(errors);

                if (errors.origin || errors.destination || errors.departureDate) {
                        toast.error("All fields must be completed", { position: "top-right" });
                        setTimeout(() => setFieldErrors({ origin: false, destination: false, departureDate: false }), 2000);
                        return;
                }

                setShowCharterModal(true);
        };

        const handleCharterFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const { name, value } = e.target;
                setCharterForm((prev) => ({ ...prev, [name]: value }));
        };

        const handleSubmitCharter = async () => {
                if (!charterForm.fullName || !charterForm.email || !charterForm.phone) {
                        toast.error("Please fill in all required fields");
                        return;
                }

                setIsSubmitting(true);

                const templateParams = {
                        inquiry_type: "Private Charter Request",
                        origin: originAirport ? `${originAirport.iata} - ${originAirport.city}, ${originAirport.country}` : "N/A",
                        destination: destinationAirport ? `${destinationAirport.iata} - ${destinationAirport.city}, ${destinationAirport.country}` : "N/A",
                        departure_date: date ? format(date, "MMMM dd, yyyy") : "N/A",
                        passenger_count: passengers,
                        passenger_names: charterForm.fullName,
                        user_email: charterForm.email,
                        phone_number: charterForm.phone,
                        additional_notes: charterForm.additionalNeeds || "None specified",
                };

                try {
                        await emailjs.send(
                                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_uahoo9j",
                                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_x3fcfzs",
                                templateParams,
                                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "urvsHSWcfAcTFhHpQ"
                        );
                        setIsSubmitting(false);
                        setShowCharterModal(false);
                        toast.success("Your charter request has been submitted successfully!");
                        setCharterForm({ fullName: "", email: "", phone: "", additionalNeeds: "" });
                        setOriginAirport(undefined);
                        setDestinationAirport(undefined);
                        setDate(undefined);
                        setSearchFromText("");
                        setSearchToText("");
                } catch (error) {
                        setIsSubmitting(false);
                        console.error("EmailJS error:", error);
                        toast.error("Failed to send request. Please try again.");
                }
        };

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
                                        {/* Passengers Dropdown */}
                                        <div className="flex justify-center mb-6 pb-4 border-b border-gray-200">
                                                <div className="relative">
                                                        <button
                                                                type="button"
                                                                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-customBlue text-white rounded-lg text-sm font-semibold focus:outline-none hover:bg-blue-700 transition cursor-pointer"
                                                        >
                                                                <Users size={16} />
                                                                <span>{passengers} {passengers === 1 ? "Passenger" : "Passengers"}</span>
                                                                <ChevronDown size={16} />
                                                        </button>
                                                        {showPassengerDropdown && (
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg py-2 w-48 z-50">
                                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16].map((num) => (
                                                                                <button
                                                                                        key={num}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                                setPassengers(num);
                                                                                                setShowPassengerDropdown(false);
                                                                                        }}
                                                                                        className={cn(
                                                                                                "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                                                                                                passengers === num && "bg-gray-100 font-semibold"
                                                                                        )}
                                                                                >
                                                                                        {num} {num === 1 ? "Passenger" : "Passengers"}
                                                                                </button>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </div>
                                        </div>

                                        {/* Main Search Row */}
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                                {/* Departing From */}
                                                <div className="relative flex-1 w-full">
                                                        <div
                                                                className={cn(
                                                                        "flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 cursor-pointer transition-all",
                                                                        fieldErrors.origin ? "border-red-500 bg-red-50 animate-pulse" : "border-gray-200 hover:border-customBlue"
                                                                )}
                                                                onClick={() => setEditingOrigin(true)}
                                                        >
                                                                <MapPin className="text-customBlue flex-shrink-0" size={20} />
                                                                <div className="flex flex-col flex-1 min-w-0">
                                                                        <span className="text-xs text-gray-500 font-medium">Departing From</span>
                                                                        {editingOrigin ? (
                                                                                <input
                                                                                        autoFocus
                                                                                        type="text"
                                                                                        placeholder="Search city or airport..."
                                                                                        className="bg-transparent outline-none text-gray-800 font-semibold text-sm w-full"
                                                                                        value={searchFromText}
                                                                                        onChange={(e) => searchAirportsFrom(e.target.value)}
                                                                                        onBlur={() => setTimeout(() => setEditingOrigin(false), 250)}
                                                                                />
                                                                        ) : (
                                                                                <span className="text-gray-800 font-semibold text-sm truncate">
                                                                                        {originAirport ? `${originAirport.iata} - ${originAirport.city}` : "Select origin"}
                                                                                </span>
                                                                        )}
                                                                </div>
                                                        </div>
                                                        {editingOrigin && airportsFrom.length > 0 && (
                                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                                                        {airportsFrom.map((airport, index) => (
                                                                                <div
                                                                                        key={index}
                                                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                                                        onClick={() => {
                                                                                                setOriginAirport(airport);
                                                                                                setSearchFromText(`${airport.iata} - ${airport.city}`);
                                                                                                setAirportsFrom([]);
                                                                                                setEditingOrigin(false);
                                                                                        }}
                                                                                >
                                                                                        <div className="font-semibold text-sm">{airport.iata} - {airport.city}</div>
                                                                                        <div className="text-xs text-gray-500">{airport.name}, {airport.country}</div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </div>

                                                {/* Arrow */}
                                                <div className="hidden md:flex items-center justify-center">
                                                        <ArrowRight className="text-customBlue" size={24} />
                                                </div>
                                                <div className="flex md:hidden items-center justify-center rotate-90">
                                                        <ArrowRight className="text-customBlue" size={24} />
                                                </div>

                                                {/* Arriving In */}
                                                <div className="relative flex-1 w-full">
                                                        <div
                                                                className={cn(
                                                                        "flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 cursor-pointer transition-all",
                                                                        fieldErrors.destination ? "border-red-500 bg-red-50 animate-pulse" : "border-gray-200 hover:border-customBlue"
                                                                )}
                                                                onClick={() => setEditingDestination(true)}
                                                        >
                                                                <MapPin className="text-customBlue flex-shrink-0" size={20} />
                                                                <div className="flex flex-col flex-1 min-w-0">
                                                                        <span className="text-xs text-gray-500 font-medium">Arriving In</span>
                                                                        {editingDestination ? (
                                                                                <input
                                                                                        autoFocus
                                                                                        type="text"
                                                                                        placeholder="Search city or airport..."
                                                                                        className="bg-transparent outline-none text-gray-800 font-semibold text-sm w-full"
                                                                                        value={searchToText}
                                                                                        onChange={(e) => searchAirportsTo(e.target.value)}
                                                                                        onBlur={() => setTimeout(() => setEditingDestination(false), 250)}
                                                                                />
                                                                        ) : (
                                                                                <span className="text-gray-800 font-semibold text-sm truncate">
                                                                                        {destinationAirport ? `${destinationAirport.iata} - ${destinationAirport.city}` : "Select destination"}
                                                                                </span>
                                                                        )}
                                                                </div>
                                                        </div>
                                                        {editingDestination && airportsTo.length > 0 && (
                                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                                                        {airportsTo.map((airport, index) => (
                                                                                <div
                                                                                        key={index}
                                                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                                                        onClick={() => {
                                                                                                setDestinationAirport(airport);
                                                                                                setSearchToText(`${airport.iata} - ${airport.city}`);
                                                                                                setAirportsTo([]);
                                                                                                setEditingDestination(false);
                                                                                        }}
                                                                                >
                                                                                        <div className="font-semibold text-sm">{airport.iata} - {airport.city}</div>
                                                                                        <div className="text-xs text-gray-500">{airport.name}, {airport.country}</div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </div>

                                                {/* Date Picker */}
                                                <div className="flex-1 w-full">
                                                        <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
                                                                <PopoverTrigger asChild>
                                                                        <div
                                                                                className={cn(
                                                                                        "flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 cursor-pointer transition-all",
                                                                                        fieldErrors.departureDate ? "border-red-500 bg-red-50 animate-pulse" : "border-gray-200 hover:border-customBlue"
                                                                                )}
                                                                        >
                                                                                <CalendarIcon className="text-customBlue flex-shrink-0" size={20} />
                                                                                <div className="flex flex-col">
                                                                                        <span className="text-xs text-gray-500 font-medium">Date</span>
                                                                                        <span className="text-gray-800 font-semibold text-sm">
                                                                                                {date ? format(date, "MMM dd, yyyy") : "Select date"}
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0 bg-white" align="start">
                                                                        <Calendar
                                                                                mode="single"
                                                                                selected={date}
                                                                                onSelect={(selectedDate) => {
                                                                                        setDate(selectedDate);
                                                                                        setDepartureDateOpen(false);
                                                                                }}
                                                                                disabled={(date) => date < new Date()}
                                                                                initialFocus
                                                                        />
                                                                </PopoverContent>
                                                        </Popover>
                                                </div>

                                                {/* Request Charter Button */}
                                                <button
                                                        type="button"
                                                        onClick={handleRequestCharter}
                                                        className="w-full md:w-auto bg-customBlue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition flex items-center justify-center gap-2"
                                                >
                                                        <Plane size={20} />
                                                        Request Charter
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
                                                                        <strong>{originAirport?.city}</strong> to <strong>{destinationAirport?.city}</strong> on{" "}
                                                                        <strong>{date ? format(date, "MMMM dd, yyyy") : ""}</strong>
                                                                </p>
                                                                <p className="text-sm text-gray-500">{passengers} {passengers === 1 ? "passenger" : "passengers"}</p>
                                                        </div>
                                                </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex flex-col gap-4 mt-4">
                                                <div className="flex flex-col gap-1">
                                                        <label className="text-sm font-semibold text-customBlue">Full Name *</label>
                                                        <input
                                                                name="fullName"
                                                                type="text"
                                                                placeholder="Enter your full name"
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
};

export default PrivateCharter;
