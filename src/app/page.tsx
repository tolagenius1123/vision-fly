import BookFlight from "@/components/landing-page/BookFlight";
import HeroSection from "@/components/landing-page/HeroSection";
import Navbar from "@/components/landing-page/Navbar";

export default function Home() {
	return (
		<main className="h-auto w-full">
			<Navbar />
			<HeroSection />
			<BookFlight />
		</main>
	);
}
