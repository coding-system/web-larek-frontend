# Проектная работа "Веб-ларек"

### Стек технолологий:

- HTML
- SCSS
- TS
- Webpack

### Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

### Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных

1. **TPaymentOption**

   - Тип: `'card' | 'cash'`
   - Описание: Варианты оплаты.

2. **TCategoryType**

   - Тип: `'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'`
   - Описание: Категории товаров.

3. **IProduct**

   - Поля: `id: string`, `title: string`, `description: string`, `category: TCategoryType`, `price: number | null`, `image: string`
   - Описание: Товар с сервера.

4. **IOrder**

   - Поля: `items: string[]`, `total: number`, `payment: TPaymentOption`, `address: string`, `phone: string`, `email: string`
   - Описание: Заказ для отправки.

5. **IOrderCompleted**

   - Поля: `id: string`, `total: number`
   - Описание: Ответ API после заказа.

6. **IProductMainPage**

   - Тип: `Pick<IProduct, 'image' | 'title' | 'category' | 'price'>`
   - Описание: Данные для каталога.

7. **IProductPopup**

   - Тип: `Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>`
   - Описание: Данные для модалки товара.

8. **IProductToAdd**

   - Тип: `Pick<IProduct, 'id' | 'title' | 'price'>`
   - Описание: Данные для корзины.

9. **IOrderFormData**

   - Тип: `Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>`
   - Описание: Данные форм.

10. **FormErrors**

- Тип: `Partial<Record<keyof IOrderFormData, string>>`
- Описание: Ошибки валидации форм.

## Архитектура приложения

### Принцип построения

Приложение построено по паттерну **MVP** (Model-View-Presenter):

- **Model** — хранит и обрабатывает данные (включая валидацию).
- **View** — отображает данные без бизнес-логики.
- **Presenter** — связывает слои через события (**EventEmitter**), обеспечивая слабую связь.

### Слои и классы

#### CatalogData

- Назначение: Управление каталогом.
- Методы: `setItems()`, `getItems()`, `getProduct(id)`.
- Событие: `products:loaded`.

#### CartData

- Назначение: Управление корзиной.
- Методы: `addItem()`, `removeItem()`, `getItems()`, `getTotal()`, `clear()`.
- Событие: `cart:changed`.

#### OrderData

- Назначение: Управление заказом и валидацией.
- Методы:
  - `setField(field, value)` — установка и валидация поля.
  - `setItems()` — установка и валидация поля.
  - `getOrder()` — получение данных заказа.
  - `validatePayment()` — валидация оплаты и адреса.
  - `validateContacts()` — валидация контактов.
  - `submit()` — отправка заказа.
  - `clear()` — очистка заказа.

### Слой отображения (View)

- **Page** — главная страница с каталогом и кнопкой корзины.
- **ProductCard** — карточка товара для каталога, модалки и корзины.
- **Modal** — универсальное модальное окно.
- **CartView** — отображение корзины.
- **Form** — базовый класс формы заказа.
- **PaymentForm** — форма оплаты.
- **ContactsForm** — форма контактов.

### Слой коммуникации

#### AppApi

- Назначение: Работа с сервером.
- Методы: `fetchProducts()`, `submitOrder()`.

#### FormValidator

- Назначение: Валидация форм.
- Методы: `validateFields()`, `isPaymentValid()`, `isContactsValid()`.

#### Api (базовый класс)

- Назначение: Обёртка над fetch.
- Методы: `get(endpoint)`, `post(endpoint, data)`.

#### EventEmitter

- Назначение: Обработка событий.
- Методы: `on()`, `emit()`, `trigger()`.

### Presenter

- **index.ts** — связывает Model и View через события.

#### Основные события

- `products:loaded` - загрузка товаров.
- `product:open` - открытие модалки товара.
- `product:add` - добавление товара в корзину.
- `product:remove` - удаление товара из корзины.
- `cart:open` - открытие корзины.
- `cart:changed` - обновление корзины.
- `order:pay-form` - форма оплаты.
- `order:input-changed` - изменение поля.
- `order:submit-payment` - отправка оплаты.
- `order:submit-contacts` - отправка контактов.
- `form:validated` - результат валидации.
- `modal:open` - 
- `modal:close` - 
- `order:success` - успешный заказ.