import { EventEmitter } from './base/events'; // Для событий
import { ensureElement } from '../utils/utils'; // Утилита для поиска элементов

////////////////////////////////////////////////////////////////////
///////////////////// Управление страницей /////////////////////////
////////////////////////////////////////////////////////////////////
export class Page {
    private _catalog: HTMLElement;
    private _cartCounter: HTMLElement;
    private _cartButton: HTMLButtonElement;
    private _events: EventEmitter;

    // Инициализация страницы
    constructor(container: HTMLElement, events: EventEmitter) {
        this._catalog = ensureElement('.gallery', container);
        this._cartCounter = ensureElement('.header__basket-counter', container);
        this._cartButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._events = events;

        this._cartButton.addEventListener('click', () => this.onCartClick());
    }

    // Отрисовка каталога
    renderCatalog(products: HTMLElement[]): void {
        this._catalog.innerHTML = '';
        this._catalog.append(...products);
    }

    // Обновление счётчика корзины
    updateCartCounter(count: number): void {
        this._cartCounter.textContent = count.toString();
    }

    // Открытие корзины
    onCartClick(): void {
        this._events.emit('cart:open');
    }
}