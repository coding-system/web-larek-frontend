import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class Modal {
    private _container: HTMLElement;
    private _contentArea: HTMLElement;
    private _closeButton: HTMLButtonElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._container = container;
        this._contentArea = ensureElement('.modal__content', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._events = events;

        // Добавляем обработчики в конструкторе
        this._closeButton.addEventListener('click', () => this.onCloseClick());
        this._container.addEventListener('click', (event) => this.onOverlayClick(event));
    }

    set content(value: HTMLElement) {
        this._contentArea.replaceChildren(value);
    }

    open(): void {
        this._container.classList.add('modal_active');
        this._events.emit('modal:open');
    }

    close(): void {
        this._container.classList.remove('modal_active');
        this._contentArea.innerHTML = '';
        this._events.emit('modal:close');
    }

    render(content: HTMLElement): void {
        this.content = content;
        this.open();
    }

    onCloseClick(): void {
        this.close();
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === this._container) {
            this.close();
        }
    }
}