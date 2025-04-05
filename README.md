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

### Типы данных

1. **`TPaymentOption`**

   - Тип: `'card' | 'cash'`
   - Описание: Варианты оплаты.

2. **`TCategoryType`**

   - Тип: `'софт-скилл' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'`
   - Описание: Категории товаров.

3. **`IProduct`**

   - Поля:
     - `id: string` — ID.
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
     - `payment: TPaymentOption` — оплата.
     - `address: string` — адрес.
     - `phone: string` — телефон.
     - `email: string` — email.
   - Описание: Заказ для отправки.

5. **`IOrderCompleted`**

   - Поля:
     - `id: string` — ID заказа.
     - `total: number` — сумма.
   - Описание: Ответ от API.

6. **`IProductMainPage`**

   - Тип: `Pick<IProduct, 'image' | 'title' | 'category' | 'price'>`
   - Описание: Данные для галереи.

7. **`IProductPopup`**

   - Тип: `Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>`
   - Описание: Данные для модалки товара.

8. **`IProductToAdd`**

   - Тип: `Pick<IProduct, 'id' | 'title' | 'price'>`
   - Описание: Данные для корзины.

9. **`IOrderFormData`**
   - Тип: `Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>`
   - Описание: Данные форм заказа.

## Архитектура приложения

### Принцип построения

Приложение построено по паттерну **MVP** (Model-View-Presenter):

- **Model** — слой данных, отвечает за хранение и обработку информации (включая валидацию).
- **View** — слой отображения, отвечает только за визуализацию данных, без логики валидации.
- **Presenter** — связывает Model и View через события, управляемые классом `EventEmitter`.  
  Компоненты не взаимодействуют напрямую, что обеспечивает их переиспользуемость.

### Слои и классы

#### Слой данных (Model)

1. **`CatalogData`**

   - **Назначение**: Хранит и управляет каталогом товаров.
   - **Конструктор**: `constructor(events: EventEmitter)`
   - **Поля**:
     - `_items: IProduct[]` — массив товаров.
     - `_events: EventEmitter` — брокер событий.
   - **Методы**:
     - `setItems(items: IProduct[]): void` — устанавливает товары.
     - `getItems(): IProduct[]` — возвращает товары.
     - `getProduct(id: string): IProduct | undefined` — возвращает товар по ID.

2. **`CartData`**

   - **Назначение**: Управляет корзиной покупок.
   - **Конструктор**: `constructor(events: EventEmitter)`
   - **Поля**:
     - `_items: IProduct[]` — товары в корзине.
     - `_events: EventEmitter` — брокер событий.
   - **Методы**:
     - `addItem(product: IProduct): void` — добавляет товар.
     - `removeItem(productId: string): void` — удаляет товар.
     - `getItems(): IProduct[]` — возвращает товары.
     - `getTotal(): number` — подсчитывает сумму.
     - `clear(): void` — очищает корзину.

3. **`OrderData`**
   - **Назначение**: Управляет данными заказа и их валидацией.
   - **Конструктор**: `constructor(events: EventEmitter, api: AppApi)`
   - **Поля**:
     - `_order: IOrder` — объект заказа.
     - `_events: EventEmitter` — брокер событий.
   - **Методы**:
     - `setField(field: keyof IOrderFormData, value: string): void` — устанавливает поле и запускает валидацию.
     - `getOrder(): IOrder` — возвращает заказ.
     - `validatePayment(): Record<keyof Pick<IOrder, 'payment' | 'address'>, string>` — валидация оплаты и адреса.
     - `validateContacts(): Record<keyof Pick<IOrder, 'email' | 'phone'>, string>` — валидация контактов.
     - `submit(): Promise<IOrderCompleted>` — отправляет заказ.
     - `clear(): void` — очищает заказ.

#### Слой отображения (View)

1. **`Page`**

   - **Назначение**: Главная страница с каталогом и счётчиком корзины.
   - **Конструктор**: `constructor(container: HTMLElement, events: EventEmitter)`
   - **Поля**:
     - `_catalog: HTMLElement` — контейнер каталога.
     - `_cartCounter: HTMLElement` — счётчик корзины.
     - `_cartButton: HTMLButtonElement` — кнопка корзины.
     - `_events: EventEmitter` — брокер событий.
   - **Методы**:
     - `renderCatalog(products: HTMLElement[]): void` — отображает каталог.
     - `updateCartCounter(count: number): void` — обновляет счётчик.
     - `onCartClick(): void` — вызывает `cart:open`.
   - **Примечание**: В конструкторе добавляется обработчик `click` на `_cartButton`.

2. **`ProductCard`**

   - **Назначение**: Карточка товара для трёх шаблонов (галерея, модалка, корзина).
   - **Конструктор**: `constructor(template: HTMLElement, events: EventEmitter, clickHandler?: (event: MouseEvent) => void)`
   - **Поля**:
     - `_element: HTMLElement` — DOM-элемент карточки.
     - `_events: EventEmitter` — брокер событий.
     - `_data: IProductMainPage | IProductPopup | IProductToAdd` — данные товара.
   - **Методы**:
     - `render(data: IProductMainPage | IProductPopup | IProductToAdd): HTMLElement` — отображает карточку.
     - `onCardClick(event: MouseEvent): void` — обработчик клика в зависимости от шаблона:
       - Для каталога: вызывает `product:open`.
       - Для модалки: вызывает `product:add`.
       - Для корзины: вызывает `product:remove`.
   - **Примечание**: Обработчик `click` добавляется в конструкторе на `_element`. Можно передать кастомный `clickHandler` для гибкости.

3. **`Modal`**

   - **Назначение**: Универсальное модальное окно.
   - **Конструктор**: `constructor(container: HTMLElement, events: EventEmitter)`
   - **Поля**:
     - `_container: HTMLElement` — контейнер модалки.
     - `_content: HTMLElement` — область контента.
     - `_closeButton: HTMLButtonElement` — кнопка закрытия.
     - `_events: EventEmitter` — брокер событий.
   - **Методы**:
     - `render(content: HTMLElement): void` — рендерит контент и открывает модалку.
     - `open(): void` — открывает модалку.
     - `close(): void` — закрывает модалку.
   - **Примечание**: В конструкторе добавляются обработчики `click` на `_closeButton` и `_container`.

4. **`CartView`**

   - **Назначение**: Отображение корзины в модалке.
   - **Конструктор**: `constructor(container: HTMLElement, events: EventEmitter)`
   - **Поля**:
     - `_container: HTMLElement` — контейнер корзины.
     - `_items: HTMLElement` — список товаров.
     - `_total: HTMLElement` — сумма.
     - `_checkoutButton: HTMLButtonElement` — кнопка "Оформить".
     - `_events: EventEmitter` — брокер событий.
   - **Методы**:
     - `render(items: IProductToAdd[], total: number): void` — отображает корзину.
     - `onCheckoutClick(): void` — вызывает `order:pay-form`.
   - **Примечание**: В конструкторе добавляется обработчик `click` на `_checkoutButton`.

5. **`OrderForm` (абстрактный)**

   - **Назначение**: Базовый класс для форм заказа.
   - **Конструктор**: `constructor(form: HTMLFormElement, events: EventEmitter)`
   - **Поля**:
     - `_form: HTMLFormElement` — элемент формы.
     - `_submitButton: HTMLButtonElement` — кнопка отправки.
     - `_errors: HTMLElement` — контейнер ошибок.
     - `_events: EventEmitter` — брокер событий.
   - **Методы**:
     - `setFieldValue(field: string, value: string): void` — заполняет поле.
     - `getFormData(): Partial<IOrderFormData>` — возвращает данные формы.
     - `setErrors(errors: Record<string, string>): void` — отображает ошибки.
     - `setSubmitActive(isActive: boolean): void` — управляет кнопкой.
   - **Примечание**: В конструкторе добавляются обработчики `submit` и `input` на `_form`.

6. **`PaymentForm` (наследник `OrderForm`)**

   - **Назначение**: Форма оплаты и адреса (#order).
   - **Конструктор**: `constructor(form: HTMLFormElement, events: EventEmitter)`
   - **Методы**:
     - `onSubmit(event: Event): void` — вызывает `order:submit-payment`.
     - `onInput(event: Event): void` — вызывает `order:input-changed`.

7. **`ContactsForm` (наследник `OrderForm`)**
   - **Назначение**: Форма контактов (#contacts).
   - **Конструктор**: `constructor(form: HTMLFormElement, events: EventEmitter)`
   - **Методы**:
     - `onSubmit(event: Event): void` — вызывает `order:submit-contacts`.
     - `onInput(event: Event): void` — вызывает `order:input-changed`.

#### Слой коммуникации

1. **`AppApi`**
   - **Назначение**: Работа с сервером.
   - **Конструктор**: `constructor(api: Api)`
   - **Методы**:
     - `fetchProducts(): Promise<IProduct[]>` — получает товары.
     - `submitOrder(order: IOrder): Promise<IOrderCompleted>` — отправляет заказ.

#### Базовые классы

1. **`Api`**

   - **Назначение**: Базовая логика запросов.
   - **Конструктор**: `constructor(baseUrl: string)`
   - **Методы**:
     - `get(endpoint: string): Promise<IProduct[]>` — получение данных.
     - `post(endpoint: string, data: object): Promise<IOrderCompleted>` — отправка данных.

2. **`EventEmitter`**
   - **Назначение**: Управление событиями.
   - **Конструктор**: `constructor()`
   - **Методы**:
     - `on(event: string, callback: (data: any) => void): void` — подписка.
     - `emit(event: string, data?: any): void` — вызов события.
     - `trigger(event: string): () => void` — создание триггера.

#### Presenter

- **Модуль**: `index.ts`
- **Назначение**: Связывает Model и View через события.

### Взаимодействие компонентов

Компоненты взаимодействуют через `EventEmitter`. Цепочка: **V → P → M → P → V**. Валидация форм происходит в `OrderData`, а `View` только отображает данные и ошибки.

#### Пример взаимодействия

1. **Клик по карточке**:
   - `ProductCard` → `product:open` → `index.ts` → `CatalogData.getProduct()` → `Modal.render()`.

#### События

- **`products:loaded`** — загрузка товаров.
- **`product:open`** — открытие товара.
- **`product:add`** — добавление в корзину.
- **`product:remove`** — удаление из корзины.
- **`cart:open`** — открытие корзины.
- **`cart:changed`** — обновление корзины.
- **`order:pay-form`** — форма оплаты.
- **`order:input-changed`** — изменение поля формы.
- **`order:submit-payment`** — отправка формы оплаты.
- **`order:submit-contacts`** — отправка формы контактов.
- **`form:validated`** — результат валидации.
- **`modal:open`** — открытие модалки.
- **`modal:close`** — закрытие модалки.
