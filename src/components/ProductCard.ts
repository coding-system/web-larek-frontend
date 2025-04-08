import { IProductMainPage, IProductPopup, IProductToAdd } from '../types';
import { EventEmitter } from './base/events';
import { cloneTemplate } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

export class ProductCard {
    private _element: HTMLElement;
    private _events: EventEmitter;
    private _data: IProductMainPage | IProductPopup | IProductToAdd;

    constructor(
        template: HTMLElement,
        events: EventEmitter,
        context: 'catalog' | 'basket' | 'popup' = 'catalog'
    ) {
        this._element =
            template instanceof HTMLTemplateElement
                ? cloneTemplate(template)
                : (template.cloneNode(true) as HTMLElement);
        this._events = events;
        this._data = {} as IProductMainPage | IProductPopup | IProductToAdd;

        // Обработчики в зависимости от контекста
        if (context === 'catalog') {
            this._element.addEventListener('click', this.onCatalogClick.bind(this));
        } else if (context === 'basket') {
            const deleteButton = this._element.querySelector('.basket__item-delete');
            if (deleteButton) {
                deleteButton.addEventListener('click', this.onDeleteClick.bind(this));
            }
            // Клик по карточке в корзине не обрабатываем
        } else if (context === 'popup') {
            const addButton = this._element.querySelector('.card__button');
            if (addButton) {
                addButton.addEventListener('click', () => {
                    this._events.emit('product:add', { id: this._element.dataset.id });
                });
            }
        }
    }

    // Обработчик клика по карточке в каталоге
    private onCatalogClick(): void {
      //   console.log(`Товар "${this._data.title}" открыт`);
        this._events.emit('product:open', { id: this._element.dataset.id });
    }

    // Обработчик клика по кнопке удаления в корзине
    private onDeleteClick(): void {
      //   console.log(`Товар "${this._data.title}" удалён`);
        this._events.emit('product:remove', { id: this._element.dataset.id });
    }

    // Рендер карточки товара
    render(data: IProductMainPage | IProductPopup | IProductToAdd): HTMLElement {
        this._data = data;

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
            if (priceElement)
                priceElement.textContent =
                    data.price === null ? 'Бесценно' : `${data.price} синапсов`;
        }
        if ('category' in data) {
            const categoryElement = this._element.querySelector('.card__category');
            if (categoryElement) {
                categoryElement.textContent = data.category;
                categoryElement.className = `card__category card__category_${this.getCategoryClass(
                    data.category
                )}`;
            }
        }
        if ('image' in data) {
            const imageElement = this._element.querySelector('.card__image') as HTMLImageElement;
            if (imageElement) imageElement.src = `${CDN_URL}${data.image}`;
        }
        if ('description' in data) {
            const descElement = this._element.querySelector('.card__text');
            if (descElement) descElement.textContent = data.description;
        }

        return this._element;
    }

    // Классы для категорий
    private getCategoryClass(category: string): string {
        switch (category) {
            case 'софт-скил':
                return 'soft';
            case 'хард-скил':
                return 'hard';
            case 'дополнительное':
                return 'additional';
            case 'кнопка':
                return 'button';
            case 'другое':
                return 'other';
            default:
                return '';
        }
    }
}