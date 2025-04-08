import { EventEmitter } from './base/events';
import { Form } from './form';
import { ensureElement } from '../utils/utils';
import { IOrderFormData } from '../types';

export class ContactsForm extends Form<IOrderFormData> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(form: HTMLFormElement, events: EventEmitter) {
		super(form, events);

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			form
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			form
		);
	}

	protected onInputChange(field: keyof IOrderFormData, value: string): void {
		if (field === 'email') {
			this._events.emit('order:input-changed', { email: value });
		} else if (field === 'phone') {
			const digitsOnly = value.replace(/\D/g, '');
			const coreDigits = digitsOnly
				.replace(/^8/, '')
				.replace(/^7/, '')
				.slice(0, 10);

			if (digitsOnly === '8') {
				this._phoneInput.value = '+7';
				this._events.emit('order:input-changed', { phone: '' });
				return;
			}

			if (coreDigits.length === 0) {
				this._phoneInput.value = '';
				this._events.emit('order:input-changed', { phone: '' });
				return;
			}

			const formatted = [
				'+7',
				coreDigits.length > 0 ? ' (' + coreDigits.slice(0, 3) : '',
				coreDigits.length >= 4 ? ') ' + coreDigits.slice(3, 6) : '',
				coreDigits.length >= 7 ? '-' + coreDigits.slice(6, 8) : '',
				coreDigits.length >= 9 ? '-' + coreDigits.slice(8, 10) : '',
			].join('');

			this._phoneInput.value = formatted;
			this._events.emit('order:input-changed', { phone: coreDigits });
		}
	}

	protected onSubmit(): void {
		this._events.emit('order:submit-contacts');
	}
}
