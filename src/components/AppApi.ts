import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, IOrderCompleted } from '../types';

export class AppApi {
    private _api: Api;

    constructor(api: Api) {
        this._api = api;
    }

    fetchProducts(): Promise<IProduct[]> {
        return this._api.get('/product')
            .then((data: ApiListResponse<IProduct>) => data.items);
    }

    submitOrder(order: IOrder): Promise<IOrderCompleted> {
        return this._api.post('/order', order) as Promise<IOrderCompleted>;
    }
}