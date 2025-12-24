"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PrivateJet, PrivateAircraft, PurchasePlane } from "@/assets/images";
import Link from "next/link";

const Services = () => {
        const router = useRouter();

        return (
                <>
                        <div className="w-full flex flex-col">
                                <div className="w-full flex flex-col md:flex-row">
                                        <div className="w-full md:w-1/2">
                                                <Image
                                                        src={PrivateAircraft}
                                                        alt="private plane"
                                                        className="h-full"
                                                />
                                        </div>
                                        <div className="w-full md:w-1/2 text-customBlue py-10 md:py-20 px-10 md:px-20">
                                                <h1 className="text-2xl md:text-4xl font-bold mt-2">
                                                        You provide the destination, we provide the jet.
                                                </h1>
                                                <p className="mt-4">
                                                        Where do you want to go today? Let us know, and in
                                                        little as 8 hours, your private jet will be ready to
                                                        take you there. Imagine no longer worrying about the
                                                        quality of your aircraft, safety or travel
                                                        experience; its your jet and its ready when you are.
                                                </p>
                                                <Link
                                                        href="/private-charter"
                                                        className="flex items-center gap-3 mt-4 bg-customBlue hover:bg-[#205063] w-[205px] px-6 py-3 rounded-3xl text-white cursor-pointer"
                                                >
                                                        Charter Flights{" "}
                                                        <ArrowRight className="animate-arrow" />
                                                </Link>
                                        </div>
                                </div>
                                <div className="w-full flex flex-col-reverse md:flex-row">
                                        <div className="w-full md:w-1/2 text-customBlue py-10 md:py-20 px-10 md:px-20 pb-16 md:pb-24">
                                                <h1 className="text-2xl md:text-4xl font-bold mt-2">
                                                        Led by Aviators
                                                </h1>
                                                <p className="mt-4 text-slate-600 leading-relaxed">
                                                        Vision Fly is founded and operated by licensed commercial pilots and engineers. We don't just compare prices; we understand the technical side of aviation, ensuring every flight we recommend meets the highest professional standards.
                                                </p>
                                        </div>
                                        <div className="w-full h-full md:w-1/2">
                                                <Image
                                                        src={PurchasePlane}
                                                        alt="private plane"
                                                        style={{ objectFit: "cover" }}
                                                />
                                        </div>
                                </div>
                        </div>
                        <div className="aircraftManagementBackgroundPic w-full h-[600px] flex justify-around items-center">
                                <div className="bg-white bg-opacity-20 backdrop-blur-xl w-[600px] flex flex-col justify-around gap-4 items-center rounded-lg text-white py-10 px-6 md:px-12">
                                        <h1 className="font-bold text-2xl md:text-3xl">
                                                Engineering Precision
                                        </h1>
                                        <p className="font-medium text-center leading-relaxed text-white/95">
                                                We are super passionate about what we do. With our background in aircraft engineering, we analyze routes and aircraft reliability with a level of detail that standard agencies cannot match. Your safety is our obsession.
                                        </p>
                                </div>
                        </div>
                </>
        );
};

export default Services;
