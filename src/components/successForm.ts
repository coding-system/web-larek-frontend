import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class SuccessView {
    protected _container: HTMLElement;
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._events = events;
        this._container = container;
        this._description = ensureElement<HTMLElement>('.order-success__description', this._container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this._container);
    }

    render(total: number): HTMLElement {
        this._description.textContent = `Списано ${total} синапсов`;
        // Событие для кнопки будет обрабатываться в index.ts
        this._closeButton.onclick = () => this._events.emit('success:close');
        return this._container;
    }
}