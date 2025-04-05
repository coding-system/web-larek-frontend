import { EventEmitter } from './base/events';
import { ProductCard } from './productCard';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { IProductToAdd } from '../types';

export class CartView {
    private _container: HTMLElement;
    private _items: HTMLElement;
    private _total: HTMLElement;
    private _checkoutButton: HTMLButtonElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._container = container;
        this._items = ensureElement('.basket__list', container);
        this._total = ensureElement('.basket__price', container);
        this._checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', container);
        this._events = events;

        this._checkoutButton.addEventListener('click', () => this.onCheckoutClick());
    }

    render(items: IProductToAdd[], total: number): void {
        this._items.innerHTML = '';
        const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

        if (items.length === 0) {
            this._items.innerHTML = '<p>Корзина пуста</p>';
            this._checkoutButton.disabled = true;
        } else {
            const itemElements = items.map((item, index) => {
                const card = new ProductCard(cloneTemplate(cardBasketTemplate), this._events);
                const renderedCard = card.render(item);
                renderedCard.dataset.id = item.id;
                const indexElement = ensureElement('.basket__item-index', renderedCard);
                indexElement.textContent = (index + 1).toString();
                return renderedCard;
            });
            this._items.append(...itemElements);
            this._checkoutButton.disabled = false;
        }

        this._total.textContent = `${total} синапсов`;
    }

    onCheckoutClick(): void {
        this._events.emit('order:pay-form');
    }

    get container(): HTMLElement {
        return this._container;
    }
}