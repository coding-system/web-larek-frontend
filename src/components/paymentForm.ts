import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';
import { FormErrors } from '../types';

////////////////////////////////////////////////////
////////////     Форма типа оплаты и адреса
////////////////////////////////////////////////////
export class PaymentForm {
	protected _form: HTMLFormElement;
	protected _events: EventEmitter;
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(form: HTMLFormElement, events: EventEmitter) {
		this._form = form;
		this._events = events;

		this._paymentButtons = Array.from(form.querySelectorAll('.button_alt'));
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			form
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			form
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', form);

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => this.onPaymentClick(button));
		});
		this._addressInput.addEventListener('input', () => this.onAddressInput());
		this._form.addEventListener('submit', (evt) => this.onSubmit(evt));
	}

	private onPaymentClick(button: HTMLButtonElement): void {
		this._paymentButtons.forEach((btn) =>
			btn.classList.remove('button_alt-active')
		);
		button.classList.add('button_alt-active');
		const payment = button.name === 'card' ? 'card' : 'cash';
		//   console.log('Тип оплаты:', payment);
		this._events.emit('order:input-changed', { payment });
	}

	private onAddressInput(): void {
		const address = this._addressInput.value;
		this._events.emit('order:input-changed', { address });
	}

	setErrors(errors: FormErrors): void {
		this._errors.textContent = Object.values(errors).join(', ') || '';
	}

	setSubmitActive(isActive: boolean): void {
		this._submitButton.disabled = !isActive;
	}

	private onSubmit(evt: Event): void {
		evt.preventDefault();
		this._events.emit('order:submit-payment');
	}

	get form(): HTMLFormElement {
		return this._form;
	}
}
