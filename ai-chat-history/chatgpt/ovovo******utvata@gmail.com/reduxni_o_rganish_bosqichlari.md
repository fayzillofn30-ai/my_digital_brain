# Reduxni o'rganish bosqichlari

### 👤 Foydalanuvchi:

Salom men redux ni o'rganmoqchiman

### 🤖 ChatGPT:

Salom! Zo'r tanlov. Sening oldingi React savollaringni hisobga olsam, endi Reduxni o'rganishga tayyorsan.

Lekin bitta muhim gap: **2026-yilda Reduxni emas, Redux Toolkit (RTK)ni o'rganish kerak.** Chunki deyarli barcha yangi loyihalar RTK ishlatadi. Oddiy Redux esa ko'proq intervyu va eski loyihalarda uchraydi.

Men quyidagi ketma-ketlikni tavsiya qilaman.

## 0-bosqich. Reduxga o'tishdan oldin Reactni tushunish

Quyidagilar yaxshi tushunilgan bo'lishi kerak:

- ✅ Props
- ✅ State (`useState`)
- ✅ `useEffect`
- ✅ `useContext`
- ✅ Component re-render

Biz oldingi suhbatlarda `useContext` va re-render haqida ancha gaplashgandik, shuning uchun bu qism senda bor.

---

# 1-bosqich. Redux nima uchun kerak?

Tasavvur qil:

```
App

├── Navbar
│
├── Products
│
├── Cart
│
└── Footer
```

Agar Cartdagi mahsulot sonini Navbar ham ko'rsatishi kerak bo'lsa nima qilamiz?

Oddiy Reactda:

```
App
│
├── cart
│
├── Navbar(cart)
│
└── Cart(cart)
```

State App ichida saqlanadi.

Agar 20 ta component bo'lsa?

```
App
│
├── A
│   └── B
│       └── C
│           └── D
```

D ga state kerak.

Shunda

```
App
↓
A
↓
B
↓
C
↓
D
```

Props uzataveramiz.

Bu **Props Drilling** deyiladi.

Redux aytadi:

> "Hammani bezovta qilma. Bitta umumiy ombor (Store) och."

Shunda

```
Navbar

          Store

Cart
```

Ikkalasi ham Storedan ma'lumot oladi.

---

# 2-bosqich. Reduxning asosiy g'oyasi

Reduxni bitta gap bilan:

> **Application State ni bitta joyda saqlash.**

Masalan

```
Store

{
   user: {},
   cart: [],
   theme: "dark",
   language: "uz"
}
```

Mana shu Store.

---

# 3-bosqich. Reduxning 3 ta asosiy qismi

Reduxni quyidagicha tasavvur qil.

```
Component

↓

dispatch()

↓

Reducer

↓

Store

↓

Component update
```

Har safar aynan shu sikl ishlaydi.

---

# Store

Store bu database emas.

Bu RAM ichidagi object.

Masalan

```js
{
    count: 0
}
```

---

# Action

Action oddiy object.

```js
{
    type: "increment"
}
```

yoki

```js
{
    type: "addUser",
    payload: {
        name: "Ali"
    }
}
```

---

# Dispatch

Dispatch actionni yuboradi.

```js
dispatch({
    type:"increment"
})
```

---

# Reducer

Reducer nima qilishni hal qiladi.

```js
function reducer(state, action){

}
```

Masalan

```js
function reducer(state, action){

    if(action.type=="increment"){

        return {
            count:state.count+1
        }

    }

    return state
}
```

---

# 4-bosqich. Data Flow

```
Button bosildi

↓

dispatch()

↓

Reducer ishladi

↓

Store yangilandi

↓

React qayta render bo'ldi
```

Reduxda data har doim **bir tomonga oqadi**.

---

# 5-bosqich. Redux Toolkit

Bugungi kunda deyarli hech kim mana bunday yozmaydi.

```js
const INCREMENT="INCREMENT"

function reducer(){

}
```

Buning o'rniga

```js
createSlice()
```

ishlatiladi.

Masalan

```js
const counterSlice = createSlice({

    name:"counter",

    initialState:{
        count:0
    },

    reducers:{

        increment(state){
            state.count++
        },

        decrement(state){
            state.count--
        }

    }

})
```

Bu juda qisqa va qulay.

---

# 6-bosqich. React bilan ishlash

Store yaratiladi.

```
store.js
```

↓

App Provider ichiga o'raladi.

↓

Component ichida

```js
const count = useSelector(state=>state.counter.count)
```

↓

Yangilash uchun

```js
dispatch(increment())
```

---

# 7-bosqich. O'rganish rejasi

Men shunday ketishni taklif qilaman:

1. Redux nima?
2. Global State nima?
3. Store
4. Action
5. Reducer
6. Dispatch
7. Redux Toolkit
8. `configureStore`
9. `createSlice`
10. `Provider`
11. `useSelector`
12. `useDispatch`
13. Async (`createAsyncThunk`)
14. API bilan ishlash

---

## Men qanday o'rgataman?

Sening savollaringdan ko'rinib turibdiki, sen narsalarni **"ichida nima bo'layapti?"** degan nuqtai nazardan tushunishni yoqtirasan. Masalan, `useContext`ni ham ichki ishlashigacha tushunishga harakat qilgansan.

Shuning uchun Reduxni ham shunday o'rganamiz:

- Avval **Reduxsiz muammo**ni yaratamiz.
- Keyin **oddiy JavaScript** bilan Redux g'oyasini quramiz.
- Shundan keyin **React**ga o'tamiz.
- Oxirida esa **Redux Toolkit**ni ishlatamiz.

Bu usul bilan sen nafaqat RTK API'sini, balki uning nima uchun shunday ishlashini ham tushunib olasan.

Menimcha, bu eng samarali yo'l.

---

### 👤 Foydalanuvchi:

men Context Api ni o'rganib bo'ldim navbat redux

### 🤖 ChatGPT:

Ajoyib. Unda aynan Redux uchun poydevoring tayyor. Chunki Reduxni tushunish uchun eng muhim narsa — **global state** tushunchasi, sen esa uni `Context API` orqali ko'rib bo'lding.

Lekin bitta narsani boshidan aniqlab olaylik.

> **Context API va Redux bir-birining o'rnini to'liq bosmaydi.**

Ko'pchilik "Redux nima uchun kerak, Context ham global state-ku?" degan savolni beradi. Bu juda o'rinli savol.

Misol:

```jsx
<App>
    <UserProvider>
        <Navbar />
        <Profile />
    </UserProvider>
</App>
```

`Navbar` ham, `Profile` ham bitta Contextdan foydalana oladi.

Xo'sh, unda Redux nima qiladi?

Redux faqat global state saqlamaydi. U yana:

- state qanday o'zgarishini nazorat qiladi;
- actionlarni boshqaradi;
- debuggingni osonlashtiradi (Redux DevTools);
- katta loyihalarda kodni tartibli saqlaydi;
- async operatsiyalarni qulay boshqaradi (`createAsyncThunk` va boshqalar).

---

# Men senga quyidagi kursni o'tmoqchiman

## 1-dars — Redux falsafasi

- Redux nima?
- Nima uchun yaratilgan?
- Contextdan farqi
- Flux Architecture
- One Way Data Flow

**Kod yozmaymiz.**

---

## 2-dars — Reduxni JavaScriptda yozamiz

Reactsiz.

Masalan:

```js
const store = {
    count: 0
};
```

Keyin o'zimiz:

- `dispatch`
- `subscribe`
- `reducer`

hammasini yozamiz.

Shunda Redux ichida nima ishlashini tushunasan.

---

## 3-dars — Redux Toolkit

Bu yerda:

- `configureStore`
- `createSlice`

---

## 4-dars — React bilan ulash

- `Provider`
- `useSelector`
- `useDispatch`

---

## 5-dars — CRUD

Masalan:

```
Todo App
```

Qo'shish

O'chirish

Tahrirlash

Filter

Hammasi Redux Toolkit bilan.

---

## 6-dars — API

```
JSONPlaceholder
```

yoki

```
FakeStore API
```

bilan ishlaymiz.

Bu yerda:

- `createAsyncThunk`
- loading
- error
- success

hammasini ko'ramiz.

---

## 7-dars — Professional arxitektura

Papkalar:

```
src/
│
├── app/
│   └── store.js
│
├── features/
│   ├── auth/
│   ├── user/
│   └── product/
│
├── hooks/
├── services/
└── pages/
```

Shu darajaga kelsang, intervyudagi Redux savollarining katta qismini bemalol yecha olasan.

---

## Bitta iltimos

Seni oldingi suhbatlardan bilaman: sen tayyor kodni yodlashdan ko'ra, **"nega shunday ishlaydi?"** degan savolga javob izlaysan. Shu usulni Reduxda ham davom ettiramiz.

Masalan, men shunchaki:

```js
const store = configureStore({...})
```

deb o'tib ketmayman.

Balki:

- `configureStore` ichida nima bo'ladi?
- `dispatch` aslida qayerga boradi?
- `useSelector` qayerdan biladi state o'zgarganini?
- `Immer` qanday qilib `state.count++` yozishga ruxsat beradi?

kabi savollarga ham javob beramiz.

Bu yo'l biroz uzunroq, lekin oxirida Reduxni "ishlatadigan" emas, **tushunadigan** dasturchiga aylanasan.

Men tayyorman. Keyingi xabarimizni **1-dars: "Redux paydo bo'lishidan oldingi muammo"** bilan boshlaymiz. Aynan o'sha muammodan Redux nima uchun yaratilganini bosqichma-bosqich chiqarib olamiz.

---

### 👤 Foydalanuvchi:

faqat reduxning ozi tollkitsiz

### 🤖 ChatGPT:

Zo'r qaror. Hatto men buni qo'llab-quvvatlayman. 👍

Agar maqsading **Reduxni chuqur tushunish** bo'lsa, avval **klassik Redux**ni o'rganish juda foydali. Chunki **Redux Toolkit aslida Redux ustiga qurilgan abstraksiya**. Asosini tushunmasdan RTK ishlatish ko'pchilikni "copy-paste dasturchi"ga aylantiradi.

Biz quyidagi mavzularni ketma-ket o'rganamiz:

1. Redux nima va nima uchun yaratilgan?
2. Store
3. Action
4. Reducer
5. Dispatch
6. Subscribe
7. `createStore()`
8. `combineReducers()`
9. Middleware nima?
10. `redux-thunk` nima uchun kerak?
11. React bilan ulash:
   - `Provider`
   - `connect()`
   - `mapStateToProps`
   - `mapDispatchToProps`
12. Shundan keyingina Redux Toolkitga o'tish mumkin (xohlasang).

## Men darsni qanday o'taman?

Tayyor APIlarni yodlatmayman.

Masalan, birinchi darslarda hatto `createStore()` ham ishlatmaymiz. O'zimiz juda sodda Reduxga o'xshash tizim yozamiz.

Masalan:

```js
let state = {
  count: 0
};

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };

    default:
      return state;
  }
}
```

Keyin asta-sekin:

- `dispatch()`
- `subscribe()`
- `createStore()`

ni o'zimiz yozamiz.

Shundan keyin haqiqiy Redux kodini ochamiz va ko'ramiz:

```js
const store = createStore(reducer);
```

Shunda sen: **"Ha, createStore aslida biz yozgan narsaning professional ko'rinishi ekan."** degan xulosaga kelasiz.

## Oxirgi natija

Kurs tugaganda sen quyidagi savollarga javob bera olasan:

- Nima uchun reducer pure function bo'lishi kerak?
- Nima uchun state immutable bo'lishi kerak?
- Nega `dispatch()` actionni reducerga yuboradi?
- `subscribe()` qanday ishlaydi?
- `combineReducers()` ichida nima sodir bo'ladi?
- `redux-thunk` dispatchni qanday o'zgartiradi?
- Nega Redux Toolkit `state.count++` yozishga ruxsat beradi?

Shundan keyin Redux Toolkitni o'rganish juda oson bo'ladi, chunki uning deyarli har bir funksiyasi ortida qanday klassik Redux mexanizmi yotganini tushunib turasan.

Menga bu reja yoqadi. Endi haqiqiy **klassik Redux**ni noldan boshlaymiz va har bir mexanizmni o'z qo'limiz bilan quramiz.

---

### 👤 Foydalanuvchi:

CreateStorega o't

### 🤖 ChatGPT:

Zo'r, endi **Reduxning yuragi** bo'lgan `createStore()`ga o'tamiz.

Lekin birdan APIni ko'rmaymiz. Avval savol:

> **`createStore` nima uchun kerak?**

Tasavvur qil, bizda reducer bor.

```js
const initialState = {
  count: 0,
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    default:
      return state;
  }
}
```

Bu reducer faqat **hisob-kitob qiladi**.

Lekin savol:

- State qayerda saqlanadi?
- Dispatch kim qiladi?
- Kim reducerni chaqiradi?
- Kim yangi stateni eslab qoladi?

Reducerning o'zi bularni qilmaydi.

Shu yerda `createStore` paydo bo'ladi.

---

# Store aslida nima?

Store — bu bitta object.

Uning ichida 3 ta asosiy narsa bor:

```text
Store
│
├── state
├── dispatch()
└── getState()
```

Keyin yana:

```text
Store
│
├── state
├── dispatch()
├── getState()
└── subscribe()
```

Demak `createStore()` mana shu objectni yaratib beradi.

---

# O'zimiz yozib ko'ramiz

Faraz qil Redux yo'q.

Biz yozamiz:

```js
function createStore(reducer) {
  let state;

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
  }

  return {
    getState,
    dispatch,
  };
}
```

Endi ishlatamiz.

```js
const store = createStore(counterReducer);

store.dispatch({
  type: "INCREMENT",
});

console.log(store.getState());
```

Natija:

```js
{
  count: 1;
}
```

Nima bo'ldi?

1.

```js
store.dispatch(...)
```

↓

2.

```js
dispatch()
```

↓

3.

```js
reducer(state, action)
```

↓

4.

Reducer yangi object qaytardi.

↓

5.

Store yangi stateni ichiga saqlab qo'ydi.

---

# Nega `state = reducer(...)`?

Mana shu eng muhim qator.

```js
state = reducer(state, action);
```

Reducer hech qachon eski stateni o'zgartirmaydi.

U har doim:

```js
Old State
```

↓

hisoblaydi

↓

```js
New State
```

qaytaradi.

Store esa:

```js
state = newState
```

deb almashtiradi.

---

# Lekin muammo bor

Bizning store ishlamaydi.

Nega?

```js
const store = createStore(counterReducer);

console.log(store.getState());
```

Natija:

```js
undefined
```

Nima uchun?

Chunki hali biror marta reducer ishlamadi.

Shuning uchun haqiqiy Redux ichida `createStore` yaratilganda reducer **bir marta avtomatik chaqiriladi**.

Taxminan shunday:

```js
dispatch({
  type: "@@redux/INIT",
});
```

Bu actionni sen yozmaysan.

Redux o'zi yuboradi.

Reducer esa:

```js
state = initialState
```

ni qaytaradi.

Shundan keyin:

```js
store.getState()
```

darhol ishlaydi.

---

# Haqiqiy Redux

Asl Redux ichida soddalashtirilgan ko'rinishi taxminan shunday:

```js
function createStore(reducer) {
  let currentState;

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    currentState = reducer(currentState, action);
  }

  dispatch({
    type: "@@redux/INIT",
  });

  return {
    getState,
    dispatch,
  };
}
```

---

## Hozircha biz `createStore()`ning 80% qismini tushundik.

Faqat bitta katta narsa yetishmayapti:

```js
subscribe()
```

Savol tug'iladi:

> **React `dispatch()` bo'lganini qayerdan biladi? Kim unga "state o'zgardi, qayta render qil" deb xabar beradi?**

Javob aynan `subscribe()` ichida yashiringan. Uni tushunganingdan keyin `createStore()` mexanizmi deyarli to'liq tushunarli bo'ladi.

---

### 👤 Foydalanuvchi:

import { createStoreHook } from "react-redux";

const store = createStoreHook()

### 🤖 ChatGPT:

Bu yerda ikkita tushuncha aralashib ketgan.

Sen yozgan kod:

```js
import { createStoreHook } from "react-redux";

const store = createStoreHook();
```

Bu **Redux store yaratmaydi**.

### `createStoreHook` nima?

`createStoreHook` — **React Redux** kutubxonasidagi maxsus hook yaratish funksiyasi. U asosan juda kam uchraydigan, murakkab holatlar (masalan, custom `Provider` context) uchun ishlatiladi.

Oddiy Redux ishlatganda **hech qachon** `createStoreHook()` chaqirmaysan.

---

## Klassik Reduxda store qanday yaratiladi?

Redux kutubxonasidan import qilinadi:

```js
import { createStore } from "redux";
```

Keyin:

```js
const store = createStore(reducer);
```

Masalan:

```js
import { createStore } from "redux";

const initialState = {
  count: 0,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    default:
      return state;
  }
}

const store = createStore(reducer);

console.log(store.getState()); // { count: 0 }
```

---

## `redux` va `react-redux` farqi

Bu intervyuda ham ko'p so'raladigan mavzu.

### `redux`

Bu **state management** kutubxonasi.

Unda:

- `createStore`
- `combineReducers`
- `applyMiddleware`

va boshqa Reduxning asosiy API'lari bor.

---

### `react-redux`

Bu esa Reduxni React bilan bog'laydigan kutubxona.

Unda:

- `Provider`
- `connect`
- `useSelector`
- `useDispatch`

va ichki hooklar (`createStoreHook`, `createSelectorHook`, `createDispatchHook`) mavjud.

---

### Xulosa

❌ Noto'g'ri:

```js
import { createStoreHook } from "react-redux";

const store = createStoreHook();
```

✅ Klassik Redux:

```js
import { createStore } from "redux";

const store = createStore(reducer);
```

Keyingi darsda esa `createStore(reducer)` ichiga reducer uzatilganda, **`createStore` ichida satrma-satr nima sodir bo'lishini** ko'rib chiqamiz. Bu Reduxni haqiqatan tushunishning eng muhim qismi.

---

### 👤 Foydalanuvchi:

import { createStore } from "redux";

const initialState = {
  count: 0,
};

type countAction = {
    type : string,
    payload : {[{key :string} : {}]}
}

function reducer(state = initialState, action :countAction) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    default:
      return state;
  }
}

const store = createStore(reducer);

console.log(store.getState()); // { count: 0 }

### 🤖 ChatGPT:

Juda yaxshi, lekin TypeScript qismida xatolar bor. Keling, birma-bir ko'ramiz.

## 1. `payload` tipi noto'g'ri yozilgan

Sen yozgansan:

```ts
payload: {[{key :string} : {}]}
```

Bu TypeScript sintaksisi emas.

Agar payload ixtiyoriy object bo'lsa:

```ts
type CountAction = {
  type: string;
  payload?: Record<string, unknown>;
};
```

yoki

```ts
type CountAction = {
  type: string;
  payload?: {
    [key: string]: unknown;
  };
};
```

---

## 2. Bu reducer uchun payload umuman kerak emas

Sening reducering:

```ts
case "INCREMENT":
```

payload ishlatmayapti.

Unda actionni shunchaki:

```ts
type CountAction = {
  type: string;
};
```

deb yozish mumkin.

---

## 3. TypeScriptning kuchidan foydalanish

Hozirgi holatda:

```ts
type: string
```

deganing uchun quyidagisi ham o'tib ketadi:

```ts
store.dispatch({
  type: "HELLO_WORLD"
});
```

TypeScript xato bermaydi.

Yaxshiroq variant:

```ts
type CountAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" };
```

Endi:

```ts
store.dispatch({
  type: "ABC"
});
```

❌ TypeScript xato beradi.

---

## 4. Reducer

```ts
const initialState = {
  count: 0,
};

type State = typeof initialState;

type CountAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" };

function reducer(
  state: State = initialState,
  action: CountAction
): State {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    case "DECREMENT":
      return {
        count: state.count - 1,
      };

    default:
      return state;
  }
}
```

Bu ancha TypeScript uslubiga mos.

---

### Senga savol

Reduxni **haqiqatan tushunish** uchun bitta savol:

```ts
const store = createStore(reducer);
```

Bu qatordan keyin, **hali `dispatch()` chaqirilmagan bo'lsa ham**, nega:

```ts
console.log(store.getState());
```

natijasi:

```ts
{
  count: 0
}
```

chiqadi?

Bu `createStore()`ning ichidagi eng muhim mexanizmlardan biri. Agar bunga javob bera olsang, `createStore`ning yarmidan ko'pini tushungan bo'lasan.

---

### 👤 Foydalanuvchi:

default qismida return state bor

### 🤖 ChatGPT:

Bu yaxshi kuzatuv, lekin **asosiy sabab emas**. 🙂

Keling, ketma-ketlikni ko'raylik.

Senda reducer:

```ts
const initialState = {
  count: 0,
};

function reducer(state = initialState, action: CountAction) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    default:
      return state;
  }
}
```

Sen aytyapsan:

> `default`da `return state` bor.

Savol: **`state`ning o'zi qayerdan keldi?**

Reducer birinchi marta chaqirilganda:

```ts
reducer(undefined, ???)
```

`state` `undefined` bo'lgani uchun JavaScript default parametrni ishlatadi:

```ts
state = initialState
```

Demak reducer:

```ts
return initialState;
```

qaytaradi.

Lekin yana bitta savol tug'iladi:

> **Reducerni birinchi marta kim chaqirdi? Axir sen `store.dispatch()` chaqirmading-ku!**

Javob: **`createStore()`ning o'zi.**

Ichkarida taxminan shunday kod bor:

```ts
function createStore(reducer) {
  let currentState;

  function dispatch(action) {
    currentState = reducer(currentState, action);
  }

  // Store yaratilganda avtomatik chaqiriladi
  dispatch({
    type: "@@redux/INIT"
  });

  return {
    dispatch,
    getState: () => currentState
  };
}
```

Ya'ni:

1. `createStore(reducer)` chaqirildi.
2. `createStore` ichida avtomatik `dispatch({ type: "@@redux/INIT" })` bajarildi.
3. Reducerga `state` sifatida `undefined` uzatildi.
4. `state = initialState` ishga tushdi.
5. `currentState` endi `{ count: 0 }` bo'ldi.
6. Shuning uchun:

```ts
console.log(store.getState());
```

natijasi:

```ts
{ count: 0 }
```

bo'ladi.

---

### Qisqa xulosa

`default: return state` **muhim**, lekin u boshlang'ich `state`ni yaratmaydi. Boshlang'ich `state` quyidagi ikki narsa tufayli hosil bo'ladi:

- `createStore()` reducerni **bir marta avtomatik chaqiradi** (`@@redux/INIT` actioni bilan).
- Reducerdagi `state = initialState` default parametri `undefined` o'rniga `initialState`ni oladi.

Shu mexanizmni tushunsang, `createStore()`ning eng muhim ishlash prinsipini tushungan bo'lasan.

---

### 👤 Foydalanuvchi:

endi coponentalarda olish

### 🤖 ChatGPT:

Zo'r. Endi **klassik Redux**ni React bilan bog'laymiz.

> Eslatma: Sen **Redux Toolkit emas**, **klassik Redux**ni o'rganyapsan. Shuning uchun `Provider`, `connect` va `mapStateToProps` bilan boshlaymiz.

## 1-qadam. Store

```ts
// store.ts
import { createStore } from "redux";

const initialState = {
  count: 0,
};

function reducer(state = initialState, action: { type: string }) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    default:
      return state;
  }
}

export const store = createStore(reducer);
```

---

## 2-qadam. `Provider`

`main.tsx` yoki `index.tsx`:

```tsx
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### Savol: `Provider` nima qiladi?

`Provider` React Context orqali **store**ni butun component daraxtiga uzatadi.

Tasavvur qil:

```
Provider
│
├── App
│   ├── Navbar
│   ├── Home
│   └── Footer
```

Endi istalgan component storega ulana oladi.

---

## 3-qadam. `connect()`

Klassik Reduxda `useSelector` hali yo'q edi. Componentlar `connect()` orqali ulanardi.

Masalan:

```tsx
import { connect } from "react-redux";

function Counter(props: any) {
  return <h1>{props.count}</h1>;
}

export default connect()(Counter);
```

Lekin bu hali `count`ni bermaydi.

---

## 4-qadam. `mapStateToProps`

Storedagi stateni component propsiga aylantiradi.

```tsx
const mapStateToProps = (state: any) => {
  return {
    count: state.count,
  };
};
```

Keyin:

```tsx
export default connect(mapStateToProps)(Counter);
```

Endi:

```tsx
function Counter(props: any) {
  return <h1>{props.count}</h1>;
}
```

`props.count` storedagi `state.count` bilan bir xil bo'ladi.

---

## To'liq misol

```tsx
import { connect } from "react-redux";

function Counter(props: any) {
  return (
    <>
      <h1>{props.count}</h1>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  count: state.count,
});

export default connect(mapStateToProps)(Counter);
```

---

## Bu yerda nima sodir bo'lyapti?

`connect(mapStateToProps)` ichkarida taxminan shunday ishlaydi:

```js
const state = store.getState();

const props = {
  count: state.count,
};
```

va shu `props`ni componentga uzatadi.

Shuning uchun:

```tsx
props.count
```

aslida:

```tsx
store.getState().count
```

ning React usulida uzatilgan ko'rinishi.

---

### Keyingi qadam

Hozir component **faqat o'qiyapti** (`getState()`).

Endi savol tug'iladi:

> **Component ichidan `dispatch({ type: "INCREMENT" })`ni qanday yuboramiz?**

Buni klassik Reduxda **`mapDispatchToProps`** orqali qilamiz. Bu `connect` API'ning ikkinchi yarmi va uni tushunsang, klassik Reduxning asosiy React integratsiyasini o'zlashtirgan bo'lasan.

---

### 👤 Foydalanuvchi:

hook bilan olib bo'lmaydimi

### 🤖 ChatGPT:

Bo'ladi. **Bemalol bo'ladi.** Lekin bu yerda tarixiy farqni bilish kerak.

- **Klassik Redux** (eski usul) → `connect()`, `mapStateToProps`, `mapDispatchToProps`
- **Hozirgi React Redux** → `useSelector()` va `useDispatch()` hooklari

Muhimi, **hooklar Redux Toolkitga tegishli emas**. Ular `react-redux` kutubxonasining o'zi.

Shuning uchun sen **klassik Redux store**ni ishlatib, hooklardan foydalanishing mumkin.

Masalan:

### Store

```ts
import { createStore } from "redux";

const initialState = {
  count: 0,
};

function reducer(state = initialState, action: { type: string }) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    default:
      return state;
  }
}

export const store = createStore(reducer);
```

### Component

```tsx
import { useSelector } from "react-redux";

function Counter() {
  const count = useSelector((state: any) => state.count);

  return <h1>{count}</h1>;
}

export default Counter;
```

Dispatch qilish:

```tsx
import { useDispatch } from "react-redux";

function Counter() {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch({ type: "INCREMENT" })}
    >
      +
    </button>
  );
}
```

Yoki ikkalasini birga:

```tsx
import { useDispatch, useSelector } from "react-redux";

function Counter() {
  const count = useSelector((state: any) => state.count);
  const dispatch = useDispatch();

  return (
    <>
      <h1>{count}</h1>

      <button onClick={() => dispatch({ type: "INCREMENT" })}>
        Increment
      </button>
    </>
  );
}
```

## Xo'sh, unda `connect()`ni nega o'rganamiz?

Chunki intervyuda quyidagi savolni berishlari mumkin:

> **`connect()` bilan `useSelector()`ning farqi nima?**

Agar sen faqat hooklarni bilsang, eski kod bazalarini tushunishda qiynalishing mumkin.

Lekin **yangi loyihalarda deyarli hamma hooklardan foydalanadi**. Shuning uchun, agar maqsading amaliy ishlash bo'lsa, `useSelector` va `useDispatch`ni ishlatish to'g'ri tanlov. `connect()`ni esa tarixiy API sifatida tushunib qo'yish kifoya.

---

