import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

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
		this._checkoutButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
		this._events = events;

		this._checkoutButton.addEventListener('click', () =>
			this._events.emit('order:pay-form')
		);
	}

	render(items: HTMLElement[], total: number): void {
		this._items.innerHTML = '';
		if (items.length === 0) {
			this._items.innerHTML = '<p>Корзина пуста</p>';
			this._checkoutButton.disabled = true;
			this._total.textContent = '0 синапсов';
		} else {
			this._items.append(...items);
			this._total.textContent = `${total} синапсов`;
			this._checkoutButton.disabled = false;
		}
	}

	get container(): HTMLElement {
		return this._container;
	}
}
