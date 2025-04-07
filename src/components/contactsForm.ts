import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';
import { FormErrors } from '../types';

export class ContactsForm {
	protected _form: HTMLFormElement;
	protected _events: EventEmitter;
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(form: HTMLFormElement, events: EventEmitter) {
		this._form = form;
		this._events = events;

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			form
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			form
		);
		this._submitButton = ensureElement<HTMLButtonElement>('.button', form);
		this._errors = ensureElement<HTMLElement>('.form__errors', form);

		this._emailInput.addEventListener('input', () => this.onEmailInput());
		this._phoneInput.addEventListener('input', () => this.onPhoneInput());
		this._form.addEventListener('submit', (evt) => this.onSubmit(evt));
	}

	private onEmailInput(): void {
		const email = this._emailInput.value;
		this._events.emit('order:input-changed', { email });
	}

	private onPhoneInput(): void {
		const inputValue = this._phoneInput.value;
		const digitsOnly = inputValue.replace(/\D/g, '');

		// Убираем 8 или 7 из начала
		const coreDigits = digitsOnly
			.replace(/^8/, '')
			.replace(/^7/, '')
			.slice(0, 10);

		// Обработка "ввёл только 8" -> отображаем просто "+7"
		if (digitsOnly === '8') {
			this._phoneInput.value = '+7';
			this._events.emit('order:input-changed', { phone: '' });
			return;
		}

		// Если вообще ничего не ввёл (кроме +7)
		if (coreDigits.length === 0) {
			this._phoneInput.value = '';
			this._events.emit('order:input-changed', { phone: '' });
			return;
		}

		// Форматирование как раньше
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

	setErrors(errors: FormErrors): void {
		this._errors.textContent = Object.values(errors).join(', ') || '';
	}

	setSubmitActive(isActive: boolean): void {
		this._submitButton.disabled = !isActive;
	}

	private onSubmit(evt: Event): void {
		evt.preventDefault();
		this._events.emit('order:submit-contacts');
	}

	get form(): HTMLFormElement {
		return this._form;
	}
}
