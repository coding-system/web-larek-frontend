import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class Page {
    private _catalog: HTMLElement;
    private _cartCounter: HTMLElement;
    private _cartButton: HTMLButtonElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._catalog = ensureElement('.gallery', container);
        this._cartCounter = ensureElement('.header__basket-counter', container);
        this._cartButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._events = events;

        // Добавляем обработчик клика по кнопке корзины
        this._cartButton.addEventListener('click', () => this.onCartClick());
    }

    renderCatalog(products: HTMLElement[]): void { // Изменили тип с IProductMainPage[] на HTMLElement[]
        this._catalog.innerHTML = '';
        this._catalog.append(...products);
    }

    updateCartCounter(count: number): void {
        this._cartCounter.textContent = count.toString();
    }

    onCartClick(): void {
        this._events.emit('cart:open');
    }
}