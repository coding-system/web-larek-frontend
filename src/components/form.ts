import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';
import { FormErrors } from '../types';

export abstract class Form<T> {
	protected _container: HTMLFormElement;
	protected _events: EventEmitter;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		this._container = container;
		this._events = events;

		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		this._container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this._container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.onSubmit();
		});
	}

	protected abstract onInputChange(field: keyof T, value: string): void;
	protected abstract onSubmit(): void;

	setErrors(errors: FormErrors): void {
		this._errors.textContent = Object.values(errors).join(', ') || '';
	}

	setSubmitActive(isActive: boolean): void {
		this._submitButton.disabled = !isActive;
	}

	get form(): HTMLFormElement {
		return this._container;
	}
}
