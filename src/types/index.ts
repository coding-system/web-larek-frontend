// Методы оплаты
type TPaymentOption = 'card' | 'cash';

// Категории
type TCategoryType =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Ошибка валидации форм
type FormErrors = Partial<Record<keyof IOrderForm, string>>;

// Товар
interface IProduct {
	id: string;
	description: string;
	title: string;
	category: TCategoryType;
	price: number;
}

// Карточка товара
interface ICard extends IProduct {
	image: string;
}

// Информация о пользователе
interface IUserInfo {
   phone: string;
   email: string;
   address: string;
}

// Форма заказа
interface IOrderForm extends IUserInfo {
	payment: TPaymentOption;
}

// Заказ
interface IOrder extends IOrderForm {
	items: string[];
   total: number;
}

// Форма оформленного заказа
interface IOrderСompleted {
	id: string;
	total: number;
}