import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/appApi';
import { Api } from './components/base/api';
import { CatalogData } from './components/catalogData';
import { CartData } from './components/cartData';
import { Page } from './components/page';
import { ProductCard } from './components/productCard';
import { Modal } from './components/modal';
import { CartView } from './components/cartView';
import { API_URL, settings } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct } from './types';

const events = new EventEmitter();
const baseApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const catalogData = new CatalogData(events);
const cartData = new CartData(events);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);
const cartView = new CartView(cloneTemplate(basketTemplate), events);

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
    console.log('Событие product:add получено:', data.id);
    const product = catalogData.getProduct(data.id);
    if (product) {
        cartData.addItem(product);
        console.log('Товар добавлен в корзину:', product);
        modal.close();
    } else {
        console.error('Товар не найден:', data.id);
    }
});

// Удаление товара из корзины
events.on('product:remove', (data: { id: string }) => {
    console.log('Событие product:remove получено:', data.id);
    cartData.removeItem(data.id);
});

// Обновление корзины
events.on('cart:changed', (items: IProduct[]) => {
    console.log('Корзина обновлена:', items);
    page.updateCartCounter(items.length);
    if (modal.container.classList.contains('modal_active') && modal.container.querySelector('.basket')) {
        cartView.render(items, cartData.getTotal());
    }
});

// Открытие корзины
events.on('cart:open', () => {
    const items = cartData.getItems();
    cartView.render(items, cartData.getTotal());
    modal.render(cartView.container);
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
        catalogData.setItems(products);
    })
    .catch((error) => {
        console.error('Ошибка при получении данных:', error);
    });