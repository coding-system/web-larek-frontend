import { IOrder, IOrderFormData, TPaymentOption, FormErrors } from '../types';
import { EventEmitter } from './base/events';
import { AppApi } from './appApi';
import { FormValidator } from './formValidator';

export class OrderData {
	private _order: IOrder = {
		items: [],
		total: 0,
		payment: '' as TPaymentOption,
		address: '',
		phone: '',
		email: '',
	};
	private _events: EventEmitter;
	private _api: AppApi;

	constructor(events: EventEmitter, api: AppApi) {
		this._events = events;
		this._api = api;
	}

	setField(field: keyof IOrderFormData, value: string): void {
		if (field === 'payment') {
			this._order[field] = value as TPaymentOption;
		} else {
			this._order[field] = value;
		}
		this.validateField(field);
	}

	setItems(items: string[]): void {
		this._order.items = items;
	}

	setTotal(total: number): void {
		this._order.total = total;
	}

	getOrder(): IOrder {
		return this._order;
	}

	private validateField(field: keyof IOrderFormData): void {
		let errors: FormErrors;
		let isValid: boolean;

		if (field === 'payment' || field === 'address') {
			errors = this.validatePayment();
			isValid = FormValidator.isPaymentValid(this._order);
			this._events.emit('form:validated', { isValid, errors, form: 'payment' });
		} else {
			errors = this.validateContacts();
			isValid = FormValidator.isContactsValid(this._order);
			this._events.emit('form:validated', {
				isValid,
				errors,
				form: 'contacts',
			});
		}
	}

	validatePayment(): FormErrors {
		return FormValidator.validateFields({
			payment: this._order.payment,
			address: this._order.address,
		});
	}

	validateContacts(): FormErrors {
		return FormValidator.validateFields({
			email: this._order.email,
			phone: this._order.phone,
		});
	}

	async submit(): Promise<void> {
		const response = await this._api.submitOrder(this._order);
		this._events.emit('order:success', response);
		this.clear();
	}

	clear(): void {
		this._order = {
			items: [],
			total: 0,
			payment: '' as TPaymentOption,
			address: '',
			phone: '',
			email: '',
		};
	}
}
