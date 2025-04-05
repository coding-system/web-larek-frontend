import { IProductMainPage, IProductPopup, IProductToAdd } from '../types';
import { EventEmitter } from './base/events';
import { cloneTemplate } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

////////////////////////////////////////////////////////////////////
///////////////////// Карточка товара //////////////////////////////
////////////////////////////////////////////////////////////////////
export class ProductCard {
    private _element: HTMLElement;
    private _events: EventEmitter;

    constructor(template: HTMLElement, events: EventEmitter) {
        this._element = template instanceof HTMLTemplateElement ? cloneTemplate(template) : template.cloneNode(true) as HTMLElement;
        this._events = events;

        this._element.addEventListener('click', (event) => this.onCardClick(event));
    }
    // Рендер карточки товара
    render(data: IProductMainPage | IProductPopup | IProductToAdd): HTMLElement {
        if ('id' in data) {
            this._element.dataset.id = data.id;
        }
        if ('title' in data) {
         this._element.dataset.title = data.title;
            const titleElement = this._element.querySelector('.card__title');
            if (titleElement) titleElement.textContent = data.title;
        }
        if ('price' in data) {
            const priceElement = this._element.querySelector('.card__price');
            if (priceElement) priceElement.textContent = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
        }
        if ('category' in data) {
            const categoryElement = this._element.querySelector('.card__category');
            if (categoryElement) {
                categoryElement.textContent = data.category;
                categoryElement.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
            }
        }
        if ('image' in data) {
            const imageElement = this._element.querySelector('.card__image');
            if (imageElement) imageElement.setAttribute('src', `${CDN_URL}${data.image}`);
        }
        if ('description' in data) {
            const descElement = this._element.querySelector('.card__text');
            if (descElement) descElement.textContent = data.description;
        }

        return this._element;
    }
/////////////////////////////////
////////////// Обработка клика
////////////////////////////////
    onCardClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains('basket__item-delete')) {
         console.log(`Товар "${this._element.dataset.title}" удален`);
            this._events.emit('product:remove', { id: this._element.dataset.id });
        } else if (target.classList.contains('card__button')) {
            console.log(`Товар "${this._element.dataset.title}" добавлен в корзину`);
            this._events.emit('product:add', { id: this._element.dataset.id });
        } else {
            this._events.emit('product:open', { id: this._element.dataset.id });
        }
    }
    // Классы для категорий
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