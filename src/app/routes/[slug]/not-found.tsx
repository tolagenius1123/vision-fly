import Link from "next/link";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-[150px] pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-customBlue mb-4">
          Route Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
          The flight route you&apos;re looking for doesn&apos;t exist. Browse our popular routes below or contact us for a custom charter quote.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="bg-customBlue text-white py-3 px-8 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
          <Link 
            href="/private-charter"
            className="border-2 border-customBlue text-customBlue py-3 px-8 rounded-xl font-semibold hover:bg-customBlue hover:text-white transition"
          >
            Request Custom Charter
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
