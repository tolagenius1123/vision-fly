import Image from "next/image";
import Link from "next/link";
import FooterIcon from "@/assets/icons/vision.svg";
import { FacebookIcon, IgIcon } from "@/assets/icons";
import { nigerianRoutes } from "@/lib/routesData";

export default function Footer() {
        const popularRoutes = nigerianRoutes;

        return (
                <footer className="bg-customBlue text-white">
                        <div className="h-auto w-full flex flex-col gap-10 md:gap-0 md:flex-row justify-around md:justify-between px-10 md:px-20 py-12">
                                <Image src={FooterIcon} alt="footer-icon" className="h-32 w-40" />
                                <div className="flex flex-col md:flex-row gap-14 md:gap-20 mb-10">
                                        <div>
                                                <h2 className="text-xl font-semibold">Private Charter</h2>
                                                <div className="flex text-sm flex-col gap-3 mt-2">
                                                        <Link href="/#home">Local: +2348101815572</Link>
                                                        <Link href="/#about">International: +17785224683</Link>
                                                </div>
                                        </div>
                                        <div>
                                                <h2 className="text-xl font-semibold">Aircraft Purchase</h2>
                                                <div className="flex text-sm flex-col gap-3 mt-2">
                                                        <Link href="/login">charter@visionfly.com.ng</Link>
                                                </div>
                                        </div>
                                        <div>
                                                <h2 className="text-xl font-semibold">Follow us</h2>
                                                <div className="flex text-sm gap-3 mt-2">
                                                        <Link href="/">
                                                                <Image src={FacebookIcon} alt="facebook-icon" />
                                                        </Link>
                                                        <Link href="/">
                                                                <Image src={IgIcon} alt="instagram-icon" />
                                                        </Link>
                                                </div>
                                        </div>
                                </div>
                        </div>
                        
                        <div className="border-t border-white/20 px-10 md:px-20 py-10">
                                <h2 className="text-xl font-semibold mb-6">Popular Nigerian Routes</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {popularRoutes.map((route) => (
                                                <Link 
                                                        key={route.slug}
                                                        href={`/routes/${route.slug}`}
                                                        className="text-sm text-gray-300 hover:text-white hover:underline transition"
                                                >
                                                        {route.origin} to {route.destination}
                                                </Link>
                                        ))}
                                </div>
                        </div>

                        <div className="border-t border-white/20 px-10 md:px-20 py-6">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
                                        <p>&copy; {new Date().getFullYear()} Vision Fly. All rights reserved.</p>
                                        <div className="flex gap-6">
                                                <Link href="/#contact" className="hover:text-white transition">Contact</Link>
                                                <Link href="/private-charter" className="hover:text-white transition">Private Charter</Link>
                                                <Link href="/empty-leg" className="hover:text-white transition">Empty Leg</Link>
                                        </div>
                                </div>
                        </div>
                </footer>
        );
}
