import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/appApi';
import { Api } from './components/base/api';
import { CatalogData } from './components/catalogData';
import { CartData } from './components/cartData';
import { OrderData } from './components/orderData';
import { Page } from './components/page';
import { ProductCard } from './components/productCard';
import { Modal } from './components/modal';
import { CartView } from './components/cartView';
import { PaymentForm } from './components/paymentForm';
import { ContactsForm } from './components/contactsForm';
import { SuccessView } from './components/successForm';
import { API_URL, settings } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct, IOrderFormData, FormErrors } from './types';

const events = new EventEmitter();
const baseApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const catalogData = new CatalogData(events);
const cartData = new CartData(events);
const orderData = new OrderData(events, api);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);
const cartView = new CartView(cloneTemplate(basketTemplate), events);
const paymentForm = new PaymentForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

// Загрузка и рендер товаров
events.on('products:loaded', () => {
	const products = catalogData.getItems();
	const cardsArray = products.map((product) => {
		const card = new ProductCard(cardCatalogTemplate, events);
		return card.render(product);
	});
	page.renderCatalog(cardsArray);
	page.updateCartCounter(cartData.getItems().length);
});

// Открытие карточки в модалке
events.on('product:open', (data: IProduct) => {
	const product = catalogData.getProduct(data.id);
	if (product) {
		let cardModal: ProductCard;
		try {
			cardModal = new ProductCard(cloneTemplate(cardPreviewTemplate), events);
		} catch (error) {
			console.error('Ошибка клонирования #card-preview:', error);
			return;
		}
		modal.render(cardModal.render(product));
	}
});

// Добавление товара в корзину
events.on('product:add', (data: { id: string }) => {
	const product = catalogData.getProduct(data.id);
	if (product) {
		cartData.addItem(product);
		modal.close();
	} else {
		console.error('Товар не найден:', data.id);
	}
});

// Удаление товара из корзины
events.on('product:remove', (data: { id: string }) => {
	cartData.removeItem(data.id);
});

// Обновление корзины
events.on('cart:changed', (items: IProduct[]) => {
	page.updateCartCounter(items.length);
	if (
		modal.container.classList.contains('modal_active') &&
		modal.container.querySelector('.basket')
	) {
		cartView.render(items, cartData.getTotal());
	}
});

// Открытие корзины
events.on('cart:open', () => {
	const items = cartData.getItems();
	cartView.render(items, cartData.getTotal());
	modal.render(cartView.container);
});

// Открытие формы оплаты
events.on('order:pay-form', () => {
	console.log('"Оформить" нажато');
	orderData.setItems(cartData.getItems().map((item) => item.id));
	orderData.setTotal(cartData.getTotal());
	modal.render(paymentForm.form);
});

// Изменение данных формы
events.on('order:input-changed', (data: Partial<IOrderFormData>) => {
	for (const [key, value] of Object.entries(data)) {
		orderData.setField(key as keyof IOrderFormData, value);
	}
	if (modal.container.contains(contactsForm.form)) {
		const errors = orderData.validateContacts();
		const isValid = Object.keys(errors).length === 0;
		events.emit('form:validated', { isValid, errors });
	}
});

// Валидация формы
events.on(
	'form:validated',
	(data: { isValid: boolean; errors: FormErrors }) => {
		if (modal.container.contains(paymentForm.form)) {
			paymentForm.setErrors(data.errors);
			paymentForm.setSubmitActive(data.isValid);
		} else if (modal.container.contains(contactsForm.form)) {
			contactsForm.setErrors(data.errors);
			contactsForm.setSubmitActive(data.isValid);
		}
	}
);

// Отправка формы оплаты
events.on('order:submit-payment', () => {
	const errors = orderData.validatePayment();
	if (Object.keys(errors).length === 0) {
		modal.render(contactsForm.form);
	} else {
		events.emit('form:validated', { isValid: false, errors });
	}
});

// Отправка формы контактов
events.on('order:submit-contacts', () => {
	const errors = orderData.validateContacts();
	if (Object.keys(errors).length === 0) {
		orderData.submit();
	} else {
		events.emit('form:validated', { isValid: false, errors });
	}
});

// Успешная отправка заказа
events.on('order:success', () => {
	const total = cartData.getTotal();
	modal.render(successView.render(total)); // Показываем модалку успеха
	orderData.clear();
	cartData.clear();
	page.updateCartCounter(0);
});

// Закрытие модалки после "За новыми покупками!"
events.on('success:close', () => {
	modal.close(); // Закрываем модалку
});

// Блокировка прокрутки
events.on('modal:open', () => page.lockScroll(true));
events.on('modal:close', () => page.lockScroll(false));

// Загрузка данных с API
api
	.fetchProducts()
	.then((products) => catalogData.setItems(products))
	.catch((error) => console.error('Ошибка при получении данных:', error));
