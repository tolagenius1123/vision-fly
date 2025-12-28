import { notFound } from "next/navigation";
import Link from "next/link";
import { getRouteBySlug, nigerianRoutes } from "@/lib/routesData";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import { Plane, Clock, MapPin, ArrowRight, Phone, Mail } from "lucide-react";

type Props = {
  params: { slug: string };
};

export default function RoutePage({ params }: Props) {
  const route = getRouteBySlug(params.slug);

  if (!route) {
    notFound();
  }

  const otherRoutes = nigerianRoutes.filter(r => r.slug !== params.slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <section className="relative pt-[100px] pb-16 bg-gradient-to-br from-customBlue via-[#054d66] to-[#043d52]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <p className="text-cyan-300 text-sm font-medium mb-2">PRIVATE JET CHARTER</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {route.origin} to {route.destination}
              </h1>
              <p className="text-xl text-gray-200 mb-6">
                Premium private flights from {route.originCode} to {route.destinationCode}
              </p>
              <div className="flex flex-wrap gap-6 text-gray-100">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-cyan-300" />
                  <span>Flight Time: {route.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane size={20} className="text-cyan-300" />
                  <span>Direct Flight</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl w-full md:w-auto min-w-[300px]">
              <p className="text-gray-500 text-sm mb-1">Starting from</p>
              <p className="text-4xl font-bold text-customBlue mb-4">{route.price}</p>
              <p className="text-gray-600 text-sm mb-6">per flight (one-way)</p>
              <Link 
                href={`/private-charter?origin=${encodeURIComponent(route.origin)}&originCode=${route.originCode}&destination=${encodeURIComponent(route.destination)}&destinationCode=${route.destinationCode}`}
                className="block w-full bg-customBlue text-white text-center py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Request Quote
              </Link>
              <p className="text-xs text-gray-500 mt-3 text-center">No commitment required</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-customBlue mb-6">
              Flying from {route.origin} to {route.destination}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">
              {route.description}
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-md mb-8">
              <h3 className="text-xl font-semibold text-customBlue mb-4">Route Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-customBlue mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="font-semibold">{route.origin} ({route.originCode})</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-cyan-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Arrival</p>
                    <p className="font-semibold">{route.destination} ({route.destinationCode})</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-customBlue mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Flight Duration</p>
                    <p className="font-semibold">{route.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Plane className="text-cyan-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Aircraft Type</p>
                    <p className="font-semibold">Light to Mid-Size Jets</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-customBlue to-cyan-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">Why Choose Vision Fly?</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight size={16} /> Flexible departure times that suit your schedule
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight size={16} /> Skip crowded terminals and long security lines
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight size={16} /> Privacy for confidential business discussions
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight size={16} /> Professional crew with extensive Nigerian routes experience
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-customBlue mb-4">Contact Us</h3>
              <div className="space-y-4">
                <a href="tel:+2348101815572" className="flex items-center gap-3 text-gray-700 hover:text-customBlue transition">
                  <Phone size={18} />
                  <span>+234 810 181 5572</span>
                </a>
                <a href="tel:+17785224683" className="flex items-center gap-3 text-gray-700 hover:text-customBlue transition">
                  <Phone size={18} />
                  <span>+1 778 522 4683</span>
                </a>
                <a href="mailto:charter@visionfly.com.ng" className="flex items-center gap-3 text-gray-700 hover:text-customBlue transition">
                  <Mail size={18} />
                  <span>charter@visionfly.com.ng</span>
                </a>
              </div>
              <Link 
                href="/#contact"
                className="block w-full bg-customBlue text-white text-center py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition mt-6"
              >
                Send Inquiry
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-customBlue mb-4">Other Popular Routes</h3>
              <ul className="space-y-3">
                {otherRoutes.map((r) => (
                  <li key={r.slug}>
                    <Link 
                      href={`/routes/${r.slug}`}
                      className="flex items-center justify-between text-gray-700 hover:text-customBlue transition group"
                    >
                      <span>{r.origin} to {r.destination}</span>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-customBlue">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Book Your {route.origin} to {route.destination} Flight?
          </h2>
          <p className="text-gray-200 mb-8">
            Get a personalized quote within 2 hours. Our team is standing by to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/private-charter?origin=${encodeURIComponent(route.origin)}&originCode=${route.originCode}&destination=${encodeURIComponent(route.destination)}&destinationCode=${route.destinationCode}`}
              className="bg-white text-customBlue py-3 px-8 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Request Quote Now
            </Link>
            <Link 
              href="/private-charter"
              className="border-2 border-white text-white py-3 px-8 rounded-xl font-semibold hover:bg-white hover:text-customBlue transition"
            >
              View Charter Options
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
