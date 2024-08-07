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

interface Option {
	label: string;
	value: string;
}

// type FlightsData = {

// }

interface DataObject {
	id: string;
	airPricedIternaryList: [];
	airlineCodeSet: [];
	stopsSet: [];
	priceSet: [];
	cabinSet: [];
	uniqueSessionId: string;
	searchRequest: null;
	resultProcessSuccessfully: boolean;
}

interface ApiResponse {
	success: string;
	data: DataObject;
	message: string;
	status: string;
}

type FlightBookingInfo = {
	title: string;
	surname: string;
	firstName: string;
	middleName?: string;
	dateOfBirth: string;
	email: string;
	phoneNumber: string;
};

type Country = {
	id: number;
	name: string;
	code: string;
	iso: string;
	dialingCode: string;
	currencyCode: string;
	currencyName: string;
	continent: string;
	capital: string;
};
