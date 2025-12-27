export interface FlightRoute {
  slug: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  price: string;
  duration: string;
  description: string;
}

export const nigerianRoutes: FlightRoute[] = [
  {
    slug: "lagos-to-abuja-flights",
    origin: "Lagos",
    originCode: "LOS",
    destination: "Abuja",
    destinationCode: "ABV",
    price: "₦145,000",
    duration: "1h 10m",
    description: "The Lagos to Abuja route is Nigeria's busiest air corridor, connecting the commercial capital to the political heart of the nation. Business executives, government officials, and entrepreneurs fly this route daily for meetings, conferences, and diplomatic engagements. Vision Fly offers premium private charter services with flexible departure times, ensuring you arrive refreshed and ready for your important engagements in the Federal Capital Territory."
  },
  {
    slug: "abuja-to-lagos-flights",
    origin: "Abuja",
    originCode: "ABV",
    destination: "Lagos",
    destinationCode: "LOS",
    price: "₦145,000",
    duration: "1h 10m",
    description: "Flying from Abuja to Lagos provides seamless access to Nigeria's economic powerhouse. Whether you're heading to Victoria Island for business meetings, exploring investment opportunities in Lekki, or attending events in Ikeja, our private charter service offers the convenience and privacy you deserve. Skip the crowded terminals and enjoy a personalized travel experience with Vision Fly."
  },
  {
    slug: "abuja-to-kano-flights",
    origin: "Abuja",
    originCode: "ABV",
    destination: "Kano",
    destinationCode: "KAN",
    price: "₦120,000",
    duration: "55m",
    description: "The Abuja to Kano route connects the capital to Nigeria's second-largest city and the commercial hub of Northern Nigeria. Kano's rich history in trade, agriculture, and manufacturing makes it a vital destination for business travelers. Vision Fly's charter services provide direct access to Mallam Aminu Kano International Airport, saving you valuable time compared to connecting flights."
  },
  {
    slug: "lagos-to-port-harcourt-flights",
    origin: "Lagos",
    originCode: "LOS",
    destination: "Port Harcourt",
    destinationCode: "PHC",
    price: "₦135,000",
    duration: "1h 5m",
    description: "Port Harcourt, the Garden City, is Nigeria's oil and gas capital. The Lagos to Port Harcourt route serves executives in the petroleum industry, offshore workers, and business professionals in the Niger Delta region. Vision Fly understands the demanding schedules of energy sector professionals and offers flexible charter options to match your operational requirements."
  },
  {
    slug: "abuja-to-owerri-flights",
    origin: "Abuja",
    originCode: "ABV",
    destination: "Owerri",
    destinationCode: "QOW",
    price: "₦125,000",
    duration: "1h",
    description: "Owerri, the capital of Imo State, is a growing destination for business and leisure travelers. The Abuja to Owerri route provides access to the South-East's thriving economy, cultural festivals, and investment opportunities. Sam Mbakwe International Cargo Airport welcomes Vision Fly's charter flights, offering a stress-free arrival experience in the heart of Igbo land."
  },
  {
    slug: "lagos-to-enugu-flights",
    origin: "Lagos",
    originCode: "LOS",
    destination: "Enugu",
    destinationCode: "ENU",
    price: "₦130,000",
    duration: "1h 15m",
    description: "Enugu, known as the Coal City, serves as the gateway to Nigeria's South-East region. The Lagos to Enugu route is popular among business travelers, families visiting relatives, and tourists exploring the region's natural attractions. Vision Fly's private charter to Akanu Ibiam International Airport offers a premium alternative to crowded commercial flights."
  },
  {
    slug: "port-harcourt-to-abuja-flights",
    origin: "Port Harcourt",
    originCode: "PHC",
    destination: "Abuja",
    destinationCode: "ABV",
    price: "₦140,000",
    duration: "1h 15m",
    description: "Oil and gas executives frequently travel the Port Harcourt to Abuja route for government meetings, regulatory approvals, and policy discussions. Vision Fly's charter service provides the privacy and flexibility needed for confidential business travel. Depart from Port Harcourt International Airport and arrive at Nnamdi Azikiwe International Airport on your schedule."
  },
  {
    slug: "kano-to-abuja-flights",
    origin: "Kano",
    originCode: "KAN",
    destination: "Abuja",
    destinationCode: "ABV",
    price: "₦120,000",
    duration: "55m",
    description: "The Kano to Abuja corridor serves politicians, business leaders, and agricultural traders connecting Northern Nigeria's commercial center to the seat of federal power. Vision Fly offers reliable charter services that respect your time and provide the comfort expected by discerning travelers from Kano's business community."
  },
  {
    slug: "lagos-to-calabar-flights",
    origin: "Lagos",
    originCode: "LOS",
    destination: "Calabar",
    destinationCode: "CBQ",
    price: "₦150,000",
    duration: "1h 25m",
    description: "Calabar, Cross River State's capital, is famous for its annual Carnival and beautiful coastal scenery. The Lagos to Calabar route attracts both business travelers and tourists seeking Nigeria's most hospitable city. Vision Fly's charter service to Margaret Ekpo International Airport provides a luxurious start to your Cross River experience."
  },
  {
    slug: "abuja-to-maiduguri-flights",
    origin: "Abuja",
    originCode: "ABV",
    destination: "Maiduguri",
    destinationCode: "MIU",
    price: "₦160,000",
    duration: "1h 30m",
    description: "Maiduguri, the capital of Borno State, requires secure and reliable transportation for government officials, humanitarian workers, and business professionals. Vision Fly provides discreet charter services to Maiduguri International Airport, ensuring safe and comfortable travel to Nigeria's North-East. Our experienced crew prioritizes your security and comfort on every flight."
  },
  {
    slug: "lagos-to-kano-flights",
    origin: "Lagos",
    originCode: "LOS",
    destination: "Kano",
    destinationCode: "KAN",
    price: "₦155,000",
    duration: "1h 40m",
    description: "The Lagos to Kano route bridges Nigeria's economic South and commercial North. Traders, manufacturers, and business executives rely on this corridor to maintain business relationships across regional lines. Vision Fly's charter service offers a direct connection without the layovers common on commercial flights, maximizing your productive time."
  },
  {
    slug: "abuja-to-port-harcourt-flights",
    origin: "Abuja",
    originCode: "ABV",
    destination: "Port Harcourt",
    destinationCode: "PHC",
    price: "₦140,000",
    duration: "1h 15m",
    description: "Government officials and energy sector executives frequently fly the Abuja to Port Harcourt route for regulatory meetings and project oversight. Vision Fly understands the importance of punctuality and discretion in these high-stakes journeys. Our charter service delivers you directly to Port Harcourt's international airport with minimal hassle."
  }
];

export function getRouteBySlug(slug: string): FlightRoute | undefined {
  return nigerianRoutes.find(route => route.slug === slug);
}

export function getAllRouteSlugs(): string[] {
  return nigerianRoutes.map(route => route.slug);
}
