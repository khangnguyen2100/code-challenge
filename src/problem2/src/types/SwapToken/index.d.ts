export interface Currency {
	currency: string;
	exchangeRate: number;
	date: string | Date;
	logo: string;
}
export interface UserBalance {
	currency: string;
	amount: number;
}