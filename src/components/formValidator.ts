import { IOrderFormData, FormErrors } from '../types';

export class FormValidator {
    static validateFields(data: Partial<IOrderFormData>): FormErrors {
        const errors: FormErrors = {};

        if ('payment' in data && !data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if ('address' in data && !data.address?.trim()) {
            errors.address = 'Введите адрес';
        }
        if ('email' in data && data.email && !data.email.match(/^\S+@\S+\.\S+$/)) {
            errors.email = 'Введите корректный email';
        }
        if ('phone' in data && data.phone && !data.phone.match(/^\+?\d{10,15}$/)) {
            errors.phone = 'Введите корректный телефон';
        }

        return errors;
    }

    static isPaymentValid(data: Partial<IOrderFormData>): boolean {
        const errors = this.validateFields({ payment: data.payment, address: data.address });
        return Object.keys(errors).length === 0;
    }

    static isContactsValid(data: Partial<IOrderFormData>): boolean {
        const errors = this.validateFields({ email: data.email, phone: data.phone });
        return Object.keys(errors).length === 0;
    }
}