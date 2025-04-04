import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export class Page {
    private _catalog: HTMLElement;
    private _cartCounter: HTMLElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._catalog = ensureElement('.gallery', container);
        this._cartCounter = ensureElement('.header__basket-counter', container);
        this._events = events;
    }

    renderCatalog(elements: HTMLElement[]): void {
        this._catalog.innerHTML = '';
        elements.forEach(element => {
            this._catalog.appendChild(element);
        });
    }

    updateCartCounter(count: number): void {
        this._cartCounter.textContent = count.toString();
    }
}