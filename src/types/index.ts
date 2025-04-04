// Методы оплаты
export type TPaymentOption = 'card' | 'cash';

// Категории
export type TCategoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Товар
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Заказ
export interface IOrder {
	items: string[]; // ID товаров
	total: number;
	payment: TPaymentOption;
	address: string;
	phone: string;
	email: string;
}

// export interface ICart {
//    items: IProduct[];
//    total: number;
// }

// export interface ICatalog {
//    items: IProduct[];
// }

// Форма оформленного заказа
export interface IOrderCompleted {
	id: string;
	total: number;
}

export type IProductMainPage = Pick<
	IProduct,
	'image' | 'title' | 'category' | 'price'
>;

export type IProductPopup = Pick<
	IProduct,
	'image' | 'title' | 'category' | 'price' | 'description'
>;

export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price'>;

export type IOrderFormData = Pick<
	IOrder,
	'payment' | 'address' | 'email' | 'phone'
>;
