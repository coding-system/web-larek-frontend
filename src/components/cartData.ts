import { IProduct } from '../types';
import { EventEmitter } from './base/events';

////////////////////////////////////////////////////////////////////
///////////////////// Данные корзины ///////////////////////////////
////////////////////////////////////////////////////////////////////
export class CartData {
	private _items: IProduct[] = [];
	private _events: EventEmitter;

	constructor(events: EventEmitter) {
		this._events = events;
	}

	// Добавить товар
	addItem(item: IProduct): void {
      // Проветка на дублиукаты
		const exists = this._items.find((product) => product.id === item.id);
		if (!exists) {
			this._items.push(item);
			this._events.emit('cart:changed', this._items);
		}
	}
	// Удалить товар
	removeItem(id: string): void {
		this._items = this._items.filter((item) => item.id !== id);
		this._events.emit('cart:changed', this._items);
	}
	// Получаем массив товаров
	getItems(): IProduct[] {
		return this._items;
	}
	// Итоговая сумма
	getTotal(): number {
		return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
	}
	// Ощистить корзину
	clear(): void {
		this._items = [];
		this._events.emit('cart:changed', this._items);
	}
}
