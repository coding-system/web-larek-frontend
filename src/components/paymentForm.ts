import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

////////////////////////////////////////////////////////////////////
///////////////////// Форма оплаты //////////////////////////////
////////////////////////////////////////////////////////////////////
export class PaymentForm {
    protected _form: HTMLFormElement;
    protected _events: EventEmitter;
    protected _paymentButtons: HTMLButtonElement[];
    protected _submitButton: HTMLButtonElement;

    constructor(form: HTMLFormElement, events: EventEmitter) {
        this._form = form;
        this._events = events;

        // Находим кнопки оплаты
        this._paymentButtons = Array.from(form.querySelectorAll('.button_alt'));
        this._submitButton = ensureElement<HTMLButtonElement>('.order__button', form);

        // Добавляем обработчики для кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => this.onPaymentClick(button));
        });
    }

    // Обработка клика по кнопке оплаты
    private onPaymentClick(button: HTMLButtonElement): void {
        this._paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
    }

    // Геттер для получения формы
    get form(): HTMLFormElement {
        return this._form;
    }
}