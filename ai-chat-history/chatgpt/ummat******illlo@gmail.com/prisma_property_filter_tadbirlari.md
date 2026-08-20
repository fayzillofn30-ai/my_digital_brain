# Prisma Property Filter Tadbirlari

### 👤 Foydalanuvchi:


  async findAll(ownerId?: string | undefined, search?: Partial<Property>) {

    const query: Partial<Omit<Property, "features">> = {}

    if (ownerId) {
      query.ownerId = ownerId
    }

    if (search) {
      Object.keys(search).forEach(key => {
        query[key] = ["price","discount"].includes(search[key]) ? parseInt(search[key]) : search[key]
      })
    }

    const data = Object.values(query) ? await this.prisma.property.findMany({where : {...query}, select : propertyEntities}) : await this.prisma.property.findMany({select : propertyEntities})

    return {
      message: `This action returns all properties`,
      data
    };
  }

### 🤖 ChatGPT:

Men ko‘ryapman, siz `findAll` funksiyada `Prisma` orqali propertylarni filterlashni qilyapsiz, lekin kodda bir nechta muammo bor:  

### Muammolar:
1. **`Object.values(query)` shart noto‘g‘ri ishlatilgan**  
   `Object.values(query)` doim `[]` qaytaradi, agar `query` bo‘sh bo‘lsa ham. Bu JS-da truthy hisoblanadi, shuning uchun `else` hech qachon ishlamaydi.  

   👉 To‘g‘ri yo‘li: `Object.keys(query).length > 0`

2. **`search[key]` ustida tekshiruv**  
   Siz `["price", "discount"].includes(search[key])` yozgansiz, lekin bu noto‘g‘ri. Siz `key`ni solishtirishingiz kerak, `search[key]`ni emas.  

   👉 To‘g‘ri yo‘li:  
   ```ts
   if (["price", "discount"].includes(key)) {
     query[key] = parseInt(search[key] as any)
   } else {
     query[key] = search[key]
   }
   ```

3. **TypeScript `query[key]` muammo**  
   `Partial<Omit<Property, "features">>` tipi bilan ishlaganda `query[key]` xatolik berishi mumkin, chunki `key` `string` bo‘lib, TypeScript uchun `Property` kalitlariga to‘g‘ri kelishini kafolatlamaydi. Buni `as keyof Property` bilan hal qilasiz.

---

### Tuzatilgan versiya:
```ts
async findAll(ownerId?: string, search?: Partial<Property>) {
  const query: Partial<Omit<Property, "features">> = {};

  if (ownerId) {
    query.ownerId = ownerId;
  }

  if (search) {
    Object.keys(search).forEach((key) => {
      const typedKey = key as keyof Property;
      if (["price", "discount"].includes(key)) {
        query[typedKey] = parseInt(search[typedKey] as any);
      } else {
        query[typedKey] = search[typedKey];
      }
    });
  }

  const data =
    Object.keys(query).length > 0
      ? await this.prisma.property.findMany({
          where: { ...query },
          select: propertyEntities,
        })
      : await this.prisma.property.findMany({
          select: propertyEntities,
        });

  return {
    message: `This action returns all properties`,
    data,
  };
}
```

---

❓ Savol: Siz `search`ni faqat `=` (exact match) bo‘yicha qilyapsizmi yoki `LIKE`/`contains` qidiruv ham kerak bo‘ladimi (masalan, title bo‘yicha qidirish)?  
Shunga qarab men `prisma`da `contains` qo‘shib berishim mumkin.

---

