import { IProduct } from '../types';
import { EventEmitter } from './base/events';

export class CatalogData {
    protected _items: IProduct[] = [];
    protected _events: EventEmitter;

    constructor(events: EventEmitter) {
        this._events = events;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
        this._events.emit('products:loaded');
      //   console.log(this._items);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getProduct(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }
}