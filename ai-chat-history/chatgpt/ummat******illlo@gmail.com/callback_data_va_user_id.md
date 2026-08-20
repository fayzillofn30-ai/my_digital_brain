# Callback data va user ID

### 👤 Foydalanuvchi:

export const adminActionsKeyvords = (data: userResponseEntity) => {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Delete user", callback_data: `delete_user` },
                    { text: "Update user", callback_data: `update_user` }
                ]
            ]
        }
    }
}

    @Action(/update_user/)
    async checkActionsAdmin(@Ctx() ctx: Context) {
        try {
            // Extract user_id from callback_data if present
            // @ts-ignore
            const callbackData = ctx.callbackQuery?.data;
            // Example: callback_data: "update_user:12345"
            let userId: string | undefined;
            if (callbackData && callbackData.startsWith("update_user:")) {
                userId = callbackData.split(":")[1];
            } else {
                userId = ctx.from?.id.toString();
            }

            ctx.reply(`User ID: ${userId}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Salom", callback_data: "salom_action" }]
                    ]
                }
            });
        } catch (error) {
            ctx.reply(error)
        }
    }


endi adminActions da data.user_id keyboardga birictirib action da olish

### 🤖 ChatGPT:

Agar siz `adminActionsKeyvords` funksiyasida `user_id` ma'lumotini `callback_data`ga biriktirmoqchi bo‘lsangiz, va uni `@Action(/update_user/)` handlerda olishni xohlasangiz, `callback_data` ni shu ko‘rinishda jo‘natishingiz kerak: `update_user:<user_id>`. Quyida kerakli o‘zgarishlar:

---

### ✅ 1. `adminActionsKeyvords` funksiyasini o‘zgartiring:

```ts
export const adminActionsKeyvords = (data: userResponseEntity) => {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Delete user", callback_data: `delete_user:${data.user_id}` },
                    { text: "Update user", callback_data: `update_user:${data.user_id}` }
                ]
            ]
        }
    }
}
```

---

### ✅ 2. `@Action(/update_user/)` funksiyasida `user_id` ni ajratish:

```ts
@Action(/update_user/)
async checkActionsAdmin(@Ctx() ctx: Context) {
    try {
        const callbackData = ctx.callbackQuery?.data; // Masalan: "update_user:12345"
        let userId: string | undefined;

        if (callbackData) {
            const [, id] = callbackData.split(":"); // ["update_user", "12345"]
            userId = id;
        }

        await ctx.reply(`User ID: ${userId}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Salom", callback_data: "salom_action" }]
                ]
            }
        });
    } catch (error) {
        console.error("Action Error", error);
        await ctx.reply("Xatolik yuz berdi");
    }
}
```

---

Shunda `callback_data` orqali yuborilgan `user_id` to‘g‘ridan-to‘g‘ri handlerga kiradi va siz uni ishlatishingiz mumkin bo‘ladi.

Agar xohlasangiz `delete_user` uchun ham xuddi shunday ishlov berish qo‘shamiz. Ayting, kerak bo‘lsa.

---

### 👤 Foydalanuvchi:

    @Action(/update_user/)
    async checkActionsAdminUpdate(@Ctx() ctx: Context) {
        try {
            const id = ctx.callbackQuery?.['data']?.split(":")[1];
            const messageId = ctx.message?.message_id
            const user = await this.userService.findByTelegramId(id)
            const result = await this.userService.updateUser(id,{role : !user?.role})
            console.log(ctx.message)
            /// @ts-ignore
            ctx.telegram.deleteMessage(id,messageId)
            // @ts-ignore
            ctx.reply(response(result),adminPanel)
        } catch (error) {
            ctx.reply(error)
        }
    }

### 🤖 ChatGPT:

Kodingizda ba'zi muhim joylarga aniqlik kiritish kerak, chunki quyidagi muammolar bor:

---

### ❗️Muammolar:

1. `ctx.message` mavjud bo‘lmaydi, chunki `@Action(...)` `callbackQuery` ustida ishlaydi — ya'ni `ctx.callbackQuery.message` dan foydalanish kerak.
2. `ctx.telegram.deleteMessage(id, messageId)` noto‘g‘ri: `id` bu yerda `user_id`, lekin kerakli narsa bu chat ID (`chat.id`) bo'lishi kerak.
3. `ctx.reply(...)` o‘rniga `ctx.telegram.sendMessage(...)` ishlatgan ma’qul, chunki `ctx.reply` kontekstni buzishi mumkin `callbackQuery`da.
4. `ctx.reply(error)` — bu `error` obyektni string emas. Uni `String(error)` yoki `console.error(error)` qilish kerak.

---

### ✅ To‘g‘rilangan versiya:

```ts
@Action(/update_user/)
async checkActionsAdminUpdate(@Ctx() ctx: Context) {
    try {
        const callbackData = ctx.callbackQuery?.data; // "update_user:12345"
        const id = callbackData?.split(":")[1]; // foydalanuvchi ID

        const chatId = ctx.callbackQuery?.message?.chat.id;
        const messageId = ctx.callbackQuery?.message?.message_id;

        const user = await this.userService.findByTelegramId(id);
        const result = await this.userService.updateUser(id, {
            role: !user?.role
        });

        if (chatId && messageId) {
            await ctx.telegram.deleteMessage(chatId, messageId);
        }

        await ctx.telegram.sendMessage(chatId, response(result), adminPanel);

    } catch (error) {
        console.error(error);
        await ctx.reply('Xatolik yuz berdi');
    }
}
```

---

### Qo‘shimcha maslahat:

Agar siz `adminPanel` degan `reply_markup` obyektni ko‘p joyda ishlatsangiz — uni alohida modulda `export` qilib saqlagan yaxshi.

---

Agar `delete_user` uchun ham shunaqa funksiyani yozmoqchi bo‘lsangiz, ayting — tayyorlab beraman.

---

