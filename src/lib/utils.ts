import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: any | undefined) {
	const year = date?.getFullYear();
	const month = String(date?.getMonth() + 1).padStart(2, "0");
	const day = String(date?.getDate()).padStart(2, "0");
	const hours = String(date?.getHours()).padStart(2, "0");
	const minutes = String(date?.getMinutes()).padStart(2, "0");
	const seconds = String(date?.getSeconds()).padStart(2, "0");
	const milliseconds = String(date?.getMilliseconds()).padStart(1, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function formatKoboToNaira(amountInKobo: number) {
	const amountInNaira = amountInKobo / 100 + 10000;

	const formattedAmount = amountInNaira.toLocaleString();

	return `₦ ${formattedAmount}`;
}

export function formatWithNairaSign(amount: number) {
	const formattedAmount = amount.toLocaleString();

	return `₦ ${formattedAmount}`;
}

export function convertMinutesToHoursAndMinutes(timeInMinutes: number) {
	const hours = Math.floor(timeInMinutes / 60);
	const minutes = timeInMinutes % 60;
	return `${hours}hr ${minutes}mins`;
}

export const generateYearOptions = () => {
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let year = currentYear; year >= 1900; year--) {
		years.push(year);
	}
	return years;
};

export const generateMonthOptions = () => {
	return Array.from({ length: 12 }, (_, i) => i + 1);
};

export const generateDayOptions = () => {
	return Array.from({ length: 31 }, (_, i) => i + 1);
};
