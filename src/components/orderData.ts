import { IOrder, IOrderFormData, TPaymentOption } from '../types';
import { EventEmitter } from './base/events';
import { AppApi } from './appApi';

////////////////////////////////////////////////////////////////////
///////////////////// Данные заказа //////////////////////////////
////////////////////////////////////////////////////////////////////
export class OrderData {
    private _order: IOrder = { 
        items: [], 
        total: 0, 
        payment: 'card' as TPaymentOption, 
        address: '', 
        phone: '', 
        email: '' 
    };
    private _events: EventEmitter;
    private _api: AppApi;

    constructor(events: EventEmitter, api: AppApi) {
        this._events = events;
        this._api = api;
    }

    // Установить поле формы
    setField(field: keyof IOrderFormData, value: string): void {
        if (field === 'payment') {
            this._order[field] = value as TPaymentOption; // Приводим к TPaymentOption
        } else {
            this._order[field] = value; // Для остальных полей оставляем как string
        }
        this.validateField(field);
    }

    // Установить товары
    setItems(items: string[]): void {
        this._order.items = items;
    }

    // Установить сумму
    setTotal(total: number): void {
        this._order.total = total;
    }

    // Получить заказ
    getOrder(): IOrder {
        return this._order;
    }

    // Валидация одного поля
    private validateField(field: keyof IOrderFormData): void {
        const errors: Record<string, string> = {};
        if (field === 'payment' && !this._order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (field === 'address' && !this._order.address.trim()) {
            errors.address = 'Введите адрес';
        }
        if (field === 'email' && !this._order.email.match(/^\S+@\S+\.\S+$/)) {
            errors.email = 'Введите корректный email';
        }
        if (field === 'phone' && !this._order.phone.match(/^\+?\d{10,15}$/)) {
            errors.phone = 'Введите корректный телефон';
        }

        const isValid = Object.keys(errors).length === 0;
        this._events.emit('form:validated', { isValid, errors });
    }

    // Валидация оплаты и адреса
    validatePayment(): Record<keyof Pick<IOrder, 'payment' | 'address'>, string> {
        const errors: Record<string, string> = {};
        if (!this._order.payment) errors.payment = 'Выберите способ оплаты';
        if (!this._order.address.trim()) errors.address = 'Введите адрес';
        return errors;
    }

    // Валидация контактов
    validateContacts(): Record<keyof Pick<IOrder, 'email' | 'phone'>, string> {
        const errors: Record<string, string> = {};
        if (!this._order.email.match(/^\S+@\S+\.\S+$/)) errors.email = 'Введите корректный email';
        if (!this._order.phone.match(/^\+?\d{10,15}$/)) errors.phone = 'Введите корректный телефон';
        return errors;
    }

    // Отправка заказа
    async submit(): Promise<void> {
        const response = await this._api.submitOrder(this._order);
        this._events.emit('order:success', response);
        this.clear();
    }

    // Очистка заказа
    clear(): void {
        this._order = { 
            items: [], 
            total: 0, 
            payment: 'card' as TPaymentOption, 
            address: '', 
            phone: '', 
            email: '' 
        };
    }
}