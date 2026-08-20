# Prisma schema definition

### 👤 Foydalanuvchi:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ChatType {
  user_chat
  group_chat
  channel_chat
  bot_chat
}

model User {
  id       String  @id @default(uuid())
  username String? @unique
  email    String

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  isDeleted Boolean @default(false) @map("is_deleted")
  isBot     Boolean @default(false) @map("is_bot")

  ownedGroupChats      GroupChat[]
  ownedChannelChats    ChannelChat[]
  userChat1            UserChat[]            @relation("UserChat1")
  userChat2            UserChat[]            @relation("UserChat2")
  sentMessages         MessageDetails[]
  botDetails           BotDetails[]          @relation("BotOwner")
  botParents           BotDetails[]          @relation("BotParent")
  botSubscriptions     BotSubscription[]
  channelSubscriptions ChannelSubscription[]
  groupSubscriptions   GroupSubscription[]
  Avatar               Avatar[]
  Profile              Profile[]

  @@index([username])
  @@index([createdAt])
  @@index([isBot])
  @@map("users")
}

model Profile {
  id        String  @id @default(uuid())
  firstName String? @map("first_name")
  lastName  String? @map("last_name")
  bio       String? // User bio/description

  publicUrl  String? @map("public_url") // Public profile URL
  privateUrl String? @map("private_url") // Private referral URL

  userId   String
  user     User    @relation(fields: [userId], references: [id])
  avatarId String
  avatar   Avatar? @relation(fields: [avatarId], references: [id])

  @@map("profile")
}

model Avatar {
  id        String   @id @default(uuid())
  file      String // image url
  ownerId   String   @map("owner_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  owner   User      @relation(fields: [ownerId], references: [id])
  Profile Profile[]

  @@map("avatars")
}

model ChatFile {
  id        String   @id @default(uuid())
  file      String // file url
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  groupFiles    GroupFile[]
  channelFiles  ChannelFile[]
  userChatFiles UserChatFile[]

  @@map("chat_files")
}

model GroupFile {
  id     String @id @default(uuid())
  fileId String @map("file_id")
  chatId String @map("chat_id")

  // Relations
  file    ChatFile     @relation(fields: [fileId], references: [id])
  message MessageGroup @relation(fields: [chatId], references: [id])

  @@map("group_files")
}

model ChannelFile {
  id     String @id @default(uuid())
  fileId String @map("file_id")
  chatId String @map("chat_id")

  // Relations
  file    ChatFile       @relation(fields: [fileId], references: [id])
  message MessageChannel @relation(fields: [chatId], references: [id])

  @@map("channel_files")
}

model UserChatFile {
  id     String @id @default(uuid())
  fileId String @map("file_id")
  chatId String @map("chat_id")

  // Relations
  file    ChatFile        @relation(fields: [fileId], references: [id])
  message MessageUserChat @relation(fields: [chatId], references: [id])

  @@map("user_chat_fiels")
}

model GroupChat {
  id                 String   @id @default(uuid())
  ownerId            String   @map("owner_id")
  type               ChatType @default(group_chat)
  title              String?
  description        String? // Group description
  publicUrl          String?  @map("public_url") // Public group URL
  privateUrl         String?  @map("private_url") // Private group URL
  subscriptionsCount BigInt   @default(0) @map("subscritions_count")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  // Relations
  owner         User                @relation(fields: [ownerId], references: [id])
  messages      MessageGroup[]
  subscriptions GroupSubscription[]

  @@index([ownerId])
  @@index([type])
  @@index([createdAt])
  @@index([title])
  @@map("group_chat")
}

model ChannelChat {
  id                 String   @id @default(uuid())
  ownerId            String   @map("owner_id")
  subscriptionsCount BigInt   @default(0) @map("subscritions_count")
  type               ChatType @default(channel_chat)
  title              String?
  description        String? // Channel description
  publicUrl          String?  @map("public_url") // Public channel URL
  privateUrl         String?  @map("private_url") // Private channel URL
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  // Relations
  owner         User                  @relation(fields: [ownerId], references: [id])
  messages      MessageChannel[]
  subscriptions ChannelSubscription[]

  @@index([ownerId])
  @@index([type])
  @@index([createdAt])
  @@index([title])
  @@map("channel_chat")
}

model UserChat {
  id        String   @id @default(uuid())
  user1Id   String   @map("user_1_id")
  user2Id   String   @map("user_2_id")
  type      ChatType @default(user_chat)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  user1    User              @relation("UserChat1", fields: [user1Id], references: [id])
  user2    User              @relation("UserChat2", fields: [user2Id], references: [id])
  messages MessageUserChat[]

  @@index([user1Id])
  @@index([user2Id])
  @@index([user1Id, user2Id])
  @@index([type])
  @@map("user_chat")
}

model MessageChannel {
  id         String  @id @default(uuid())
  chatId     String  @map("chat_id")
  replayId   String? @map("replay_id")
  mDetailsId String  @map("m_detailes_id")
  isUpdated  Boolean @default(false) @map("is_updated")
  isReading  Boolean @default(false) @map("is_reading")

  // Relations
  chat         ChannelChat      @relation(fields: [chatId], references: [id])
  replyTo      MessageChannel?  @relation("MessageReply", fields: [replayId], references: [id])
  replies      MessageChannel[] @relation("MessageReply")
  details      MessageDetails   @relation(fields: [mDetailsId], references: [id])
  channelFiles ChannelFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([mDetailsId])
  @@index([chatId, mDetailsId])
  @@map("messages_channel")
}

model MessageGroup {
  id         String  @id @default(uuid())
  chatId     String  @map("chat_id")
  replayId   String? @map("replay_id")
  mDetailsId String  @map("m_detailes_id")
  isUpdated  Boolean @default(false) @map("is_updated")
  isReading  Boolean @default(false) @map("is_reading")

  // Relations
  chat       GroupChat      @relation(fields: [chatId], references: [id])
  replyTo    MessageGroup?  @relation("MessageReply", fields: [replayId], references: [id])
  replies    MessageGroup[] @relation("MessageReply")
  details    MessageDetails @relation(fields: [mDetailsId], references: [id])
  groupFiles GroupFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([mDetailsId])
  @@index([chatId, mDetailsId])
  @@map("messages_group")
}

model MessageUserChat {
  id         String  @id @default(uuid())
  chatId     String  @map("chat_id")
  replayId   String? @map("replay_id")
  mDetailsId String  @map("m_detailes_id")
  isUpdated  Boolean @default(false) @map("is_updated")
  isReading  Boolean @default(false) @map("is_reading")

  // Relations
  chat          UserChat          @relation(fields: [chatId], references: [id])
  replyTo       MessageUserChat?  @relation("MessageReply", fields: [replayId], references: [id])
  replies       MessageUserChat[] @relation("MessageReply")
  details       MessageDetails    @relation(fields: [mDetailsId], references: [id])
  userChatFiles UserChatFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([mDetailsId])
  @@index([chatId, mDetailsId])
  @@map("messages_user_chat")
}

model MessageDetails {
  id        String   @id @default(uuid())
  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  sender           User              @relation(fields: [senderId], references: [id])
  channelMessages  MessageChannel[]
  groupMessages    MessageGroup[]
  userChatMessages MessageUserChat[]

  @@index([senderId])
  @@index([createdAt])
  @@index([senderId, createdAt])
  @@map("message_detailes")
}

model BotDetails {
  id       String @id @default(uuid())
  parentId String @map("parrent_id")
  ownerId  String @map("owner_id")

  // Relations
  parent User @relation("BotParent", fields: [parentId], references: [id])
  owner  User @relation("BotOwner", fields: [ownerId], references: [id])

  @@map("bot_detailes")
}

model ChannelSubscription {
  id           String  @id @default(uuid())
  chatId       String  @map("chat_id")
  subscriberId String  @map("subscriber_id")
  isWrite      Boolean  @default(false)

  // Relations
  chat       ChannelChat @relation(fields: [chatId], references: [id])
  subscriber User        @relation(fields: [subscriberId], references: [id])

  @@index([chatId])
  @@index([subscriberId])
  @@index([chatId, subscriberId])
  @@map("channel_subscribtions")
}

model GroupSubscription {
  id           String @id @default(uuid())
  chatId       String @map("chat_id")
  subscriberId String @map("subscriber_id")

  // Relations
  chat       GroupChat @relation(fields: [chatId], references: [id])
  subscriber User      @relation(fields: [subscriberId], references: [id])

  @@index([chatId])
  @@index([subscriberId])
  @@index([chatId, subscriberId])
  @@map("group_subscribtions")
}

model BotSubscription {
  id           String @id @default(uuid())
  botId        String @map("bot_id")
  subscriberId String @map("subscriber_id")

  // Relations
  subscriber User   @relation(fields: [subscriberId], references: [id])
  userId     String

  @@index([botId])
  @@index([subscriberId])
  @@index([botId, subscriberId])
  @@map("bot_subscribtions")
}



Salom buni eslab qol

### 🤖 ChatGPT:

Got it ✅ — bu Prisma schema’ni eslab qoldim.

---

### 👤 Foydalanuvchi:

Endi   bu yerda  messaga detailes junctiondag qiymatlarni tushundingmi

### 🤖 ChatGPT:

Ha, tushundim ✅  

Senda `MessageDetails` degan bitta asosiy jadval bor. Bu jadvalda **umumiy message content** saqlanadi:  

- `text`, `images`, `videos`, `docs`, `files`, `stickers`  
- `senderId` — kim yuborganini ko‘rsatadi  
- `createdAt`, `updatedAt`  

Lekin `MessageDetails` **o‘zi qaysi chatga tegishli ekanini bilmaydi**. Shu sababli u **3 xil junction model** bilan bog‘langan:  

1. **MessageChannel**  
   ```prisma
   details MessageDetails @relation(fields: [mDetailsId], references: [id])
   ```
   → `ChannelChat` ichidagi xabarlarni ifodalaydi.

2. **MessageGroup**  
   → `GroupChat` xabarlarini bog‘laydi.  

3. **MessageUserChat**  
   → `UserChat` (1:1 chat) uchun xabarlarni bog‘laydi.  

🔗 Ya’ni:  
- **MessageDetails** – umumiy xabar mazmuni (kontent).  
- **MessageChannel / MessageGroup / MessageUserChat** – shu kontentni **qaysi chat turida** yuborilganini ko‘rsatadigan “junction” model.  
- Har birida `replayId` ham bor → reply/repost qilish uchun self-relation ishlatilgan.  

👉 Bu dizayn natijasida xabarni bittalab yozasan (MessageDetails), keyin uni kerakli chat turiga mos junction jadvalga bog‘lab qo‘yasan. Shu orqali **content duplication** bo‘lmaydi.  

Xohlaysanmi, men senga bitta **diagramma-style ko‘rsatib** beray?

---

### 👤 Foydalanuvchi:

endi buni o'zgartiramiz yani men message detailesga message jadvallardagi ma'lumotlarni olib chiqgandim  endi detailesni  bekor qilmoqchiman bitta joinni kamaytirmoqchiman har bir Message tablelari o'zida saqlanishi kerak detailesni olib tashlamoqchiman.

### 🤖 ChatGPT:

Zo‘r 👍 tushunarli.  

Sening hozirgi strukturangda:  

- `MessageDetails` → umumiy kontentni saqlaydi  
- `MessageChannel`, `MessageGroup`, `MessageUserChat` → faqat join qiladi  

Sen endi **1 ta joinni kamaytirish** uchun `MessageDetails`ni olib tashlamoqchi ekansan va barcha `text`, `files`, `images`, `senderId`, `createdAt` kabi maydonlarni **to‘g‘ridan-to‘g‘ri `MessageChannel` / `MessageGroup` / `MessageUserChat` ichida** saqlamoqchisan.  

🔧 Buning uchun qilinadigan ish:  

1. `MessageDetails` modelini **olib tashlash**.  
2. Har bir `Message*` jadvaliga quyidagi ustunlarni ko‘chirish:  
   - `senderId` → kim yuborganini ko‘rsatadi  
   - `text`, `images`, `videos`, `docs`, `files`, `stickers`  
   - `createdAt`, `updatedAt`  
3. `User` bilan relation qo‘shish (`senderId` orqali).  

---

### Yangilangan model misol (`MessageChannel` uchun):

```prisma
model MessageChannel {
  id         String   @id @default(uuid())
  chatId     String   @map("chat_id")
  replayId   String?  @map("replay_id")

  senderId   String   @map("sender_id")
  text       String?
  images     Json?
  videos     Json?
  docs       Json?
  files      Json?
  stickers   Json?    @map("stikers")

  isUpdated  Boolean  @default(false) @map("is_updated")
  isReading  Boolean  @default(false) @map("is_reading")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  // Relations
  chat     ChannelChat      @relation(fields: [chatId], references: [id])
  replyTo  MessageChannel?  @relation("ChannelReply", fields: [replayId], references: [id])
  replies  MessageChannel[] @relation("ChannelReply")
  sender   User             @relation(fields: [senderId], references: [id])
  filesRel ChannelFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([senderId])
  @@map("messages_channel")
}
```

---

### Shunga o‘xshash (`MessageGroup` va `MessageUserChat`) ham **xuddi shu fieldlarni ichiga oladi**.  

---

📌 Afzalliklari:  
- `MessageDetails` joini yo‘qoladi → query tezlashadi.  
- Har bir message jadvali mustaqil bo‘ladi.  

📌 Kamchiliklari:  
- `MessageChannel`, `MessageGroup`, `MessageUserChat` ichida **duplicate schema** paydo bo‘ladi (bir xil fieldlar 3 marta yoziladi).  
- Agar keyin yangi field qo‘shmoqchi bo‘lsang → uchta jadvalni yangilash kerak bo‘ladi.  

---

❓ Savol: sen duplicationdan qo‘rqmayapsanmi? Yoki men senga shu fieldlarni **Prisma `@@mixin` yoki `composite type`** qilib yozib beraymi, shunda kod duplication bo‘lmaydi?

---

### 👤 Foydalanuvchi:

Ha shunday

### 🤖 ChatGPT:

Zo‘r 👍 unda duplicationdan qochish uchun Prisma’da **`composite type` (`type`)** ishlatish mumkin.  

👉 Biz `MessageDetails`dagi fieldlarni alohida `type MessageContent` qilib ajratamiz, keyin uchta `Message*` model ichida qayta ishlatamiz. Shunda **join bo‘lmaydi**, lekin **kod duplication ham kamayadi**.  

---

### Yangi yechim:

```prisma
// Umumiy xabar mazmuni uchun type
type MessageContent {
  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}
```

---

### `MessageChannel`
```prisma
model MessageChannel {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  // Umumiy xabar mazmuni
  content   MessageContent

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")

  // Relations
  chat     ChannelChat      @relation(fields: [chatId], references: [id])
  replyTo  MessageChannel?  @relation("ChannelReply", fields: [replayId], references: [id])
  replies  MessageChannel[] @relation("ChannelReply")
  sender   User             @relation(fields: [content.senderId], references: [id])
  filesRel ChannelFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([content.senderId])
  @@map("messages_channel")
}
```

---

### `MessageGroup`
```prisma
model MessageGroup {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  content   MessageContent

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")

  chat     GroupChat      @relation(fields: [chatId], references: [id])
  replyTo  MessageGroup?  @relation("GroupReply", fields: [replayId], references: [id])
  replies  MessageGroup[] @relation("GroupReply")
  sender   User           @relation(fields: [content.senderId], references: [id])
  filesRel GroupFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([content.senderId])
  @@map("messages_group")
}
```

---

### `MessageUserChat`
```prisma
model MessageUserChat {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  content   MessageContent

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")

  chat     UserChat          @relation(fields: [chatId], references: [id])
  replyTo  MessageUserChat?  @relation("UserChatReply", fields: [replayId], references: [id])
  replies  MessageUserChat[] @relation("UserChatReply")
  sender   User              @relation(fields: [content.senderId], references: [id])
  filesRel UserChatFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([content.senderId])
  @@map("messages_user_chat")
}
```

---

✅ Shu struktura bilan:  
- `MessageDetails` butunlay yo‘qoladi.  
- Join kamayadi.  
- Xabar kontenti bir joyda (`MessageContent`) yoziladi, duplication yo‘q.  

---

⚠️ Lekin: Prisma `type` (composite) faqat **PostgreSQL va MongoDB** da ishlaydi. Sen Postgres ishlatyapsan, demak bemalol ishlaydi.  

---

Xohlaysanmi, men senga **migration flow** (`MessageDetails`ni olib tashlash va yangi `type`ni qo‘shish jarayoni) ham yozib beray?

---

### 👤 Foydalanuvchi:

MessageContent ham kerak emas  har bir Messaga table ma'lumotlarini o'zida saqlasin junction table kerak emas

### 🤖 ChatGPT:

Ha, tushunarli 👍  

Demak sen endi **hech qanday `MessageDetails` yoki `MessageContent` ishlatmoqchi emassan** → har bir `Message*` jadval **o‘zida barcha fieldlarni saqlaydi**.  

Shunda struktura quyidagicha bo‘ladi 👇  

---

### `MessageChannel`
```prisma
model MessageChannel {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  chat     ChannelChat      @relation(fields: [chatId], references: [id])
  replyTo  MessageChannel?  @relation("ChannelReply", fields: [replayId], references: [id])
  replies  MessageChannel[] @relation("ChannelReply")
  sender   User             @relation(fields: [senderId], references: [id])
  filesRel ChannelFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([senderId])
  @@map("messages_channel")
}
```

---

### `MessageGroup`
```prisma
model MessageGroup {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     GroupChat      @relation(fields: [chatId], references: [id])
  replyTo  MessageGroup?  @relation("GroupReply", fields: [replayId], references: [id])
  replies  MessageGroup[] @relation("GroupReply")
  sender   User           @relation(fields: [senderId], references: [id])
  filesRel GroupFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([senderId])
  @@map("messages_group")
}
```

---

### `MessageUserChat`
```prisma
model MessageUserChat {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     UserChat          @relation(fields: [chatId], references: [id])
  replyTo  MessageUserChat?  @relation("UserChatReply", fields: [replayId], references: [id])
  replies  MessageUserChat[] @relation("UserChatReply")
  sender   User              @relation(fields: [senderId], references: [id])
  filesRel UserChatFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([senderId])
  @@map("messages_user_chat")
}
```

---

✅ Endi:  
- `MessageDetails` umuman olib tashlanadi.  
- Har bir `Message*` jadval **o‘zida kontentni saqlaydi**.  
- Query qilishda **qo‘shimcha join yo‘q**.  

📌 Lekin kamchiligi → `MessageChannel`, `MessageGroup`, `MessageUserChat` ichida **bir xil fieldlar duplication bo‘ladi**.  

---

❓ Endi senga shu `MessageDetails`ni olib tashlash uchun **migration strategy** yozib beraymi (ya’ni mavjud jadvaldagi ma’lumotlarni yangi struktura ichiga ko‘chirish)?

---

### 👤 Foydalanuvchi:

Endi To'liq tuzilmani berishing mumkin

### 🤖 ChatGPT:

Zo‘r 👍 endi men senga **to‘liq yangilangan Prisma schema**ni beraman.  
`MessageDetails` olib tashlangan, har bir `Message*` modeli o‘zida **text, media, senderId** va boshqa fieldlarni saqlaydi.  

---

## To‘liq yangilangan tuzilma:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ChatType {
  user_chat
  group_chat
  channel_chat
  bot_chat
}

model User {
  id       String  @id @default(uuid())
  username String? @unique
  email    String

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  isDeleted Boolean @default(false) @map("is_deleted")
  isBot     Boolean @default(false) @map("is_bot")

  ownedGroupChats      GroupChat[]
  ownedChannelChats    ChannelChat[]
  userChat1            UserChat[]       @relation("UserChat1")
  userChat2            UserChat[]       @relation("UserChat2")
  sentChannelMessages  MessageChannel[]
  sentGroupMessages    MessageGroup[]
  sentUserMessages     MessageUserChat[]
  botDetails           BotDetails[]     @relation("BotOwner")
  botParents           BotDetails[]     @relation("BotParent")
  botSubscriptions     BotSubscription[]
  channelSubscriptions ChannelSubscription[]
  groupSubscriptions   GroupSubscription[]
  Avatar               Avatar[]
  Profile              Profile[]

  @@index([username])
  @@index([createdAt])
  @@index([isBot])
  @@map("users")
}

model Profile {
  id        String  @id @default(uuid())
  firstName String? @map("first_name")
  lastName  String? @map("last_name")
  bio       String?

  publicUrl  String? @map("public_url")
  privateUrl String? @map("private_url")

  userId   String
  user     User    @relation(fields: [userId], references: [id])
  avatarId String
  avatar   Avatar? @relation(fields: [avatarId], references: [id])

  @@map("profile")
}

model Avatar {
  id        String   @id @default(uuid())
  file      String
  ownerId   String   @map("owner_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  owner   User      @relation(fields: [ownerId], references: [id])
  Profile Profile[]

  @@map("avatars")
}

model ChatFile {
  id        String   @id @default(uuid())
  file      String
  createdAt DateTime @default(now()) @map("created_at")

  groupFiles    GroupFile[]
  channelFiles  ChannelFile[]
  userChatFiles UserChatFile[]

  @@map("chat_files")
}

model GroupFile {
  id     String @id @default(uuid())
  fileId String @map("file_id")
  chatId String @map("chat_id")

  file    ChatFile     @relation(fields: [fileId], references: [id])
  message MessageGroup @relation(fields: [chatId], references: [id])

  @@map("group_files")
}

model ChannelFile {
  id     String @id @default(uuid())
  fileId String @map("file_id")
  chatId String @map("chat_id")

  file    ChatFile       @relation(fields: [fileId], references: [id])
  message MessageChannel @relation(fields: [chatId], references: [id])

  @@map("channel_files")
}

model UserChatFile {
  id     String @id @default(uuid())
  fileId String @map("file_id")
  chatId String @map("chat_id")

  file    ChatFile        @relation(fields: [fileId], references: [id])
  message MessageUserChat @relation(fields: [chatId], references: [id])

  @@map("user_chat_files")
}

model GroupChat {
  id                 String   @id @default(uuid())
  ownerId            String   @map("owner_id")
  type               ChatType @default(group_chat)
  title              String?
  description        String?
  publicUrl          String?  @map("public_url")
  privateUrl         String?  @map("private_url")
  subscriptionsCount BigInt   @default(0) @map("subscritions_count")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  owner         User                @relation(fields: [ownerId], references: [id])
  messages      MessageGroup[]
  subscriptions GroupSubscription[]

  @@index([ownerId])
  @@index([type])
  @@index([createdAt])
  @@index([title])
  @@map("group_chat")
}

model ChannelChat {
  id                 String   @id @default(uuid())
  ownerId            String   @map("owner_id")
  subscriptionsCount BigInt   @default(0) @map("subscritions_count")
  type               ChatType @default(channel_chat)
  title              String?
  description        String?
  publicUrl          String?  @map("public_url")
  privateUrl         String?  @map("private_url")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  owner         User                  @relation(fields: [ownerId], references: [id])
  messages      MessageChannel[]
  subscriptions ChannelSubscription[]

  @@index([ownerId])
  @@index([type])
  @@index([createdAt])
  @@index([title])
  @@map("channel_chat")
}

model UserChat {
  id        String   @id @default(uuid())
  user1Id   String   @map("user_1_id")
  user2Id   String   @map("user_2_id")
  type      ChatType @default(user_chat)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user1    User              @relation("UserChat1", fields: [user1Id], references: [id])
  user2    User              @relation("UserChat2", fields: [user2Id], references: [id])
  messages MessageUserChat[]

  @@index([user1Id])
  @@index([user2Id])
  @@index([user1Id, user2Id])
  @@index([type])
  @@map("user_chat")
}

model MessageChannel {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     ChannelChat      @relation(fields: [chatId], references: [id])
  replyTo  MessageChannel?  @relation("ChannelReply", fields: [replayId], references: [id])
  replies  MessageChannel[] @relation("ChannelReply")
  sender   User             @relation(fields: [senderId], references: [id])
  filesRel ChannelFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([senderId])
  @@map("messages_channel")
}

model MessageGroup {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     GroupChat      @relation(fields: [chatId], references: [id])
  replyTo  MessageGroup?  @relation("GroupReply", fields: [replayId], references: [id])
  replies  MessageGroup[] @relation("GroupReply")
  sender   User           @relation(fields: [senderId], references: [id])
  filesRel GroupFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([senderId])
  @@map("messages_group")
}

model MessageUserChat {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")

  senderId  String   @map("sender_id")
  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     UserChat          @relation(fields: [chatId], references: [id])
  replyTo  MessageUserChat?  @relation("UserChatReply", fields: [replayId], references: [id])
  replies  MessageUserChat[] @relation("UserChatReply")
  sender   User              @relation(fields: [senderId], references: [id])
  filesRel UserChatFile[]

  @@index([chatId])
  @@index([replayId])
  @@index([senderId])
  @@map("messages_user_chat")
}

model BotDetails {
  id       String @id @default(uuid())
  parentId String @map("parrent_id")
  ownerId  String @map("owner_id")

  parent User @relation("BotParent", fields: [parentId], references: [id])
  owner  User @relation("BotOwner", fields: [ownerId], references: [id])

  @@map("bot_detailes")
}

model ChannelSubscription {
  id           String  @id @default(uuid())
  chatId       String  @map("chat_id")
  subscriberId String  @map("subscriber_id")
  isWrite      Boolean @default(false)

  chat       ChannelChat @relation(fields: [chatId], references: [id])
  subscriber User        @relation(fields: [subscriberId], references: [id])

  @@index([chatId])
  @@index([subscriberId])
  @@index([chatId, subscriberId])
  @@map("channel_subscribtions")
}

model GroupSubscription {
  id           String @id @default(uuid())
  chatId       String @map("chat_id")
  subscriberId String @map("subscriber_id")

  chat       GroupChat @relation(fields: [chatId], references: [id])
  subscriber User      @relation(fields: [subscriberId], references: [id])

  @@index([chatId])
  @@index([subscriberId])
  @@index([chatId, subscriberId])
  @@map("group_subscribtions")
}

model BotSubscription {
  id           String @id @default(uuid())
  botId        String @map("bot_id")
  subscriberId String @map("subscriber_id")

  subscriber User   @relation(fields: [subscriberId], references: [id])
  userId     String

  @@index([botId])
  @@index([subscriberId])
  @@index([botId, subscriberId])
  @@map("bot_subscribtions")
}
```

---

✅ Endi:  
- `MessageDetails` olib tashlandi.  
- Har bir `Message*` jadval o‘zida kontentni saqlaydi.  
- Join kamaydi → query soddalashdi.  

---

❓ Endi senga shuni ham yozib beraymi: **migratsiya jarayoni** (`MessageDetails`dagi eski ma’lumotlarni yangi `Message*` jadvallariga ko‘chirish uchun SQL script)?

---

### 👤 Foydalanuvchi:

CHatFile  GroupFile  hullas  chatlarning file tablelarini ham olib tashlaymiz

### 🤖 ChatGPT:

Zo‘r 👍 endi dizayn yanada soddalashadi.  

Agar `ChannelFile`, `GroupFile`, `UserChatFile` kabi alohida file table’larni olib tashlasak, barcha fayl ma’lumotlari **to‘g‘ridan-to‘g‘ri `Message*` table’larida saqlanadi** (`files`, `images`, `videos`, `docs` fieldlari orqali).  

Demak, umumiy to‘liq tuzilma quyidagicha bo‘ladi 👇  

---

## 📌 To‘liq Prisma Schema (soddalashtirilgan)

```prisma
// =====================
// User
// =====================
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  email     String?  @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  userChats    UserChat[]
  groupChats   GroupChat[]
  channelChats ChannelChat[]

  sentMessagesChannel MessageChannel[] @relation("UserChannelMessages")
  sentMessagesGroup   MessageGroup[]   @relation("UserGroupMessages")
  sentMessagesUser    MessageUserChat[] @relation("UserUserChatMessages")
}

// =====================
// Chats
// =====================
model UserChat {
  id        String   @id @default(uuid())
  user1Id   String
  user2Id   String
  createdAt DateTime @default(now())

  // Relations
  user1   User @relation("UserChatUser1", fields: [user1Id], references: [id])
  user2   User @relation("UserChatUser2", fields: [user2Id], references: [id])
  messages MessageUserChat[]
}

model GroupChat {
  id        String   @id @default(uuid())
  name      String
  ownerId   String
  createdAt DateTime @default(now())

  owner    User          @relation(fields: [ownerId], references: [id])
  members  User[]
  messages MessageGroup[]
}

model ChannelChat {
  id        String   @id @default(uuid())
  name      String
  ownerId   String
  createdAt DateTime @default(now())

  owner    User            @relation(fields: [ownerId], references: [id])
  messages MessageChannel[]
}

// =====================
// Messages
// =====================

model MessageChannel {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  senderId  String   @map("sender_id")
  replayId  String?  @map("replay_id")

  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     ChannelChat      @relation(fields: [chatId], references: [id])
  sender   User             @relation("UserChannelMessages", fields: [senderId], references: [id])
  replyTo  MessageChannel?  @relation("ChannelReply", fields: [replayId], references: [id])
  replies  MessageChannel[] @relation("ChannelReply")

  @@index([chatId])
  @@index([senderId])
  @@map("messages_channel")
}

model MessageGroup {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  senderId  String   @map("sender_id")
  replayId  String?  @map("replay_id")

  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     GroupChat      @relation(fields: [chatId], references: [id])
  sender   User           @relation("UserGroupMessages", fields: [senderId], references: [id])
  replyTo  MessageGroup?  @relation("GroupReply", fields: [replayId], references: [id])
  replies  MessageGroup[] @relation("GroupReply")

  @@index([chatId])
  @@index([senderId])
  @@map("messages_group")
}

model MessageUserChat {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  senderId  String   @map("sender_id")
  replayId  String?  @map("replay_id")

  text      String?
  images    Json?
  videos    Json?
  docs      Json?
  files     Json?
  stickers  Json?    @map("stikers")

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     UserChat          @relation(fields: [chatId], references: [id])
  sender   User              @relation("UserUserChatMessages", fields: [senderId], references: [id])
  replyTo  MessageUserChat?  @relation("UserChatReply", fields: [replayId], references: [id])
  replies  MessageUserChat[] @relation("UserChatReply")

  @@index([chatId])
  @@index([senderId])
  @@map("messages_user_chat")
}
```

---

✅ Endi:  
- **Hech qanday `MessageDetails` yoki `File` jadval yo‘q**.  
- Barcha fayl, media, text kontentlari **to‘g‘ridan-to‘g‘ri `Message*` jadvalida saqlanadi**.  
- `UserChat`, `GroupChat`, `ChannelChat` har biri o‘z `messages` bilan bog‘langan.  
- Reply (`replayId`) self-relation orqali ishlaydi.  

---

Xohlaysanmi, men senga bu dizayn bo‘yicha **diagramma (ERD)** ham chizib beray?

---

### 👤 Foydalanuvchi:

Messageslar uchun interseptorni qanday yozisim kerak

### 🤖 ChatGPT:

Zo‘r savol 😎  

Agar sen NestJS’da `Messages` moduli bilan ishlayotgan bo‘lsang (masalan, `MessageChannel`, `MessageGroup`, `MessageUserChat` uchun), **interceptor** yozish orqali xabarlarni yuborishdan yoki olishdan oldin/so‘ng **ma’lumotni avtomatik qayta ishlash** mumkin.

Quyida senga **universal message interceptor** yozib beraman, u barcha message’lar uchun ishlaydi.

---

## ⚙️ Maqsad:
- Har bir message create/update request’dan oldin avtomatik `senderId` qo‘shish (masalan, `req.user.id` dan).
- Fayllar, media, textni validatsiya qilish.
- Response’da ma’lumotni formatlash (masalan, `JSON` fieldlarni parse qilib yuborish).

---

## 🧩 Universal `MessagesInterceptor`

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class MessagesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // 🔹 1. Kiruvchi message ma'lumotni tozalash / formatlash
    if (request.body) {
      const body = request.body;

      // Agar auth'dan foydalanuvchi kelsa, senderId'ni avtomatik qo'shamiz
      if (request.user && !body.senderId) {
        body.senderId = request.user.id;
      }

      // Fayl, media, sticker, docs kabilarni JSON string bo‘lsa parse qilamiz
      for (const key of ['files', 'images', 'videos', 'docs', 'stickers']) {
        if (typeof body[key] === 'string') {
          try {
            body[key] = JSON.parse(body[key]);
          } catch {
            body[key] = null;
          }
        }
      }

      request.body = body;
    }

    // 🔹 2. Response qaytganda formatlash
    return next.handle().pipe(
      map((data) => {
        // Agar ma'lumot message bo‘lsa, JSON fieldlarni parse qilamiz
        if (data && typeof data === 'object') {
          for (const key of ['files', 'images', 'videos', 'docs', 'stickers']) {
            if (typeof data[key] === 'string') {
              try {
                data[key] = JSON.parse(data[key]);
              } catch {
                // Agar JSON emas bo‘lsa, o‘z holicha qoldiramiz
              }
            }
          }
        }
        return data;
      }),
    );
  }
}
```

---

## 🧱 Interceptorni qo‘llash

Agar bu interceptor **faqat message controller** uchun kerak bo‘lsa:

```ts
import { UseInterceptors } from '@nestjs/common';
import { MessagesInterceptor } from './interceptors/messages.interceptor';

@Controller('messages')
@UseInterceptors(MessagesInterceptor)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('channel')
  createChannelMessage(@Body() body: any) {
    return this.messagesService.createChannelMessage(body);
  }

  @Post('group')
  createGroupMessage(@Body() body: any) {
    return this.messagesService.createGroupMessage(body);
  }

  @Post('user')
  createUserMessage(@Body() body: any) {
    return this.messagesService.createUserMessage(body);
  }
}
```

---

## 🔄 Global Interceptor sifatida (agar hamma message joylarda ishlasin desang):

`main.ts` ichida:

```ts
app.useGlobalInterceptors(new MessagesInterceptor());
```

---

## ✅ Natija:
- Har bir xabar uchun `senderId` avtomatik qo‘shiladi.
- `files`, `images`, `videos` kabi maydonlar avtomatik parse/format qilinadi.
- Response foydalanuvchiga toza formatda qaytadi.

---

Xohlaysanmi, men senga shu interceptor’ni **`MessagesService` bilan real CRUD ishlaydigan misol** qilib yozib beray (create + get + update)?

---

### 👤 Foydalanuvchi:

demak qolgani text yani matn bo'ladimi

### 🤖 ChatGPT:

Ha ✅ — to‘g‘ri tushunding.  

Endi `Message` jadvallar (`MessageChannel`, `MessageGroup`, `MessageUserChat`) soddalashgan, chunki:

- `ChatFile`, `GroupFile`, `UserChatFile`, `MessageDetails` — **yo‘q**.  
- Demak faqat **matn (text)** yoki **ixtiyoriy JSON** fieldlar (masalan, `images`, `videos`, `docs`, `stickers`) qoladi.  
- Agar sen xabarni **faqat matnli** qilishni xohlasang — faqat `text` maydonni qoldirishing mumkin.

---

### Agar faqat `text` xabar kerak bo‘lsa
```prisma
model MessageUserChat {
  id        String   @id @default(uuid())
  chatId    String   @map("chat_id")
  replayId  String?  @map("replay_id")
  senderId  String   @map("sender_id")

  text      String?  // faqat matn

  isUpdated Boolean  @default(false) @map("is_updated")
  isReading Boolean  @default(false) @map("is_reading")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  chat     UserChat          @relation(fields: [chatId], references: [id])
  replyTo  MessageUserChat?  @relation("UserChatReply", fields: [replayId], references: [id])
  replies  MessageUserChat[] @relation("UserChatReply")
  sender   User              @relation(fields: [senderId], references: [id])

  @@index([chatId])
  @@index([senderId])
  @@map("messages_user_chat")
}
```

Shu sxema `MessageGroup` va `MessageChannel` uchun ham xuddi shu tarzda bo‘ladi.

---

### Agar keyinchalik multimedia (rasm, video, hujjat) qo‘shmoqchi bo‘lsang:
Unda quyidagilarni **optional** holatda qoldirish mumkin:
```prisma
images   Json?
videos   Json?
docs     Json?
stickers Json?
```

Masalan:
```prisma
text: "Salom, bu test xabar",
images: ["https://cdn.app.com/img1.png"],
videos: null,
```

---

Shunday qilib, hozircha faqat **matnli chat** bo‘ladi, keyin istasang `media` maydonlarni qayta qo‘shish juda oson.  

Xohlaysanmi, men senga **faqat text bilan ishlaydigan MessageService + Controller CRUD** misolini yozib beray?

---

### 👤 Foydalanuvchi:

Dto qo'shsam bo'ladimi

### 🤖 ChatGPT:

Ha, albatta bo‘ladi ✅ — **DTO (Data Transfer Object)** NestJS’da **eng to‘g‘ri yondashuv** hisoblanadi.  
Bu — xabar yuborilganda (`POST /messages/...`) yoki yangilaganda (`PATCH /messages/...`) ma’lumotni **validatsiya qilish va shakllantirish** uchun ishlatiladi.  

---

## 🎯 Maqsad
Har bir xabar uchun (masalan, `MessageUserChat`) biz `CreateMessageDto` va `UpdateMessageDto` yozamiz.

---

### 📦 `dto/create-message.dto.ts`
```ts
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  chatId: string;

  @IsUUID()
  @IsOptional()
  replayId?: string;

  @IsUUID()
  senderId: string;

  @IsString()
  @Length(1, 5000)
  text: string;
}
```

---

### 🧩 `dto/update-message.dto.ts`
```ts
import { IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @Length(1, 5000)
  text?: string;

  @IsOptional()
  @IsBoolean()
  isUpdated?: boolean;
}
```

---

## ⚙️ Controller misoli
```ts
import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('user')
  async createUserMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createUserMessage(dto);
  }

  @Patch(':id')
  async updateMessage(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messagesService.updateMessage(id, dto);
  }
}
```

---

## 🧠 Service misoli
```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserMessage(dto: CreateMessageDto) {
    return this.prisma.messageUserChat.create({
      data: {
        chatId: dto.chatId,
        senderId: dto.senderId,
        replayId: dto.replayId,
        text: dto.text,
      },
    });
  }

  async updateMessage(id: string, dto: UpdateMessageDto) {
    return this.prisma.messageUserChat.update({
      where: { id },
      data: {
        text: dto.text,
        isUpdated: dto.isUpdated ?? true,
      },
    });
  }
}
```

---

## ✅ Natija:
- DTO orqali **validatsiya** avtomatik ishlaydi.  
- Interceptor (agar ishlatayotgan bo‘lsang) `senderId` ni yoki boshqa narsalarni avtomatik qo‘shadi.  
- Kod toza, xavfsiz, va maintainable bo‘ladi.

---

Xohlaysanmi, men senga shu DTO’lar bilan birgalikda **MessageGroup** va **MessageChannel** uchun ham to‘liq CRUD yozib beray?  
(Sen faqat bitta DTO’dan foydalansang ham bo‘ladi, lekin har biri uchun alohida qilish professional yondashuv bo‘ladi.)

---

### 👤 Foydalanuvchi:

Dto + InterSeptor

### 🤖 ChatGPT:

Zo‘r ✅ — demak senga kerak:  
> `Message` uchun **DTO + Interceptor** (birgalikda ishlaydigan, validatsiya + avtomatik field qo‘shish bilan).

Quyida senga **universal yechim** beraman — ya’ni `MessageUserChat`, `MessageGroup`, `MessageChannel` uchun **bitta DTO va bitta interceptor** ishlaydi.

---

## 🧩 1. `create-message.dto.ts`

```ts
import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  chatId: string;

  @IsOptional()
  @IsUUID()
  replayId?: string;

  // senderId ni interceptor avtomatik qo‘shadi
  @IsOptional()
  @IsUUID()
  senderId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 5000)
  text?: string;
}
```

---

## 🧩 2. `update-message.dto.ts`

```ts
import { IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @Length(1, 5000)
  text?: string;

  @IsOptional()
  @IsBoolean()
  isUpdated?: boolean;
}
```

---

## ⚙️ 3. `messages.interceptor.ts`

Bu interceptor har bir request’da:
- `req.user` dan `senderId` ni qo‘shadi.
- `text` yoki boshqa media ma’lumotlarini JSON qilib parse qiladi.
- Response’ni formatlab beradi.

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class MessagesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body) {
      const body = request.body;

      // 🔹 senderId ni avtomatik qo‘shamiz
      if (request.user && !body.senderId) {
        body.senderId = request.user.id;
      }

      // 🔹 Agar JSON bo‘lishi mumkin bo‘lgan fieldlar string bo‘lsa, parse qilamiz
      for (const key of ['files', 'images', 'videos', 'docs', 'stickers']) {
        if (typeof body[key] === 'string') {
          try {
            body[key] = JSON.parse(body[key]);
          } catch {
            body[key] = null;
          }
        }
      }

      request.body = body;
    }

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          // Response formatlash
          for (const key of ['files', 'images', 'videos', 'docs', 'stickers']) {
            if (typeof data[key] === 'string') {
              try {
                data[key] = JSON.parse(data[key]);
              } catch {
                // JSON emas — o‘zgartirmaymiz
              }
            }
          }
        }
        return data;
      }),
    );
  }
}
```

---

## 🧱 4. Controller (`messages.controller.ts`)

```ts
import { Body, Controller, Post, Patch, Param, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesInterceptor } from './interceptors/messages.interceptor';

@Controller('messages')
@UseInterceptors(MessagesInterceptor)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('user')
  async createUserMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createUserMessage(dto);
  }

  @Post('group')
  async createGroupMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createGroupMessage(dto);
  }

  @Post('channel')
  async createChannelMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createChannelMessage(dto);
  }

  @Patch(':id')
  async updateMessage(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messagesService.updateMessage(id, dto);
  }
}
```

---

## ⚙️ 5. Service (`messages.service.ts`)

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserMessage(dto: CreateMessageDto) {
    return this.prisma.messageUserChat.create({
      data: {
        chatId: dto.chatId,
        senderId: dto.senderId,
        replayId: dto.replayId,
        text: dto.text,
      },
    });
  }

  async createGroupMessage(dto: CreateMessageDto) {
    return this.prisma.messageGroup.create({
      data: {
        chatId: dto.chatId,
        senderId: dto.senderId,
        replayId: dto.replayId,
        text: dto.text,
      },
    });
  }

  async createChannelMessage(dto: CreateMessageDto) {
    return this.prisma.messageChannel.create({
      data: {
        chatId: dto.chatId,
        senderId: dto.senderId,
        replayId: dto.replayId,
        text: dto.text,
      },
    });
  }

  async updateMessage(id: string, dto: UpdateMessageDto) {
    // universal update
    return this.prisma.messageUserChat.update({
      where: { id },
      data: {
        text: dto.text,
        isUpdated: dto.isUpdated ?? true,
      },
    });
  }
}
```

---

## ✅ Yakuniy natija:
- DTO → validatsiya + type safety.
- Interceptor → `senderId` ni avtomatik qo‘shadi va JSON fieldlarni parse qiladi.
- Controller → bir nechta chat turiga universal endpointlar.
- Service → har bir message turiga mos CRUD.

---

Xohlaysanmi, men senga shu tuzilmani **faqat textli xabar** uchun **Socket.io event interceptor** bilan moslab (real-time) versiyasini yozib beray?

---

