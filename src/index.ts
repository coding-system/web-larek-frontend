import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/appApi';
import { Api } from './components/base/api';
import { CatalogData } from './components/catalogData';
import { Page } from './components/page';
import { ProductCard } from './components/productCard';
import { Modal } from './components/modal';
import { API_URL, settings } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct } from './types';
// import { productsList } from './utils/productsList';

const events = new EventEmitter();
const baseApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const catalogData = new CatalogData(events);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); // Для модалки
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// Загрузки и рендер товаров
events.on('products:loaded', () => {
	const products = catalogData.getItems();
	const cardsArray = products.map((product) => {
		const card = new ProductCard(cardCatalogTemplate, events);
		return card.render(product); // Возвращает HTMLElement
	});
	page.renderCatalog(cardsArray); // Передаём HTMLElement[]
	page.updateCartCounter(0);
});

// Открытие карточки в модалке
events.on('product:open', (data: IProduct) => {
	const product = catalogData.getProduct(data.id);
	const cardModal = new ProductCard(cloneTemplate(cardPreviewTemplate), events);
	modal.render(cardModal.render(product));
});

// Блокировка прокрутки страницы при открытии модалки
events.on('modal:open', () => {
	document.body.style.overflow = 'hidden';
});

// Разблокировка прокрутки
events.on('modal:close', () => {
	document.body.style.overflow = '';
});

// Загрузка данных с API
api
	.fetchProducts()
	.then((products) => {
		// catalogData.setItems(productsList);
		catalogData.setItems(products);
	})
	.catch((error) => {
		console.error('Ошибка при получении данных:', error);
	});
