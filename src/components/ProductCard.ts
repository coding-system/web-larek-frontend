import { IProductMainPage, IProductPopup, IProductToAdd } from '../types';
import { EventEmitter } from './base/events';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

export class ProductCard {
    private _element: HTMLElement;
    private _events: EventEmitter;

    constructor(template: HTMLElement, events: EventEmitter) {
        this._element = template instanceof HTMLTemplateElement ? cloneTemplate(template) : template.cloneNode(true) as HTMLElement;
        this._events = events;

        // Добавляем обработчик клика по карточке
        this._element.addEventListener('click', (event) => this.onCardClick(event));
    }

    render(data: IProductMainPage | IProductPopup | IProductToAdd): HTMLElement {
        if ('id' in data) {
            this._element.dataset.id = data.id; // Добавляем ID в dataset
        }
        if ('title' in data) {
            ensureElement('.card__title', this._element).textContent = data.title;
        }
        if ('price' in data) {
            ensureElement('.card__price', this._element).textContent = 
                data.price === null ? 'Бесценно' : `${data.price} синапсов`;
        }
        if ('category' in data) {
            const categoryElement = ensureElement('.card__category', this._element);
            categoryElement.textContent = data.category;
            categoryElement.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
        }
        if ('image' in data) {
            ensureElement('.card__image', this._element).setAttribute('src', `${CDN_URL}${data.image}`);
        }
        if ('description' in data) {
            const descElement = this._element.querySelector('.card__text');
            if (descElement) descElement.textContent = data.description;
        }

        return this._element;
    }

    onCardClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains('card__button')) {
            this._events.emit('product:add', { id: this._element.dataset.id });
        } else {
            this._events.emit('product:open', { id: this._element.dataset.id });
        }
    }

    private getCategoryClass(category: string): string {
        switch (category) {
            case 'софт-скил': return 'soft';
            case 'хард-скил': return 'hard';
            case 'дополнительное': return 'additional';
            case 'кнопка': return 'button';
            case 'другое': return 'other';
            default: return '';
        }
    }
}