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

Файл: `src/types/index.ts`

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
     - `price: number | null` — цена (null, если не указана).
     - `image: string` — URL изображения.
   - Описание: Данные товара с сервера.

4. **`IOrder`**

   - Поля:
     - `items: string[]` — массив ID товаров.
     - `total: number` — общая сумма.
     - `payment: TPaymentOption` — способ оплаты.
     - `address: string` — адрес доставки.
     - `phone: string` — телефон.
     - `email: string` — email.
   - Описание: Данные заказа.

5. **`ICart`**

   - Поля:
     - `items: IProduct[]` — товары в корзине.
   - Описание: Хранит товары, добавленные пользователем.

6. **`ICatalog`**

   - Поля:
     - `items: IProduct[]` — товары в каталоге.
   - Описание: Хранит полный список товаров.

7. **`IOrderCompleted`**

   - Поля:
     - `id: string` — ID заказа.
     - `total: number` — итоговая сумма.
   - Описание: Ответ сервера после оформления заказа.

8. **`IProductPreview`**

   - Тип: `Pick<IProduct, 'image' | 'title' | 'category' | 'price'>`
   - Описание: Данные для отображения карточки на главной странице.

9. **`IProductToAdd`**

   - Тип: `Pick<IProduct, 'id' | 'title' | 'price'>`
   - Описание: Данные для добавления товара в корзину.

10. **`IOrderFormData`**
    - Тип: `Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>`
    - Описание: Данные, вводимые в формы заказа.


## Архитектура приложения

Приложение построено по паттерну MVP:

- **Model** — слой данных, отвечает за хранение и обработку товаров, корзины и заказа.
- **View** — слой представления, отображает данные на странице (каталог, модальные окна, корзина).
- **Presenter** — связывает модель и представление через брокер событий (`EventEmitter`).

### Базовые классы

1. **Api**

   - Отвечает за отправку запросов к серверу.
   - Методы:
     - `get(endpoint: string): Promise<any>` — получение данных (например, списка товаров).
     - `post(endpoint: string, data: object): Promise<any>` — отправка данных (например, заказа).

2. **EventEmitter**
   - Брокер событий для взаимодействия между слоями.
   - Методы:
     - `on(event: string, callback: (data: any) => void)` — подписка на событие.
     - `emit(event: string, data?: any)` — вызов события.
     - `trigger(event: string)` — создание функции-триггера для события.

### Слой данных

#### Класс `CatalogData`

- Отвечает за работу с каталогом товаров.
- Поля:
  - `_items: IProduct[]` — массив товаров, полученных с сервера.
  - `_events: EventEmitter` — экземпляр брокера событий.
- Методы:
  - `setItems(items: IProduct[]): void` — устанавливает товары в каталог.
  - `getItems(): IProduct[]` — возвращает массив товаров.
  - `getProduct(id: string): IProduct | undefined` — возвращает товар по ID.

#### Класс `CartData`

- Отвечает за управление корзиной.
- Поля:
  - `_items: IProduct[]` — массив товаров в корзине.
  - `_events: EventEmitter` — экземпляр брокера событий.
- Методы:
  - `addItem(product: IProduct): void` — добавляет товар в корзину.
  - `removeItem(productId: string): void` — удаляет товар из корзины.
  - `getItems(): IProduct[]` — возвращает товары в корзине.
  - `getTotal(): number` — подсчитывает общую сумму товаров.
  - `clear(): void` — очищает корзину.

#### Класс `OrderData`

- Отвечает за работу с заказом.
- Поля:
  - `_order: IOrder` — объект заказа.
  - `_events: EventEmitter` — экземпляр брокера событий.
- Методы:
  - `setField(field: keyof IOrderFormData, value: string): void` — устанавливает значение поля формы.
  - `getOrder(): IOrder` — возвращает текущий заказ.
  - `validatePayment(): Record<keyof Pick<IOrder, 'payment' | 'address'>, string>` — валидация формы оплаты и адреса (шаг 1).
  - `validateContacts(): Record<keyof Pick<IOrder, 'email' | 'phone'>, string>` — валидация формы телефона и email (шаг 2).
  - `submit(): Promise<IOrderCompleted>` — отправляет заказ на сервер после нажатия "Оплатить".
  - `clear(): void` — очищает заказ после успешной отправки.

### Слой представления

#### Класс `Page`

- Отвечает за главную страницу.
- Поля:
  - `_catalog: HTMLElement` — контейнер для карточек товаров.
  - `_cartCounter: HTMLElement` — счётчик товаров в корзине.
- Методы:
  - `renderCatalog(products: IProductPreview[]): void` — отображает каталог.
  - `updateCartCounter(count: number): void` — обновляет счётчик корзины.

#### Класс `ProductCard`

- Отвечает за отображение карточки товара.
- Поля:
  - `_element: HTMLElement` — DOM-элемент карточки.
- Методы:
  - `render(data: IProductPreview | IProduct): HTMLElement` — заполняет карточку данными и возвращает элемент.

#### Класс `Modal`

- Универсальный класс для модальных окон.
- Поля:
  - `_modal: HTMLElement` — элемент модального окна.
  - `_events: EventEmitter` — брокер событий.
- Методы:
  - `open(content: HTMLElement): void` — открывает модалку с переданным контентом.
  - `close(): void` — закрывает модалку (по клику на оверлей или крестик).

#### Класс `CartView`

- Отвечает за отображение корзины.
- Поля:
  - `_items: HTMLElement` — контейнер для товаров.
  - `_total: HTMLElement` — элемент с общей суммой.
- Методы:
  - `render(items: IProductToAdd[], total: number): void` — отображает корзину.

#### Класс `OrderForm`

- Отвечает за формы заказа (2 шага).
- Поля:
  - `_form: HTMLFormElement` — элемент формы.
  - `_submitButton: HTMLButtonElement` — кнопка "Далее" (шаг 1) или "Оплатить" (шаг 2).
  - `_errors: Record<string, HTMLElement>` — элементы для отображения ошибок.
- Методы:
  - `setFieldValue(field: string, value: string): void` — заполняет поле формы.
  - `getFormData(): IOrderFormData` — возвращает данные формы.
  - `setErrors(errors: Record<string, string>): void` — отображает ошибки.
  - `setSubmitActive(isActive: boolean): void` — активирует/деактивирует кнопку "Далее" или "Оплатить".

### Слой коммуникации

#### Класс `AppApi`

- Обёртка над базовым `Api` для работы с сервером.
- Методы:
  - `fetchProducts(): Promise<IProduct[]>` — получает список товаров.
  - `submitOrder(order: IOrder): Promise<IOrderCompleted>` — отправляет заказ.

#### Взаимодействие компонентов

- Логика взаимодействия описана в `index.ts` (презентер).
- Используется `EventEmitter` для генерации и обработки событий.
- Пример:
  - Пользователь кликает "Купить" → событие `product:add` → `CartData` добавляет товар → событие `cart:updated` → `CartView` обновляет UI.

### События

- `products:loaded` — товары загружены с сервера.
- `product:open` — открытие модалки с товаром.
- `product:add` — добавление товара в корзину.
- `product:remove` — удаление товара из корзины.
- `cart:open` — открытие корзины.
- `cart:updated` — обновление корзины.
- `order:pay-form` — открытие формы выбора оплаты и адреса (шаг 1, кнопка "Далее").
- `order:contact-form` — открытие формы ввода телефона и email (шаг 2, кнопка "Оплатить").
- `order:submit` — отправка заказа после нажатия "Оплатить".
- `order:success` — успешное оформление.
- `form:errors` — отображение ошибок формы.
- `modal:open` — открытие модального окна.
- `modal:close` — закрытие модального окна.