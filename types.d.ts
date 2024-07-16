interface Location {
	type: string;
	coordinates: [number, number];
}

interface Airport {
	_id: string;
	city: string;
	elevation: number;
	name: string;
	title: string;
	loc: Location;
	country: string;
	region: string;
	iata: string;
	continent: string;
	icao: string;
	lat: number;
	lng: number;
	type: string;
	id: string;
	length_ft: number;
	width_ft: number;
	surface: string;
	lastUpdated: string;
	sstr: string;
	tzCode: string;
}

// Example usage:
// const airport: Airport = {
// 	_id: "DNMM",
// 	city: "Lagos",
// 	elevation: 135,
// 	name: "Murtala Muhammed International Airport",
// 	title: "(DNMM) Lagos, Lagos, Nigeria - Murtala Muhammed International Airport",
// 	loc: {
// 		type: "Point",
// 		coordinates: [3.321160078048706, 6.5773701667785645],
// 	},
// 	country: "Nigeria",
// 	region: "Lagos",
// 	iata: "LOS",
// 	continent: "AF",
// 	icao: "DNMM",
// 	lat: 6.5773701667785645,
// 	lng: 3.321160078048706,
// 	type: "large_airport",
// 	id: "DNMM",
// 	length_ft: 12794,
// 	width_ft: 197,
// 	surface: "ASP",
// 	lastUpdated: "2019-10-24T17:18:07.978Z",
// 	sstr: "dnmm lagos murtala muhammed international airport nigeria",
// 	tzCode: "Africa/Lagos",
// };

interface Option {
	label: string;
	value: string;
}
