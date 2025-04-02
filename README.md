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


## Архитектура приложения
Приложение построено по паттерну MVP:
- **Model** — слой данных, хранит и обрабатывает товары, корзину и заказ.
- **View** — слой представления, отображает данные на странице.
- **Presenter** — связывает модель и представление через брокер событий (`EventEmitter`).

### Базовые классы
1. **Api**
   - Отвечает за отправку запросов к серверу.
   - Методы:
     - `get(endpoint: string): Promise<any>` — получение данных (например, товаров).
     - `post(endpoint: string, data: object): Promise<any>` — отправка данных (например, заказа).

2. **EventEmitter**
   - Брокер событий для взаимодействия между слоями.
   - Методы:
     - `on(event: string, callback: (data: any) => void)` — подписка на событие.
     - `emit(event: string, data?: any)` — вызов события.
     - `trigger(event: string)` — создание функции-триггера.

### Слой данных
#### Класс `CatalogData`
- Хранит и управляет каталогом товаров.
- Поля:
  - `_items: IProduct[]` — массив товаров.
  - `_events: EventEmitter` — брокер событий.
- Методы:
  - `setItems(items: IProduct[]): void` — устанавливает товары.
  - `getItems(): IProduct[]` — возвращает товары.
  - `getProduct(id: string): IProduct | undefined` — возвращает товар по ID.

#### Класс `CartData`
- Управляет корзиной.
- Поля:
  - `_items: IProduct[]` — товары в корзине.
  - `_events: EventEmitter` — брокер событий.
- Методы:
  - `addItem(product: IProduct): void` — добавляет товар.
  - `removeItem(productId: string): void` — удаляет товар.
  - `getItems(): IProduct[]` — возвращает товары.
  - `getTotal(): number` — подсчитывает сумму.
  - `clear(): void` — очищает корзину.

#### Класс `OrderData`
- Управляет заказом.
- Поля:
  - `_order: IOrder` — объект заказа.
  - `_events: EventEmitter` — брокер событий.
- Методы:
  - `setField(field: keyof IOrderFormData, value: string): void` — устанавливает значение поля.
  - `getOrder(): IOrder` — возвращает заказ.
  - `validatePayment(): Record<keyof Pick<IOrder, 'payment' | 'address'>, string>` — валидация оплаты и адреса.
  - `validateContacts(): Record<keyof Pick<IOrder, 'email' | 'phone'>, string>` — валидация телефона и email.
  - `submit(): Promise<IOrderCompleted>` — отправляет заказ.
  - `clear(): void` — очищает заказ.

### Слой представления
#### Класс `Page`
- Главная страница.
- Поля:
  - `_catalog: HTMLElement` — контейнер каталога.
  - `_cartCounter: HTMLElement` — счётчик корзины.
- Методы:
  - `renderCatalog(products: IProductPreview[]): void` — отображает каталог.
  - `updateCartCounter(count: number): void` — обновляет счётчик.

#### Класс `ProductCard`
- Карточка товара.
- Поля:
  - `_element: HTMLElement` — DOM-элемент карточки.
- Методы:
  - `render(data: IProductPreview | IProduct): HTMLElement` — отображает карточку.

#### Класс `Modal`
- Модальное окно.
- Поля:
  - `_modal: HTMLElement` — элемент модалки.
  - `_events: EventEmitter` — брокер событий.
- Методы:
  - `open(content: HTMLElement): void` — открывает модалку.
  - `close(): void` — закрывает модалку.

#### Класс `CartView`
- Отображение корзины.
- Поля:
  - `_items: HTMLElement` — контейнер товаров.
  - `_total: HTMLElement` — сумма.
- Методы:
  - `render(items: IProductToAdd[], total: number): void` — отображает корзину.

#### Класс `OrderForm`
- Формы заказа.
- Поля:
  - `_form: HTMLFormElement` — элемент формы.
  - `_submitButton: HTMLButtonElement` — кнопка "Далее" или "Оплатить".
  - `_errors: Record<string, HTMLElement>` — ошибки.
- Методы:
  - `setFieldValue(field: string, value: string): void` — заполняет поле.
  - `getFormData(): IOrderFormData` — возвращает данные.
  - `setErrors(errors: Record<string, string>): void` — показывает ошибки.
  - `setSubmitActive(isActive: boolean): void` — управляет кнопкой.

### Слой коммуникации
#### Класс `AppApi`
- Работа с сервером.
- Методы:
  - `fetchProducts(): Promise<IProduct[]>` — получает товары.
  - `submitOrder(order: IOrder): Promise<IOrderCompleted>` — отправляет заказ.

#### Взаимодействие компонентов
- Описано в `index.ts` (презентер).
- Используется `EventEmitter` для событий.

## Шаг 2. Реализовать типы данных
Файл: `src/types/index.ts`

### Типы данных
1. **`TPaymentOption`**
   - Тип: `'card' | 'cash'`
   - Описание: Варианты оплаты.

2. **`TCategoryType`**
   - Тип: `'софт-скилл' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'`
   - Описание: Категории товаров.

3. **`IProduct`**
   - Поля:
     - `id: string` — уникальный ID.
     - `title: string` — название.
     - `description: string` — описание.
     - `category: TCategoryType` — категория.
     - `price: number | null` — цена.
     - `image: string` — URL изображения.
   - Описание: Товар с сервера.

4. **`IOrder`**
   - Поля:
     - `items: string[]` — ID товаров.
     - `total: number` — сумма.
     - `payment: TPaymentOption` — способ оплаты.
     - `address: string` — адрес.
     - `phone: string` — телефон.
     - `email: string` — email.
   - Описание: Заказ для отправки на сервер.

5. **`IOrderCompleted`**
   - Поля:
     - `id: string` — ID заказа.
     - `total: number` — итоговая сумма.
   - Описание: Ответ от API.

6. **`IProductPreview`**
   - Тип: `Pick<IProduct, 'image' | 'title' | 'category' | 'price'>`
   - Описание: Данные для карточки на главной.

7. **`IProductToAdd`**
   - Тип: `Pick<IProduct, 'id' | 'title' | 'price'>`
   - Описание: Данные для корзины.

8. **`IOrderFormData`**
   - Тип: `Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>`
   - Описание: Данные форм заказа.

### Перечисление событий
```typescript
export enum AppEvents {
  PRODUCTS_LOADED = 'products:loaded',
  PRODUCT_OPEN = 'product:open',
  PRODUCT_ADD = 'product:add',
  PRODUCT_REMOVE = 'product:remove',
  CART_OPEN = 'cart:open',
  CART_UPDATED = 'cart:updated',
  ORDER_PAY_FORM = 'order:pay-form',
  ORDER_CONTACT_FORM = 'order:contact-form',
  ORDER_SUBMIT = 'order:submit',
  ORDER_SUCCESS = 'order:success',
  FORM_ERRORS = 'form:errors',
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close',
}