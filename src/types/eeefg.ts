// Способы оплаты
export type TPaymentType = 'online' | 'cash';

// Категории товаров
export type TCategoryType =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Товар с сервера
export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: TCategoryType;
	price: number;
	image: string;
}

export interface IProductData {
	items: IProduct[];
	currentId: string | null; // Аналог `preview`, но другое название
}

// Заказ
export interface IOrder {
	payment: TPaymentType;
	address: string;
	email: string;
	phone: string;
	items: string[]; // ID товаров, отличие от `IProductData` у студента
	total: number; // Простое число вместо массива `IProductOrderPrice[]`
}

// Данные формы заказа
export type IOrderDetails = Pick<
	IOrder,
	'payment' | 'address' | 'email' | 'phone'
>;

// Товар на главной странице
export type IProductMain = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;

// Товар в попапе
export type IProductDetails = Pick<
	IProduct,
	'image' | 'title' | 'category' | 'price' | 'description'
>;

// Товар для добавления в корзину
export type IProductAddToCart = Pick<IProduct, 'id' | 'title' | 'price'>;

// Цена товара в заказe
export type IProductPrice = Pick<IProduct, 'price'>;

// Ошибки валидации
export type FormErrors = Partial<Record<keyof IOrderDetails, string>>;
