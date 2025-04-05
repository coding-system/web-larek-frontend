import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class Modal {
    private _container: HTMLElement;
    private _content: HTMLElement;
    private _closeButton: HTMLButtonElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._container = container;
        this._content = ensureElement('.modal__content', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._events = events;

        this._closeButton.addEventListener('click', () => this.close());
        this._container.addEventListener('click', (event) => {
            if (event.target === this._container) this.close();
        });
    }

    render(content: HTMLElement): void {
        this._content.innerHTML = '';
        this._content.append(content);
        this.open();
    }

    open(): void {
        this._container.classList.add('modal_active');
        this._events.emit('modal:open');
    }

    close(): void {
        this._container.classList.remove('modal_active');
        this._events.emit('modal:close');
    }

    get container(): HTMLElement {
        return this._container;
    }
}