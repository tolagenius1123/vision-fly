"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing-page/Navbar";
import React, { useState, useEffect } from "react";
import { ArrowRight, Plane, Users } from "lucide-react";
import Footer from "@/components/landing-page/Footer";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from "@/components/ui/dialog";
import { cn, generateMonthOptions } from "@/lib/utils";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

interface EmptyLegFlight {
        id: string;
        date: string;
        daysFromNow: number;
        route: { from: string; fromCode: string; to: string; toCode: string };
        aircraft: string;
        seats: number;
        price: string;
}

const formatDate = (daysFromNow: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const flightData = [
        { id: 'EL001', daysFromNow: 0, route: { from: 'Lagos', fromCode: 'LOS', to: 'Abuja', toCode: 'ABV' }, aircraft: 'Challenger 605', seats: 9, price: '$4,500' },
        { id: 'EL002', daysFromNow: 1, route: { from: 'Abuja', fromCode: 'ABV', to: 'Port Harcourt', toCode: 'PHC' }, aircraft: 'Learjet 45XR', seats: 8, price: '$3,200' },
        { id: 'EL003', daysFromNow: 3, route: { from: 'Lagos', fromCode: 'LOS', to: 'London', toCode: 'LHR' }, aircraft: 'Gulfstream G650', seats: 14, price: '$45,000' },
        { id: 'EL004', daysFromNow: 5, route: { from: 'Accra', fromCode: 'ACC', to: 'Lagos', toCode: 'LOS' }, aircraft: 'Citation XLS+', seats: 8, price: '$5,800' },
        { id: 'EL005', daysFromNow: 8, route: { from: 'Abuja', fromCode: 'ABV', to: 'Dubai', toCode: 'DXB' }, aircraft: 'Falcon 900LX', seats: 12, price: '$38,000' },
        { id: 'EL006', daysFromNow: 12, route: { from: 'Kano', fromCode: 'KAN', to: 'Lagos', toCode: 'LOS' }, aircraft: 'Hawker 800XP', seats: 8, price: '$2,900' },
        { id: 'EL007', daysFromNow: 18, route: { from: 'Lagos', fromCode: 'LOS', to: 'Johannesburg', toCode: 'JNB' }, aircraft: 'Challenger 350', seats: 10, price: '$28,500' },
        { id: 'EL008', daysFromNow: 25, route: { from: 'Port Harcourt', fromCode: 'PHC', to: 'Abuja', toCode: 'ABV' }, aircraft: 'Phenom 300', seats: 6, price: '$2,400' },
];

export default function EmptyLeg() {
        const [emptyLegs, setEmptyLegs] = useState<EmptyLegFlight[]>([]);

        useEffect(() => {
                setEmptyLegs(flightData.map(flight => ({
                        ...flight,
                        date: formatDate(flight.daysFromNow),
                })));
        }, []);

        const [email, setEmail] = useState("");
        const [fullName, setFullName] = useState("");
        const [isSubscribeOpen, setIsSubscribedOpen] = useState(false);
        const [consentChecked, setConsentChecked] = useState(false);
        const [isInquiryOpen, setIsInquiryOpen] = useState(false);
        const [selectedFlight, setSelectedFlight] = useState<EmptyLegFlight | null>(null);
        const [userInquiryInfo, setUserInquiryInfo] = useState({
                fullName: "",
                emailAddress: "",
                phoneNumber: "",
                numberOfPassengers: "",
        });

        const handleInquiryChange = (
                e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
        ) => {
                const { name, value } = e.currentTarget;
                setUserInquiryInfo((prev) => ({ ...prev, [name]: value }));
        };

        const subscribe = () => {
                if (!fullName || !email) {
                        toast.error("Please fill in all fields");
                        return;
                }
                if (!consentChecked) {
                        toast.error("Please consent to the mailing list subscription");
                        return;
                }

                setIsSubscribedOpen(false);
                setFullName("");
                setEmail("");
                setConsentChecked(false);
                toast.success("You have successfully subscribed to our mail list");
        };

        const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

        const inquireEmptyLeg = async () => {
                if (!userInquiryInfo.fullName || !userInquiryInfo.emailAddress || !userInquiryInfo.phoneNumber) {
                        toast.error("Please fill in all required fields");
                        return;
                }

                setIsSubmittingInquiry(true);

                const templateParams = {
                        inquiry_type: "Empty Leg Inquiry",
                        origin: selectedFlight ? `${selectedFlight.route.fromCode} - ${selectedFlight.route.from}` : "N/A",
                        destination: selectedFlight ? `${selectedFlight.route.toCode} - ${selectedFlight.route.to}` : "N/A",
                        departure_date: selectedFlight?.date || "N/A",
                        passenger_count: userInquiryInfo.numberOfPassengers || "Not specified",
                        passenger_names: userInquiryInfo.fullName,
                        user_email: userInquiryInfo.emailAddress,
                        phone_number: userInquiryInfo.phoneNumber,
                        additional_notes: `Aircraft: ${selectedFlight?.aircraft || "N/A"}, Price: ${selectedFlight?.price || "N/A"}`,
                };

                try {
                        await emailjs.send(
                                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_uahoo9j",
                                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_x3fcfzs",
                                templateParams,
                                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "urvsHSWcfAcTFhHpQ"
                        );
                        setIsSubmittingInquiry(false);
                        setIsInquiryOpen(false);
                        setUserInquiryInfo({
                                fullName: "",
                                emailAddress: "",
                                phoneNumber: "",
                                numberOfPassengers: "",
                        });
                        toast.success("Your inquiry was sent successfully!");
                } catch (error) {
                        setIsSubmittingInquiry(false);
                        console.error("EmailJS error:", error);
                        toast.error("Failed to send inquiry. Please try again.");
                }
        };

        const openInquiry = (flight: EmptyLegFlight) => {
                setSelectedFlight(flight);
                setIsInquiryOpen(true);
        };

        return (
                <main className="h-auto w-full bg-white">
                        <Navbar />
                        
                        {/* Premium Hero Section */}
                        <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
                                <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                                backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
                                        }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                                <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-20 max-w-3xl">
                                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                                Private Aviation, Simplified.
                                        </h1>
                                        <p className="text-lg md:text-xl text-gray-200 mt-4 md:mt-6 max-w-xl">
                                                Browse exclusive empty leg opportunities at highly preferred rates.
                                        </p>
                                        <div className="mt-8">
                                                <a 
                                                        href="#flights"
                                                        className="inline-flex items-center gap-2 bg-customBlue hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition"
                                                >
                                                        View Available Flights
                                                        <ArrowRight size={20} />
                                                </a>
                                        </div>
                                </div>
                        </div>

                        {/* Subscription Banner */}
                        <div className="bg-slate-50 py-6 px-6 md:px-20">
                                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                                        <p className="text-gray-700 text-center md:text-left">
                                                <span className="font-semibold">Never miss an opportunity.</span> Get real-time alerts for routes matching your preferences.
                                        </p>
                                        <Dialog
                                                open={isSubscribeOpen}
                                                onOpenChange={() => setIsSubscribedOpen(!isSubscribeOpen)}
                                        >
                                                <DialogTrigger asChild>
                                                        <button className="flex items-center gap-2 bg-customBlue hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition whitespace-nowrap">
                                                                Subscribe
                                                                <ArrowRight size={18} />
                                                        </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                        <h2 className="text-customBlue font-bold text-xl">
                                                                Subscribe to our mail list
                                                        </h2>
                                                        <div className="flex flex-col gap-3">
                                                                <div className="flex flex-col gap-1">
                                                                        <label className="text-left font-semibold text-customBlue">
                                                                                Full Name
                                                                        </label>
                                                                        <input
                                                                                name="fullName"
                                                                                type="text"
                                                                                placeholder="Enter your full name..."
                                                                                className="w-full text-sm rounded-lg h-[40px] border border-customBlue px-3 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
                                                                                value={fullName}
                                                                                onChange={(e) => setFullName(e.target.value)}
                                                                        />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                        <label className="text-left font-semibold text-customBlue">
                                                                                Email
                                                                        </label>
                                                                        <input
                                                                                name="email"
                                                                                type="email"
                                                                                placeholder="Enter a valid email..."
                                                                                className="w-full text-sm rounded-lg h-[40px] border border-customBlue px-3 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
                                                                                value={email}
                                                                                onChange={(e) => setEmail(e.target.value)}
                                                                        />
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                        <input
                                                                                type="checkbox"
                                                                                id="consent"
                                                                                checked={consentChecked}
                                                                                onChange={(e) => setConsentChecked(e.target.checked)}
                                                                                className="w-4 h-4 border border-customBlue rounded cursor-pointer"
                                                                        />
                                                                        <label htmlFor="consent" className="text-xs text-customBlue cursor-pointer">
                                                                                I consent to subscribing to the Vision Fly mailing list to receive updates on exclusive empty leg routes and special offers.
                                                                        </label>
                                                                </div>
                                                        </div>
                                                        <DialogFooter>
                                                                <button
                                                                        type="button"
                                                                        disabled={!consentChecked}
                                                                        className={cn(
                                                                                "mt-5 bg-customBlue text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-[#205063] flex items-center justify-around disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        )}
                                                                        onClick={subscribe}
                                                                >
                                                                        Subscribe
                                                                </button>
                                                        </DialogFooter>
                                                </DialogContent>
                                        </Dialog>
                                </div>
                        </div>

                        {/* Flight Schedule Section */}
                        <div id="flights" className="py-12 md:py-20 px-6 md:px-20 bg-white">
                                <div className="max-w-6xl mx-auto">
                                        <h2 className="text-2xl md:text-3xl font-bold text-customBlue mb-8 text-center">
                                                Available Empty Leg Flights
                                        </h2>

                                        {/* Desktop Table View */}
                                        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
                                                <table className="w-full">
                                                        <thead>
                                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                                                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                                                                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">Aircraft</th>
                                                                        <th className="text-center py-4 px-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">Seats</th>
                                                                        <th className="text-right py-4 px-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                                                                        <th className="py-4 px-6"></th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {emptyLegs.map((flight) => (
                                                                        <tr 
                                                                                key={flight.id} 
                                                                                className="border-b border-slate-100 hover:bg-slate-50 transition"
                                                                        >
                                                                                <td className="py-4 px-6 text-sm text-gray-700">{flight.date}</td>
                                                                                <td className="py-4 px-6">
                                                                                        <div className="flex items-center gap-2">
                                                                                                <span className="font-bold text-customBlue">{flight.route.fromCode}</span>
                                                                                                <ArrowRight size={16} className="text-gray-400" />
                                                                                                <span className="font-bold text-customBlue">{flight.route.toCode}</span>
                                                                                        </div>
                                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                                                {flight.route.from} to {flight.route.to}
                                                                                        </div>
                                                                                </td>
                                                                                <td className="py-4 px-6 text-sm text-gray-700">{flight.aircraft}</td>
                                                                                <td className="py-4 px-6 text-center">
                                                                                        <div className="flex items-center justify-center gap-1">
                                                                                                <Users size={16} className="text-gray-400" />
                                                                                                <span className="text-sm text-gray-700">{flight.seats}</span>
                                                                                        </div>
                                                                                </td>
                                                                                <td className="py-4 px-6 text-right">
                                                                                        <span className="font-bold text-lg text-customBlue">{flight.price}</span>
                                                                                </td>
                                                                                <td className="py-4 px-6">
                                                                                        <button
                                                                                                onClick={() => openInquiry(flight)}
                                                                                                className="bg-customBlue hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
                                                                                        >
                                                                                                Inquire
                                                                                        </button>
                                                                                </td>
                                                                        </tr>
                                                                ))}
                                                        </tbody>
                                                </table>
                                        </div>

                                        {/* Mobile Stacked View */}
                                        <div className="md:hidden space-y-4">
                                                {emptyLegs.map((flight) => (
                                                        <div 
                                                                key={flight.id}
                                                                className="bg-white rounded-xl shadow-md border border-slate-100 p-4"
                                                        >
                                                                <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm text-gray-500">{flight.date}</span>
                                                                        <div className="flex items-center gap-2">
                                                                                <span className="font-bold text-customBlue">{flight.route.fromCode}</span>
                                                                                <ArrowRight size={14} className="text-gray-400" />
                                                                                <span className="font-bold text-customBlue">{flight.route.toCode}</span>
                                                                        </div>
                                                                </div>
                                                                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                                                                        <span>{flight.aircraft}</span>
                                                                        <div className="flex items-center gap-1">
                                                                                <Users size={14} className="text-gray-400" />
                                                                                <span>{flight.seats} seats</span>
                                                                        </div>
                                                                </div>
                                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                                        <span className="font-bold text-xl text-customBlue">{flight.price}</span>
                                                                        <button
                                                                                onClick={() => openInquiry(flight)}
                                                                                className="bg-customBlue hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
                                                                        >
                                                                                Inquire
                                                                        </button>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>

                        {/* Inquiry Dialog */}
                        <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                                <DialogContent className="sm:max-w-[450px]">
                                        <DialogHeader>
                                                <DialogTitle className="text-customBlue text-xl">
                                                        Inquire About This Flight
                                                </DialogTitle>
                                                {selectedFlight && (
                                                        <DialogDescription asChild>
                                                                <div className="bg-slate-50 rounded-lg p-3 mt-2">
                                                                        <div className="flex items-center gap-2 text-customBlue font-semibold">
                                                                                <span>{selectedFlight.route.fromCode}</span>
                                                                                <ArrowRight size={16} />
                                                                                <span>{selectedFlight.route.toCode}</span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 mt-1">
                                                                                {selectedFlight.date} • {selectedFlight.aircraft} • {selectedFlight.price}
                                                                        </div>
                                                                </div>
                                                        </DialogDescription>
                                                )}
                                        </DialogHeader>
                                        <div className="flex flex-col gap-4 mt-4">
                                                <div className="flex flex-col gap-1">
                                                        <label className="text-left font-semibold text-customBlue text-sm">
                                                                Full Name *
                                                        </label>
                                                        <input
                                                                name="fullName"
                                                                type="text"
                                                                placeholder="Enter your full name"
                                                                className="w-full text-sm rounded-lg h-[40px] border border-customBlue px-3 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
                                                                value={userInquiryInfo.fullName}
                                                                onChange={handleInquiryChange}
                                                        />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                        <label className="text-left font-semibold text-customBlue text-sm">
                                                                Email *
                                                        </label>
                                                        <input
                                                                name="emailAddress"
                                                                type="email"
                                                                placeholder="Enter a valid email"
                                                                className="w-full text-sm rounded-lg h-[40px] border border-customBlue px-3 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
                                                                value={userInquiryInfo.emailAddress}
                                                                onChange={handleInquiryChange}
                                                        />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                        <label className="text-left font-semibold text-customBlue text-sm">
                                                                Phone Number *
                                                        </label>
                                                        <input
                                                                name="phoneNumber"
                                                                type="tel"
                                                                placeholder="Enter phone number"
                                                                className="w-full text-sm rounded-lg h-[40px] border border-customBlue px-3 placeholder:text-sm focus:border-2 focus:border-customBlue focus:outline-none"
                                                                value={userInquiryInfo.phoneNumber}
                                                                onChange={handleInquiryChange}
                                                        />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                        <label className="text-left font-semibold text-customBlue text-sm">
                                                                Number of Passengers
                                                        </label>
                                                        <select
                                                                name="numberOfPassengers"
                                                                className="w-full text-sm rounded-lg h-[40px] border border-customBlue px-3 focus:border-2 focus:border-customBlue focus:outline-none cursor-pointer"
                                                                value={userInquiryInfo.numberOfPassengers}
                                                                onChange={handleInquiryChange}
                                                        >
                                                                <option value="">Select number of passengers</option>
                                                                {selectedFlight && Array.from({ length: selectedFlight.seats }, (_, i) => i + 1).map((num) => (
                                                                        <option key={num} value={num}>{num}</option>
                                                                ))}
                                                        </select>
                                                </div>
                                        </div>
                                        <DialogFooter className="mt-4">
                                                <button
                                                        type="button"
                                                        className="w-full bg-customBlue text-white rounded-lg py-3 px-4 font-semibold cursor-pointer hover:bg-blue-700 transition disabled:opacity-50"
                                                        onClick={inquireEmptyLeg}
                                                        disabled={isSubmittingInquiry}
                                                >
                                                        {isSubmittingInquiry ? "Sending..." : "Send Inquiry"}
                                                </button>
                                        </DialogFooter>
                                </DialogContent>
                        </Dialog>

                        <Footer />
                </main>
        );
}
