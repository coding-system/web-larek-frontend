import { IProductMainPage, IProductPopup, IProductToAdd } from '../types';
import { EventEmitter } from './base/events';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

export class ProductCard {
    private _element: HTMLElement;
    private _events: EventEmitter;

    constructor(template: HTMLTemplateElement, events: EventEmitter) {
        this._element = cloneTemplate(template);
        this._events = events;
    }

    render(data: IProductMainPage | IProductPopup | IProductToAdd): HTMLElement {
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

        if ('category' in data && !('description' in data)) {
            this._element.addEventListener('click', () => {
                this._events.emit('product:open', data);
            });
        }

        return this._element;
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