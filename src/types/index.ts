// Методы оплаты
export type TPaymentOption = 'card' | 'cash';

// Категории
export type TCategoryType =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Товар
export interface IProduct {
	id: string;
   title: string;
	description: string;
	category: TCategoryType;
	price: number;
   image: string;
}

// Заказ
export interface IOrder {
	items: string[];
   total: number;
   payment: string;
   address: string;
   phone: string;
   email: string;
}

export interface ICart {
   items: IProduct[];
   total: number;
}

export interface ICatalog {
   items: IProduct[];
}

// Форма оформленного заказа
export interface IOrderСompleted {
	id: string;
	total: number;
}

export type IProductMainPage = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>

export type IProductPopup = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>
    
export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price' >
    
export type IOrderFormData = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>
    
    