# Clear ma'lumotlarni tozalash

### 👤 Foydalanuvchi:

import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Context } from "telegraf";
import { UserService } from "./user.service";
import { editMessage, getEditButtons, homeEntity, response, sendContactEntity, targetsEdit, updateTarget } from "./entitiys";

@Update()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) { }

  @Start()
  async start(@Ctx() ctx: Context) {
    ctx.reply(`Contactingizni yuboring`, sendContactEntity)
  }

  @On("contact")
  async getContact(@Ctx() ctx: Context) {

    await this.userService.createUser(ctx)
  }

  @On("text")
  async home(@Ctx() ctx: Context) {
    const text = ctx.message?.['text'].trim()
    const id = ctx.from?.id
    const step = await this.userService.getStep(id)
    if (!text || text.length === 0) {
      return
    }
    if (text.startsWith("Profi")) {
      await this.sendProfile(ctx)
      return
    }
    if (text.startsWith("Edi")) {
      if (!(await this.userService.findByUserId(id))) {
        ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
        return
      }
      ctx.reply(editMessage, getEditButtons)
      return
    }
    if(text === 'Delete'){
      await this.userService.delete(id)
      ctx.reply("/start",sendContactEntity)
      return
    }
    if(text === "Clear"){
      
    }
    if (text.startsWith("4 Home")) {
      if (!(await this.userService.findByUserId(id))) {
        ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
        return
      }
      ctx.reply("Menyudan tanlang !", homeEntity)
    } else {
      if (targetsEdit.includes(text)) this.editProfile(ctx, text, id)
      if (step === 0) return
      await this.updateItem(ctx, text, id)
      this.sendProfile(ctx)
      return
    }
  }

  async sendProfile(ctx: Context) {
    const id = ctx.message?.from.id
    // @ts-ignore
    const data = await this.userService.findByUserId(id)
    if (!data) {
      ctx.reply("Ma'lumotlar  topilmadi", sendContactEntity)
      return
    }
    ctx.reply(response(data))
  }

  async editProfile(ctx: Context, text: string, id: number | undefined) {
    const user = (await this.userService.findByUserId(id))
    if (!user) {
      ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
      return
    }
    if (text.startsWith("1 Ism")) {
      this.editStep(ctx, 1)
      ctx.reply("Ismingizni kiriting !", homeEntity)
    }
    if (text.startsWith("2 Fam")) {
      await this.editStep(ctx, 2)
      ctx.reply("Familiyangizni kiriting !", homeEntity)
    }
    if (text.startsWith("3 Tug")) {
      await this.editStep(ctx, 3)
      ctx.reply("Tug'gilgan sanangizni kiriting !", homeEntity)
    }
  }

  async editStep(ctx: Context, step: number) {
    const id = ctx.message?.from.id
    // @ts-ignore
    const result = await this.userService.updateUser(id, { step })
    if (!result) {
      return
    }
  }

  async updateItem(ctx: Context, text: string, id: number | undefined) {
    const user = (await this.userService.findByUserId(id))
    console.log(user)
    if (!user) {
      ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
      return
    }
    // @ts-ignore1
    const step = await this.userService.getStep(id)
    // @ts-ignore
    const data = updateTarget(ctx, text, step)
    if (data === "invalid") return
    console.log(data)
    // @ts-ignore
    await this.userService.updateUser(id, data)
    this.editStep(ctx, 0)

  }

}

Clear qilish kerak message.from.id  ga tegishli chatni clear qilish

### 🤖 ChatGPT:

Agar siz `Clear` komandasi yuborilganda foydalanuvchiga tegishli barcha chatni (yoki ma’lumotlarini) tozalamoqchi bo‘lsangiz, bu bir necha maqsadga xizmat qilishi mumkin. Masalan:

1. **Userning ma’lumotlarini o‘chirish**
2. **Botning oldingi yuborgan xabarlarini o‘chirish (Telegram chat tarixini tozalash emas, bot yuborganlarini o‘chirish)**

Telegram API orqali **foydalanuvchining Telegram chat tarixini butunlay o‘chirishning iloji yo‘q** (faqat foydalanuvchi o‘zi o‘chirishi mumkin). Ammo siz quyidagilarni qilishingiz mumkin:

---

### 1. Agar siz userga tegishli ma’lumotlarni `Clear` orqali o‘chirib tashlamoqchi bo‘lsangiz:

`UserService` ichida biror `clear` metodi yozing:

```ts
// user.service.ts
async clearUserData(userId: number) {
  return this.prisma.user.update({
    where: { userId },
    data: {
      firstName: null,
      lastName: null,
      birthDate: null,
      step: 0,
    },
  });
}
```

So'ngra `RegisterService` ichidagi `Clear` holatiga shu kodni qo‘shing:

```ts
if(text === "Clear"){
  await this.userService.clearUserData(id)
  ctx.reply("Ma'lumotlaringiz tozalandi. Qayta boshlash uchun /start buyrug'ini bering.")
  return
}
```

---

### 2. Agar siz bot yuborgan eski xabarlarni o‘chirmoqchi bo‘lsangiz:

Siz faqatgina **bot o‘zi yuborgan xabarlarni** va faqat **xabar ID sizda saqlangan bo‘lsa** o‘chira olasiz:

```ts
await ctx.deleteMessage(messageId)
```

Agar siz xabarlarni real vaqtda saqlamagan bo‘lsangiz, ularni qayta topish qiyin bo‘ladi. Ammo agar siz `ctx.reply(...)` qilganingizda xabarni saqlab qo‘ysangiz, keyinchalik o‘chirishingiz mumkin.

---

### Yakuniy Tavsiya

Agar siz faqat foydalanuvchining bazadagi ma’lumotlarini tozalashni xohlasangiz, bu eng oson yo‘l:

```ts
if(text === "Clear"){
  await this.userService.clearUserData(id)
  ctx.reply("Ma'lumotlaringiz tozalandi. /start orqali qayta boshlang.")
  return
}
```

Agar sizga xabarlarni ham o‘chirish kerak bo‘lsa, ulardan `message_id` ni saqlab borishingiz kerak bo‘ladi.

Aytmoqchi bo‘lsangiz, bu xabar ID’larni qanday saqlash yoki boshqarish haqida ham yordam bera olaman.

---

### 👤 Foydalanuvchi:

await ctx.deleteMessage(messageId)

user yuborgan messagelarni tozalash keraka

### 🤖 ChatGPT:

Telegram API orqali **foydalanuvchi tomonidan yuborilgan xabarlarni o‘chirish** uchun quyidagilar muhim:

---

### 🚫 Cheklov: Bot **foydalanuvchi yuborgan xabarlarni o‘chira olmaydi**, **agar**:
- Bot **supergroup yoki private chatda admin emas** bo‘lsa (faqat guruh uchun).
- Yoki **private chatda bo‘lsa**, bot **foydalanuvchi yuborgan xabarni** umuman **o‘chira olmaydi**. Telegram **private chatda foydalanuvchi yuborgan xabarni faqat foydalanuvchi o‘zi o‘chira oladi**.

---

### ✅ Qayerda o‘chirish mumkin:
1. **Supergroup chatda**: bot `can_delete_messages` huquqiga ega bo‘lsa, foydalanuvchi yuborgan xabarni o‘chira oladi.
2. **Private chatda**: **faqat bot yuborgan xabarni** o‘chira oladi.

---

### 📌 Xulosa:
Agar sizning botingiz **private chatda ishlayotgan bo‘lsa (ya’ni user bilan 1:1)**:
- Siz `ctx.message.message_id` orqali **user yuborgan matnni aniqlasangiz ham**, uni o‘chira olmaysiz.
- `ctx.deleteMessage()` faqat bot yuborgan xabarni o‘chiradi.

---

### 🔄 Alternativ Yechim:
Agar maqsad "chatni tozalash" effekti berish bo‘lsa, quyidagi usulni ko‘rib chiqing:

#### 1. Botning o‘z yuborgan xabarlarini saqlang va o‘chiring:
```ts
const sent = await ctx.reply("Ma'lumotlaringiz tozalandi.")
setTimeout(() => {
  ctx.deleteMessage(sent.message_id) // botning o‘zi yuborgan xabarni o‘chirish
}, 5000)
```

#### 2. Foydalanuvchiga “chatni o‘chiring” deb ayting:
```ts
ctx.reply("Iltimos, chatni tozalash uchun Telegram ilovasida o‘zingiz xabarlarni o‘chiring.")
```

---

Agar siz guruh yoki supergroupda ishlayotgan bo‘lsangiz, va bot admin bo‘lsa, quyidagicha o‘chirishingiz mumkin:

```ts
const messageId = ctx.message.message_id;
await ctx.deleteMessage(messageId); // Foydalanuvchi yuborgan xabarni o‘chiradi (faqat guruhda)
```

---

Aytgancha, agar siz `Clear` komandasi uchun ham foydalanuvchi yuborgan **oxirgi bir nechta xabarni** o‘chirmoqchi bo‘lsangiz, bu uchun **xabar ID-larni to‘plab saqlashingiz** kerak (masalan, Redis yoki vaqtinchalik massivda). Shunda `Clear` komandasi bosilganda, o‘sha ID’lar bo‘yicha o‘chirasiz.

Xohlasangiz, shunaqa xabarlarni saqlab, keyinchalik tozalovchi yechim tuzishda yordam bera olaman.

---

### 👤 Foydalanuvchi:

Guruhda emas user bilan boot yozishmalarining tarixini tozalash kerak

### 🤖 ChatGPT:

Afsuski, **Telegram’ning rasmiy cheklovlari**ga ko‘ra, **bot Telegram’ning “private chat” (ya'ni foydalanuvchi bilan 1:1 suhbat) tarixidagi foydalanuvchi yuborgan xabarlarni o‘chira olmaydi**.

### ❌ Nima qilishning iloji yo‘q:

- Siz **foydalanuvchi yuborgan xabarlarni** `ctx.deleteMessage(messageId)` bilan **o‘chira olmaysiz**.
- Telegram’ning `deleteMessage` metodi faqat **bot o‘zi yuborgan xabarlarni o‘chira oladi** (va u ham faqat 48 soat ichida).

---

### ✅ Siz qilishingiz mumkin bo‘lgan narsalar:

#### 1. **Bot yuborgan xabarlarni o‘chirish** (agar siz ularning `message_id` sini saqlasangiz):

```ts
const sent = await ctx.reply("Bu xabar 5 soniyada o'chiriladi");
setTimeout(() => {
  ctx.deleteMessage(sent.message_id);
}, 5000);
```

> Agar siz barcha yuborilgan xabarlarni saqlab boradigan bo‘lsangiz (masalan, massivda yoki DB’da), keyinchalik ularni tozalashingiz mumkin.

#### 2. **Userga chatni o‘zi tozalashini so‘rash**:

```ts
await ctx.reply("Telegram chat tarixini tozalash uchun xabarlarni o‘zingiz o‘chirishingiz kerak.");
```

Yoki yanada foydalanuvchiga qulayroq tushuntirish:

```ts
await ctx.reply("Telegram cheklovlariga ko‘ra, siz yuborgan xabarlarni faqat o‘zingiz o‘chira olasiz. Chat tarixini o‘chirish uchun xabarlaringizni qo‘lda o‘chirishingiz kerak.");
```

---

### 🛡 Xulosa

Telegram'da foydalanuvchi bilan bot o‘rtasidagi **private chat tarixini avtomatik tozalash** imkoniyati mavjud **emas**. Bu Telegram’ning xavfsizlik siyosati bilan bog‘liq.

Agar siz istasangiz, foydalanuvchining xabarlarini ko‘rsatilmasligi yoki bot faqat vaqtincha xabar yuborib, o‘zi o‘chirib yuborishi uchun **ephemeral chat effektini** tuzishda yordam bera olaman.

Shunaqa tizim kerakmi (masalan: 5 soniyadan keyin har bir bot xabari o‘chib ketsin)?

---

### 👤 Foydalanuvchi:

requiere_contact  cabi telegramning clear history ni ishga tushurish mumkinmi

### 🤖 ChatGPT:

Yo‘q, hozirgi vaqtda **Telegram Bot API** orqali **`require_contact`** yoki boshqa hech qanday parametr orqali **foydalanuvchi bilan bot o‘rtasidagi chat tarixini tozalash (clear history)** **imkoniyati mavjud emas**.

---

### 🔍 Keling, qisqacha tushunamiz:

#### ❓ `request_contact` yoki `require_contact` nima?

`request_contact: true` — bu `<KeyboardButton>` parametri bo‘lib, foydalanuvchidan kontaktini yuborishni so‘rash uchun ishlatiladi.

Misol:

```ts
reply("Kontakt yuboring", {
  reply_markup: {
    keyboard: [[{ text: "Kontaktni yuborish", request_contact: true }]],
    resize_keyboard: true,
    one_time_keyboard: true
  }
})
```

Bu **keyboardni yuboradi**, foydalanuvchi kontaktni yuboradi — **xolos**. Bu hech qachon tarixni tozalamaydi.

---

### ❌ Telegram’da "clear history"ni boshlatib yuborish imkoniyati:

- **Telegram’ning “Clear History” funksiyasi** — faqat foydalanuvchi tomonidan qo‘lda bajariladi.
- Bot orqali **chatni tozalash, chatni butunlay o‘chirish, yoki “auto-delete”ni ishga tushirish** imkoniyati mavjud emas.
- Faqat guruhlarda, agar bot admin bo‘lsa, u ba’zi xabarlarni o‘chirishi mumkin.

---

### ✅ Alternativ yo‘llar:

Agar siz foydalanuvchiga “chatni tozalashni tavsiya qilish”ni xohlasangiz, siz quyidagicha prompt berishingiz mumkin:

```ts
await ctx.reply(
  "Agar chat tarixini tozalamoqchi bo‘lsangiz, Telegram ilovasida chatni oching, yuqoridagi menyudan 'Clear Chat History' tugmasini tanlang."
);
```

---

### 🤔 Nima qilish mumkin?

Agar siz foydalanuvchiga:

- Faqat vaqtinchalik (ephemeral) xabar yuborishni istasangiz
- Har bir bot xabari 5–10 soniyadan so‘ng o‘chib ketishini istasangiz

…shunday tizimni yozish mumkin. Masalan:

```ts
const msg = await ctx.reply("Bu xabar 5 soniyadan so‘ng o‘chadi.");
setTimeout(() => {
  ctx.deleteMessage(msg.message_id);
}, 5000);
```

---

Agar sizga shunaqa “xabarlar o‘z-o‘zidan o‘chadigan” botni tuzishga yordam kerak bo‘lsa, to‘liq misol beraman. Shu turdagi xususiyat kerakmi?

---

### 👤 Foydalanuvchi:

Men requere contact ga o'xshash clear chat keynoard so'rash mumkinmi

### 🤖 ChatGPT:

Yo‘q, **`request_contact`** kabi **“clear chat”** funksiyasini **klaviatura tugmasi orqali chaqirib bo‘lmaydi**. Telegram **Bot API** quyidagi cheklovlarga ega:

---

### ❌ Nima *mumkin emas*:

- Siz **"Clear chat history"** (yoki “Delete chat”) funksiyasini **hech qanday tugma bilan avtomatik yoki majburan foydalanuvchiga ishga tushirib bera olmaysiz**.
- Telegram **foydalanuvchi xavfsizligi** va **ma’lumotni nazorat qilish** tamoyillari sababli, bu funksiyalar **faqat foydalanuvchining o‘z ixtiyori bilan Telegram ilovasida** bajarilishi kerak.

---

### ✅ Nima *mumkin*:

Siz **klaviatura tugmasi** orqali foydalanuvchiga *tavsiyanoma* (prompt) sifatida biror **yo‘riqnoma** yuborishingiz mumkin.

#### Misol:
```ts
await ctx.reply("Chat tarixini tozalash uchun quyidagi tugmani bosing:", {
  reply_markup: {
    keyboard: [[{ text: "🧹 Chatni qanday tozalash mumkin?" }]],
    resize_keyboard: true,
    one_time_keyboard: true
  }
});
```

Keyin, foydalanuvchi shu tugmani bosganda, siz unga yo‘riqnoma yuborasiz:

```ts
if (ctx.message.text === "🧹 Chatni qanday tozalash mumkin?") {
  await ctx.reply(
    `Chat tarixini tozalash uchun Telegram ilovasida:\n\n` +
    `1. Chatni oching\n` +
    `2. Yuqoridagi 3 nuqta yoki profilga bosing\n` +
    `3. "Clear chat history" yoki "Delete chat" tugmasini tanlang`
  );
}
```

---

### ✨ Qo‘shimcha G‘oya (inline button bilan):

Siz **inline keyboard** orqali ham yo‘riqnoma berishingiz mumkin:

```ts
await ctx.reply("Chatni tozalashni xohlaysizmi?", {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Tozalash bo‘yicha yo‘riqnoma", callback_data: "clear_help" }]
    ]
  }
});
```

Keyin callback handlerda:

```ts
@Action("clear_help")
async onClearHelp(@Ctx() ctx: Context) {
  await ctx.answerCbQuery();
  await ctx.reply(
    "Chat tarixini o‘chirish uchun Telegram ilovasida chatni oching va 'Clear chat history' tugmasini tanlang."
  );
}
```

---

### 🧠 Xulosa:

| Narsa                         | Mumkinmi? | Izoh |
|------------------------------|-----------|------|
| `request_contact` kabi `request_clear_chat` | ❌ Yo‘q     | Telegram ruxsat bermaydi |
| Tugma orqali tozalashni boshlatish        | ❌ Yo‘q     | Faqat foydalanuvchi o‘zi bajara oladi |
| Tugma orqali yo‘riqnoma berish             | ✅ Ha      | Juda samarali alternativ |

---

Agar sizga tozalashga oid klaviatura interfeysini chiroyli qilishda yordam kerak bo‘lsa, tayyor kod bilan beraman. Shu variantni qurasizmi?

---

### 👤 Foydalanuvchi:

Aynan userning chatiga tegishli messagelarning id larini qandaya olalaman

### 🤖 ChatGPT:

Telegram Bot API orqali **foydalanuvchi bilan bot o‘rtasidagi suhbatdagi barcha xabar IDlarini avtomatik tarzda olishning iloji yo‘q**. Ammo siz:

### ✅ Har bir kelgan va yuborilgan xabarning `message_id`sini real vaqtda olish va saqlab borishingiz mumkin.

---

### 💡 Foydalanuvchi yuborgan xabarni qanday olish mumkin?

Har bir `text` yoki `contact` yoki boshqa xabarni ushlaganingizda `ctx.message.message_id` orqali xabar ID’ni olasiz:

```ts
@On("text")
async onText(@Ctx() ctx: Context) {
  const messageId = ctx.message.message_id;
  const fromId = ctx.from.id;

  console.log(`User ${fromId} sent message ID: ${messageId}`);

  // Xabar ID’ni saqlang (masalan, DB yoki arrayga)
}
```

---

### 🧾 Misol: Xabar ID’larni array’da vaqtincha saqlash

```ts
const userMessages = new Map<number, number[]>();

@On("text")
async onText(@Ctx() ctx: Context) {
  const userId = ctx.from.id;
  const messageId = ctx.message.message_id;

  if (!userMessages.has(userId)) {
    userMessages.set(userId, []);
  }

  userMessages.get(userId).push(messageId);

  // Keyinchalik "Clear" komandasi kelganda o‘chirasiz:
  if (ctx.message.text === "Clear") {
    const ids = userMessages.get(userId) || [];
    for (const id of ids) {
      try {
        await ctx.telegram.deleteMessage(userId, id);
      } catch (e) {
        console.log(`Xabarni o‘chirishda xatolik: ${e.message}`);
      }
    }
    userMessages.set(userId, []);
    await ctx.reply("Xabarlaringiz tozalandi.");
  }
}
```

> ❗ Diqqat: bu usul **faqat bot o‘zi yuborgan xabarlarni o‘chiradi**, foydalanuvchi yuborganlarini emas (Telegram cheklovi).

---

### 🤖 Agar siz bot yuborgan xabarlarni ham kuzatmoqchi bo‘lsangiz:

```ts
const msg = await ctx.reply("Bu test xabar");
const messageId = msg.message_id;

// Saqlang, keyinchalik o‘chirish uchun
```

---

### 🧠 Xulosa

| Maqsad                          | Mumkinmi? | Izoh |
|-------------------------------|-----------|------|
| Foydalanuvchi yuborgan xabar ID’ni olish | ✅ Ha       | `ctx.message.message_id` orqali |
| Bot yuborgan xabar ID’ni olish          | ✅ Ha       | `ctx.reply()` natijasidan |
| Chatdagi barcha eski xabar ID’ni olish  | ❌ Yo‘q     | Telegram API bunday imkoniyat bermaydi |
| Foydalanuvchi yuborgan xabarni o‘chirish | ❌ Yo‘q     | Private chatda faqat foydalanuvchi o‘chiradi |

---

Agar sizga bu xabar ID’larni saqlashni doimiy (masalan, Redis yoki Prisma DB) qilish kerak bo‘lsa — kod namunalarini beraman. Shu yo‘nalishda davom etamizmi?

---

### 👤 Foydalanuvchi:

/home/fayzillo/Desktop/New Folder/trenijor/telegram/node_modules/telegraf/lib/core/network/client.js:315
            throw new error_1.default(data, { method, payload });
                  ^

TelegramError: 400: Bad Request: message to delete not found
    at Telegram.callApi (/home/fayzillo/Desktop/New Folder/trenijor/telegram/node_modules/telegraf/lib/core/network/client.js:315:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  response: {
    ok: false,
    error_code: 400,
    description: 'Bad Request: message to delete not found'
  },
  on: {
    method: 'deleteMessage',
    payload: { chat_id: 7463402937, message_id: 1 }
  }
}

Node.js v22.17.0

### 🤖 ChatGPT:

Siz olgan xatolik quyidagini anglatadi:

> ❌ **`TelegramError: 400: Bad Request: message to delete not found`**

Bu xato **`ctx.telegram.deleteMessage(chat_id, message_id)`** chaqiruvining noto‘g‘ri bajarilganidan darak beradi.

---

### 📌 Xatolik sabablari va yechimlari:

#### 1. **message_id mavjud emas yoki noto‘g‘ri**
> Xato: `message_id: 1`

- Bu ID Telegram’da mavjud xabarga tegishli emas.
- `message_id` faqat sizning bot yuborgan xabaringiz uchun to‘g‘ri bo‘lishi kerak.
- Agar foydalanuvchi yuborgan xabarni o‘chirmoqchi bo‘lsangiz — **Telegram buni ruxsat bermaydi** (private chatda).

**✅ Yechim:**
Bot **o‘zi yuborgan xabar** quyidagicha olinadi:

```ts
const sent = await ctx.reply("Salom");
console.log(sent.message_id); // Shu ID’ni o‘chirish mumkin
await ctx.telegram.deleteMessage(ctx.chat.id, sent.message_id);
```

---

#### 2. **Xabar allaqachon o‘chirilgan yoki muddati o‘tgan**
> Telegram botlar faqat **48 soat** ichidagi o‘zlari yuborgan xabarlarni o‘chira oladi.

---

#### 3. **Bot yuborgan emas**
Bot faqat **o‘zi yuborgan xabarlarni** o‘chira oladi.
Foydalanuvchi yuborgan xabarlar:
```ts
ctx.message.message_id // ❌ Bu ID bo‘yicha o‘chirish ishlamaydi
```

---

### ✅ To‘g‘ri ishlaydigan namunaviy kod:

```ts
@On("text")
async onText(@Ctx() ctx: Context) {
  const msg = await ctx.reply("Bu xabar 3 soniyada o'chiriladi");

  setTimeout(async () => {
    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id);
    } catch (err) {
      console.error("Xabarni o‘chirishda xatolik:", err);
    }
  }, 3000);
}
```

---

### 📦 Bonus: Faqat o‘z yuborganlarini saqlash

```ts
const sentMessageIds = new Map<number, number[]>(); // userId -> [message_id]

const sent = await ctx.reply("Salom");
const userId = ctx.from.id;

if (!sentMessageIds.has(userId)) sentMessageIds.set(userId, []);
sentMessageIds.get(userId).push(sent.message_id);
```

Keyin, `Clear` kelganda:

```ts
const ids = sentMessageIds.get(userId) || [];
for (const id of ids) {
  try {
    await ctx.telegram.deleteMessage(ctx.chat.id, id);
  } catch (err) {
    console.log("O‘chirib bo‘lmadi:", err.message);
  }
}
sentMessageIds.set(userId, []);
```

---

Agar xohlasangiz, **`/start` bosilganda barcha eski xabarlarni avtomatik tozalash** bo‘yicha modul ham yozib beraman.

Sizda ayni damda `message_id: 1` noto‘g‘ri ishlatilgan — uni bot yuborgan xabardan dinamik ravishda olish kerak. Shu bo‘yicha davom etamizmi?

---

