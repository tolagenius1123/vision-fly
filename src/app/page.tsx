import BookFlight from "@/components/landing-page/BookFlight";
import ContactUs from "@/components/landing-page/ContactUs";
import Footer from "@/components/landing-page/Footer";
import HeroSection from "@/components/landing-page/HeroSection";
import Navbar from "@/components/landing-page/Navbar";
import Services from "@/components/landing-page/Services";

export default function Home() {
	return (
		<main className="h-auto w-full">
			<Navbar />
			<HeroSection />
			<BookFlight />
			<Services />
			<ContactUs />
			<Footer />
		</main>
	);
}
