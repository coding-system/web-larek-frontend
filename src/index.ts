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
import { API_URL, settings } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct } from './types';

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
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);
const cartView = new CartView(cloneTemplate(basketTemplate), events);
const paymentForm = new PaymentForm(cloneTemplate(orderTemplate), events);

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
		// console.log('Товар добавлен в корзину:', product);
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
	modal.render(paymentForm.form); // Открываем форму оплаты в модалке
});

// Блокировка прокрутки страницы при открытии модалки
events.on('modal:open', () => {
	page.lockScroll(true); // Блокируем прокрутку через Page
});   

// Разблокировка прокрутки
events.on('modal:close', () => {
	page.lockScroll(false); // Разблокируем прокрутку через Page
});

// Загрузка данных с API
api
	.fetchProducts()
	.then((products) => {
		catalogData.setItems(products);
	})
	.catch((error) => {
		console.error('Ошибка при получении данных:', error);
	});