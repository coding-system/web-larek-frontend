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
- **Model** — слой данных, отвечает за хранение и обработку информации (товары, корзина, заказ).
- **View** — слой отображения, отвечает за визуализацию данных на экране.
- **Presenter** — посредник, связывает Model и View через события, управляемые классом `EventEmitter`.

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
   - **Назначение**: Управляет данными заказа.  
   - **Конструктор**: `constructor(events: EventEmitter)`  
   - **Поля**:  
     - `_order: IOrder` — объект заказа.  
     - `_events: EventEmitter` — брокер событий.  
   - **Методы**:  
     - `setField(field: keyof IOrderFormData, value: string): void` — устанавливает значение поля.  
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
     - `_cartButton: HTMLButtonElement` — кнопка корзины (интерактивный элемент).  
     - `_events: EventEmitter` — брокер событий.  
   - **Методы**:  
     - `renderCatalog(products: IProductMainPage[]): void` — отображает каталог.  
     - `updateCartCounter(count: number): void` — обновляет счётчик.  
     - `onCartClick(): void` — обработчик клика по кнопке корзины (вызывает событие `cart:open`).  
   - **Примечание**: В конструкторе добавляется обработчик `click` на `_cartButton`.

2. **`ProductCard`**  
   - **Назначение**: Карточка товара для разных шаблонов (галерея, модалка, корзина).  
   - **Конструктор**: `constructor(template: HTMLElement, events: EventEmitter)`  
   - **Поля**:  
     - `_element: HTMLElement` — DOM-элемент карточки (интерактивный элемент).  
     - `_events: EventEmitter` — брокер событий.  
   - **Методы**:  
     - `render(data: IProductMainPage | IProduct | IProductToAdd): HTMLElement` — отображает карточку.  
     - `onCardClick(): void` — обработчик клика по карточке (вызывает `product:open` или `product:remove` в зависимости от контекста).  
   - **Примечание**: В конструкторе добавляется обработчик `click` на `_element`.

3. **`Modal`**  
   - **Назначение**: Универсальное модальное окно для контента.  
   - **Конструктор**: `constructor(container: HTMLElement, events: EventEmitter)`  
   - **Поля**:  
     - `_container: HTMLElement` — элемент модалки (интерактивный для клика по фону).  
     - `_contentArea: HTMLElement` — область контента.  
     - `_closeButton: HTMLButtonElement` — кнопка закрытия (интерактивный элемент).  
     - `_events: EventEmitter` — брокер событий.  
   - **Методы**:  
     - `render(content: HTMLElement): void` — рендерит контент и открывает модалку.  
     - `open(): void` — открывает модалку.  
     - `close(): void` — закрывает модалку.  
     - `onCloseClick(): void` — обработчик клика по кнопке закрытия (вызывает `close()`).  
     - `onOverlayClick(event: MouseEvent): void` — обработчик клика по фону (закрывает, если клик вне контента).  
   - **Примечание**: В конструкторе добавляются обработчики `click` на `_closeButton` и `_container`.

4. **`CartView`**  
   - **Назначение**: Отображение корзины в модальном окне.  
   - **Конструктор**: `constructor(container: HTMLElement, events: EventEmitter)`  
   - **Поля**:  
     - `_items: HTMLElement` — контейнер товаров.  
     - `_total: HTMLElement` — элемент суммы.  
     - `_checkoutButton: HTMLButtonElement` — кнопка "Оформить" (интерактивный элемент).  
     - `_events: EventEmitter` — брокер событий.  
   - **Методы**:  
     - `render(items: IProductToAdd[], total: number): void` — отображает корзину.  
     - `onCheckoutClick(): void` — обработчик клика по кнопке "Оформить" (вызывает `order:pay-form`).  
   - **Примечание**: В конструкторе добавляется обработчик `click` на `_checkoutButton`.

5. **`OrderForm`**  
   - **Назначение**: Формы заказа (оплата/адрес и контакты).  
   - **Конструктор**: `constructor(form: HTMLFormElement, events: EventEmitter)`  
   - **Поля**:  
     - `_form: HTMLFormElement` — элемент формы (интерактивный для отправки).  
     - `_submitButton: HTMLButtonElement` — кнопка "Далее" или "Оплатить" (интерактивный элемент).  
     - `_errors: Record<string, HTMLElement>` — элементы ошибок.  
     - `_events: EventEmitter` — брокер событий.  
   - **Методы**:  
     - `setFieldValue(field: string, value: string): void` — заполняет поле.  
     - `getFormData(): IOrderFormData` — возвращает данные.  
     - `setErrors(errors: Record<string, string>): void` — показывает ошибки.  
     - `setSubmitActive(isActive: boolean): void` — управляет кнопкой.  
     - `onSubmit(event: Event): void` — обработчик отправки формы (вызывает `order:pay-form` или `order:submit`).  
   - **Примечание**: В конструкторе добавляется обработчик `submit` на `_form`.

#### Слой коммуникации
1. **`AppApi`**  
   - **Назначение**: Работа с сервером (вспомогательный класс для Model).  
   - **Конструктор**: `constructor(api: Api)`  
   - **Методы**:  
     - `fetchProducts(): Promise<IProduct[]>` — получает товары.  
     - `submitOrder(order: IOrder): Promise<IOrderCompleted>` — отправляет заказ.

#### Базовые классы
1. **`Api`**  
   - **Назначение**: Базовая логика запросов к серверу.  
   - **Конструктор**: `constructor(baseUrl: string)`  
   - **Методы**:  
     - `get(endpoint: string): Promise<IProduct[]>` — получение данных.  
     - `post(endpoint: string, data: object): Promise<IOrderCompleted>` — отправка данных.

2. **`EventEmitter`**  
   - **Назначение**: Управление событиями (часть Presenter).  
   - **Конструктор**: `constructor()`  
   - **Методы**:  
     - `on(event: string, callback: (data: any) => void): void` — подписка на событие.  
     - `emit(event: string, data?: any): void` — вызов события.  
     - `trigger(event: string): () => void` — создание триггера.

#### Presenter
- **Модуль**: `index.ts`  
- **Назначение**: Связывает Model и View через события. Создаёт экземпляры классов и настраивает обработчики событий.

### Взаимодействие компонентов
Компоненты взаимодействуют через **событийно-ориентированный подход** с использованием `EventEmitter`. Цепочка действий следует принципу MVP: **V → P → M → P → V**.

#### Пример взаимодействия
1. **Пользователь кликает на карточку товара в галерее**:  
   - **View**: `ProductCard` ловит клик в `onCardClick` и вызывает `events.emit('product:open', product)`.  
   - **Presenter**: В `index.ts` обработчик `product:open` вызывает метод `CatalogData.getProduct(id)`.  
   - **Model**: `CatalogData` возвращает товар и вызывает `events.emit('modal:open', product)`.  
   - **Presenter**: Обработчик `modal:open` передаёт данные в `Modal`.  
   - **View**: `Modal` открывает модалку с полной информацией о товаре.

#### События
- **`products:loaded`** — товары загружены с сервера, вызывает `Page.renderCatalog()`.  
- **`product:open`** — открытие карточки в модалке.  
- **`product:add`** — добавление товара в корзину (`CartData.addItem()`).  
- **`product:remove`** — удаление товара из корзины (`CartData.removeItem()`).  
- **`cart:open`** — открытие корзины в модалке.  
- **`cart:updated`** — обновление корзины (`CartView.render()`).  
- **`order:pay-form`** — открытие формы оплаты и адреса.  
- **`order:contact-form`** — открытие формы контактов.  
- **`order:submit`** — отправка заказа (`OrderData.submit()`).  
- **`order:success`** — успешное оформление, показ сообщения.  
- **`form:errors`** — отображение ошибок в форме.  
- **`modal:open`** — открытие модального окна.  
- **`modal:close`** — закрытие модального окна.