import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { CatalogData } from './components/CatalogData';
import { Page } from './components/Page';
import { ProductCard } from './components/ProductCard';
import { API_URL, settings } from './utils/constants';
import { ensureElement } from './utils/utils';
// import { productsList } from './utils/productsList';

const events = new EventEmitter();
const baseApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const catalogData = new CatalogData(events);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// Загрузки и рендер товаров
events.on('products:loaded', () => {
	const products = catalogData.getItems();
	const cardsArray = products.map((product) => {
		const card = new ProductCard(cardCatalogTemplate, events);
		return card.render(product);
	});
	page.renderCatalog(cardsArray);
	page.updateCartCounter(0);
});

// Загрузка данных с API
api
	.fetchProducts()
	.then((products) => {
		// catalogData.setItems(productsList);
		catalogData.setItems(products);
	})
	.catch((err) => {
		console.error('Ошибка при получении данных:', err);
	});
