import { IProduct } from '../types';
import { EventEmitter } from './base/events';

export class CartData {
    private _items: IProduct[] = [];
    private _events: EventEmitter;

    constructor(events: EventEmitter) {
        this._events = events;
    }

    addItem(item: IProduct): void {
        if (!this._items.some(existing => existing.id === item.id)) { // Проверка на дубли
            this._items.push(item);
            this._events.emit('cart:changed', this._items);
        }
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this._events.emit('cart:changed', this._items);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    clear(): void {
        this._items = [];
        this._events.emit('cart:changed', this._items);
    }
}