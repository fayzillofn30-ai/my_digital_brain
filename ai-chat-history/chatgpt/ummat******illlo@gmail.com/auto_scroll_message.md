# Auto scroll message

### 👤 Foydalanuvchi:

"use client"

import React, { useCallback, useEffect, useEffectEvent, useMemo, useState } from "react"
import { Button, CircularProgress } from "@mui/material"
import { useUserStore } from "@/store/user.store"
import * as UIState from "@/store/ui_store/store/index"
import { useSocketStore } from "@/service/socket.io"
import { Messages } from "@/features"
import { Message } from "@/types/ui/message.types"

type Props = {
  chatId: string | null
}

const RenderMessage: React.FC<Props> = ({ chatId }) => {
  const { user } = useUserStore()
  const { selected } = UIState.useUIStore()
  const { socket } = useSocketStore()
  const [loadingId, setLoadingId] = useState("")
  const id = selected.chat?.id || chatId || ""

  if (!selected.chat) return
  const { data: allMessages, isLoading, refetch } = Messages.useAllMessages<Message[]>(selected.chat?.type, selected.chat.id)


  const handleDelete = async (msgId: string) => {
    if (selected.chat?.type) {
      setLoadingId(msgId)
      socket?.on("create-msg", () => refetch)
      await Messages.removeMessage(msgId, selected.chat?.type)
    }
  }

  const uniqueMessages: string[] = []
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-100px)] w-full border">
      {allMessages.map(({ message, sender }) => {
        const isMine = user?.userId === sender.id
        if (uniqueMessages.includes(message.id)) return
        uniqueMessages.push(message.id)
        return (
          <div
            key={message.id}
            className={`flex gap-3 items-start border-b pb-3 w-1/2 ${isMine ? "self-end bg-gray-600" : "self-start bg-amber-300"
              } rounded-lg p-2`}
          >
            <img src={sender.avatar || ""} alt="avatar" className="w-10 h-10 rounded-full object-cover" />

            <div className="flex-1">
              <div className="font-semibold">
                {sender.firstName} {sender.lastName}
              </div>

              {/* Files */}
              {message.files && message.files?.length > 0 && (
                <div className="mt-2 text-sm text-blue-600">
                  {message.files.map((file, i) => (
                    <a key={i} href={file} target="_blank" rel="noopener noreferrer" className="block">
                      📎 {file}
                    </a>
                  ))}
                </div>
              )}

              {/* Images */}
              {message.images && message.images?.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {message.images.map((img, i) => (
                    <img key={i} src={img} className="rounded-md object-cover w-full h-32" />
                  ))}
                </div>
              )}

              <div className="bg-gray-100 p-2 rounded-md inline-block mt-1">
                {message.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.updatedAt).toLocaleTimeString()}
              </div>
            </div>

            {isMine && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDelete(message.id)}
                disabled={loadingId === message.id}
              >
                {loadingId === message.id ? <CircularProgress size={18} /> : "O‘chirish"}
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default RenderMessage

bunga useRef bilan ohirgi message yuqoriga chiqsin

### 🤖 ChatGPT:

Zo‘r — sen xohlaysan, har safar yangi xabar kelganda yoki qayta yuklanganda (refetch qilganda), **scroll pastga (oxirgi xabarga)** avtomatik tushishini. Buni `useRef` va `useEffect` bilan juda silliq tarzda qilish mumkin 👇  

Mana to‘g‘rilangan, to‘liq ishlaydigan versiya:

---

```tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button, CircularProgress } from "@mui/material"
import { useUserStore } from "@/store/user.store"
import * as UIState from "@/store/ui_store/store/index"
import { useSocketStore } from "@/service/socket.io"
import { Messages } from "@/features"
import { Message } from "@/types/ui/message.types"

type Props = {
  chatId: string | null
}

const RenderMessage: React.FC<Props> = ({ chatId }) => {
  const { user } = useUserStore()
  const { selected } = UIState.useUIStore()
  const { socket } = useSocketStore()
  const [loadingId, setLoadingId] = useState("")
  const id = selected.chat?.id || chatId || ""

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  if (!selected.chat) return null

  const { data: allMessages = [], isLoading, refetch } = Messages.useAllMessages<Message[]>(
    selected.chat?.type,
    selected.chat.id
  )

  const handleDelete = async (msgId: string) => {
    if (selected.chat?.type) {
      setLoadingId(msgId)
      socket?.on("create-msg", () => refetch())
      await Messages.removeMessage(msgId, selected.chat?.type)
      setLoadingId("")
    }
  }

  // 👇 Har safar xabarlar o‘zgarganda, scroll pastga tushadi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [allMessages])

  const uniqueMessages: string[] = []

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-100px)] w-full border">
      {allMessages.map(({ message, sender }) => {
        const isMine = user?.userId === sender.id
        if (uniqueMessages.includes(message.id)) return null
        uniqueMessages.push(message.id)

        return (
          <div
            key={message.id}
            className={`flex gap-3 items-start border-b pb-3 w-1/2 ${
              isMine ? "self-end bg-gray-600" : "self-start bg-amber-300"
            } rounded-lg p-2`}
          >
            <img
              src={sender.avatar || ""}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="font-semibold">
                {sender.firstName} {sender.lastName}
              </div>

              {/* Files */}
              {message.files && message.files?.length > 0 && (
                <div className="mt-2 text-sm text-blue-600">
                  {message.files.map((file, i) => (
                    <a
                      key={i}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      📎 {file}
                    </a>
                  ))}
                </div>
              )}

              {/* Images */}
              {message.images && message.images?.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {message.images.map((img, i) => (
                    <img key={i} src={img} className="rounded-md object-cover w-full h-32" />
                  ))}
                </div>
              )}

              <div className="bg-gray-100 p-2 rounded-md inline-block mt-1">
                {message.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.updatedAt).toLocaleTimeString()}
              </div>
            </div>

            {isMine && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDelete(message.id)}
                disabled={loadingId === message.id}
              >
                {loadingId === message.id ? <CircularProgress size={18} /> : "O‘chirish"}
              </Button>
            )}
          </div>
        )
      })}

      {/* 👇 Shu ref scroll uchun */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default RenderMessage
```

---

### 🧠 Izoh:
- `messagesEndRef` — bu oxirgi joydagi bo‘sh `div`, unga scroll qilinadi.
- `useEffect([...allMessages])` — har safar yangi xabar qo‘shilsa yoki yangilansa, `scrollIntoView()` bilan pastga tushadi.
- `{ behavior: "smooth" }` — scroll yumshoq harakat bilan amalga oshadi.

Agar xohlaysan, men buni **"scroll pastga, lekin foydalanuvchi o‘zi tepaga chiqqan bo‘lsa scrollmasin"** tarzida optimallashtirib ham bera olaman — bu Telegramdagi kabi. Shunday qilaymi?

---

### 👤 Foydalanuvchi:

import React from 'react'
import * as UIState from "@/store/ui_store/store"

function CenterHeader() {
    const { selected, chatType } = UIState.useUIStore()
    console.log(selected.chat)
    return (
        <div className="border-b py-2 flex items-center gap-2">
            {selected.chat ? (
                <>
                    <img
                        src={selected.chat.logo || ""}
                        alt="chat-logo"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    {
                        selected.chat.type === "user" ? (
                            <div>
                                <h1 className="font-semibold">{selected.chat.title}</h1>
                                <p>{selected.chat.lastActivaty ? new Date(selected.chat.lastActivaty).toLocaleString("",{month : "long",hour : "2-digit",minute : "2-digit"}): ""}</p>
                            </div>
                        ) : <div>
                            <h1 className="font-semibold">{selected.chat.title}</h1>
                            <p>{selected.chat.subscriptionsCount}</p>
                        </div>
                    }

                </>
            ) : (
                <h1 className="text-gray-400">Chat tanlang</h1>
            )}
        </div>
    )
}

export default CenterHeader





### 🤖 ChatGPT:

Bu komponent juda yaxshi yozilgan 👌 — toza, aniq, `selected.chat` bo‘lmagan holatda ham xavfsiz ishlaydi. Lekin biroz yaxshilashlar qilish mumkin, xususan:  

1. **`selected.chat` null bo‘lganda console.log`da xatolik chiqmasin**.  
2. **`type` bo‘yicha ko‘proq vizual farq qo‘shish** (user, group, channel).  
3. `lastActivaty` (faol bo‘lgan vaqt) formatini foydalanuvchiga yoqimli ko‘rsatish.  
4. `chatType` holatini ham soddaroq boshqarish.  

Quyidagi optimallashtirilgan variant senga juda mos tushadi 👇  

---

### ✅ Yaxshilangan versiya

```tsx
"use client"

import React from "react"
import * as UIState from "@/store/ui_store/store"

function CenterHeader() {
  const { selected } = UIState.useUIStore()
  const chat = selected.chat

  if (!chat) {
    return (
      <div className="border-b py-3 flex items-center justify-center text-gray-400">
        Chat tanlang
      </div>
    )
  }

  const formattedActivity = chat.lastActivaty
    ? new Date(chat.lastActivaty).toLocaleString("uz-UZ", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  return (
    <div className="border-b py-2 px-3 flex items-center gap-3 bg-white/30 backdrop-blur-sm">
      <img
        src={chat.logo || "/default-avatar.png"}
        alt="chat-logo"
        className="w-10 h-10 rounded-full object-cover border"
      />

      {chat.type === "user" ? (
        <div className="flex flex-col leading-tight">
          <h1 className="font-semibold text-base">{chat.title}</h1>
          {formattedActivity && (
            <p className="text-xs text-gray-500">Oxirgi faol: {formattedActivity}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col leading-tight">
          <h1 className="font-semibold text-base">{chat.title}</h1>
          <p className="text-xs text-gray-500">
            A’zolar soni: {chat.subscriptionsCount ?? 0}
          </p>
        </div>
      )}
    </div>
  )
}

export default CenterHeader
```

---

### 🧠 Izoh:
- `selected.chat` destructuring orqali `chat` deb soddalashtirildi.  
- `toLocaleString` formatida o‘zbek tilidagi oyning nomi chiqadi (masalan: *oktyabr 13, 21:05*).  
- Agar logo bo‘lmasa — `"/default-avatar.png"` ko‘rsatiladi (fallback).  
- `chat.type === "user"` bo‘lmaganda avtomatik group/channel dizayn ishlaydi.  

Agar xohlaysan, men buni **responsive** (mobilga mos, chat title yoniga status belgisi bilan) qilib ham yozib bera olaman. Shunday qilaymi?

---

