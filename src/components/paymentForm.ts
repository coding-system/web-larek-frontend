import { EventEmitter } from './base/events';
import { Form } from './form';
import { ensureElement } from '../utils/utils';
import { IOrderFormData } from '../types';

////////////////////////////////////////////////////
////////////     Форма типа оплаты и адреса
////////////////////////////////////////////////////
export class PaymentForm extends Form<IOrderFormData> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(form: HTMLFormElement, events: EventEmitter) {
		super(form, events);

		this._paymentButtons = Array.from(form.querySelectorAll('.button_alt'));
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			form
		);

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => this.onPaymentClick(button));
		});
	}

	protected onInputChange(field: keyof IOrderFormData, value: string): void {
		if (field === 'address') {
			this._events.emit('order:input-changed', { address: value });
		}
	}

	protected onPaymentClick(button: HTMLButtonElement): void {
		this._paymentButtons.forEach((btn) =>
			btn.classList.remove('button_alt-active')
		);
		button.classList.add('button_alt-active');
		//   console.log('Тип оплаты:', payment);
		const payment = button.name === 'card' ? 'card' : 'cash';
		this._events.emit('order:input-changed', { payment });
	}

	protected onSubmit(): void {
		this._events.emit('order:submit-payment');
	}
}
