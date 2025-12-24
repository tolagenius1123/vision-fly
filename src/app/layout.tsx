import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Vision Fly | Most Affordable Flights and Private Jet Charters",
	description: "Experience premium air travel for less. Vision Fly offers the most affordable Flights, private charters, empty leg flights, and seamless aviation solutions in Nigeria and beyond.",
	keywords: "private jet, affordable flights, air charter, Vision Fly, Nigeria aviation, empty legs",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth">
			<body className={poppins.className}>
				<Toaster position="top-right" />
				{children}
			</body>
		</html>
	);
}
