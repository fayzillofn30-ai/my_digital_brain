# User context reducer implementation

### 🤖 Claude:

Bir muammo bor — variable naming conflict:



js
// ❌ ikkalasi ham "event" nomida!
socket.onmessage = (event) => {           // ← WebSocket event
    const { event, data } = JSON.parse(event.data)  // ← destructure event
}



js
// ✅ parameter nomini o'zgartir
socket.onmessage = (msg) => {
    const { event, data } = JSON.parse(msg.data)
    if (listeners[event]) {
        listeners[event](data)
    }
}

To'liq kod:


js
const socket = new WebSocket("ws://localhost:3001")

socket.onopen = () => console.log("Ulandi!")
socket.onclose = () => console.log("Uzildi!")

const listeners = {}

socket.on = (event, cb) => {
    listeners[event] = cb
}

socket.emit = (event, data) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event, data }))
    } else {
        console.log("Socket ulanmagan!")
    }
}

socket.onmessage = (msg) => {
    const { event, data } = JSON.parse(msg.data)
    if (listeners[event]) {
        listeners[event](data)
    }
}

export default socket

Sinab ko'r! 🚀

---

### 🤖 Claude:

Yaxshi yondashuv! onopen ichiga qo'yding — endi CONNECTING state xatosi bo'lmaydi. 👍

Lekin bir narsa:



js
// socket.on ni ham onopen ichiga olish kerakmas —
// chunki listenerlarni ulanishdan OLDIN qo'shish kerak bo'ladi

socket.on("connection", (data) => { ... })  // ← bu onopen dan oldin chaqiriladi

Hozirgi kod to'g'ri ishlaydi! Faqat socket.on tashqarida qolsin — bu intentional. ✅

Qisqa xulosa:


onopen  → emit va onmessage faollashadi  ✅
onclose → emit va onmessage o'chiriladi  ✅
on      → har doim tayyor, tashqarida    ✅

Endi App.jsx da ishlatib ko'ramizmi? 🚀

---

### 🤖 Claude:

Kodda bir nechta muammo ko'rinyabdi:

1. client.onmessage emas client.on('message') — ws da:



ts
// ❌
client.onmessage = (event) => {
    const res = JSON.parse(event.data.toString())
}

// ✅
client.on("message", (raw) => {
    const res = JSON.parse(raw.toString())
    const { event, data } = res
})

2. Hardcoded data — haqiqiy data ishlatilmayabdi:



ts
// ❌
const {event : msg, data} = { event: 'newMessage', data: { message: 'fdvfd' } }

// ✅
const { event, data } = JSON.parse(raw.toString())

3. socket.on render da chaqirilayabdi — useEffect ichiga olish kerak:



js
// ❌ — har renderda yangi listener qo'shiladi
socket.on("newMessage", (data) => {
    messagesDispatch({ type: "create", payload: data })
})

// ✅
useEffect(() => {
    socket.on("newMessage", (data) => {
        messagesDispatch({ type: "create", payload: data })
    })
}, [])

To'g'rilangan Gateway:


ts
handleConnection(client: WebSocketHack) {
    client.id = crypto.randomUUID()
    console.log("Connect [" + client.id + "]")
    
    client.send(JSON.stringify({ event: "connection", id: client.id }))

    client.on("message", (raw) => {
        const { event, data } = JSON.parse(raw.toString())
        console.log("Xabar keldi:", event, data)

        // Hammaga yuborish
        this.server.clients.forEach((c) => {
            c.send(JSON.stringify({ event, data }))
        })
    })
}

To'g'rilangan App.jsx:


jsx
useEffect(() => {
    socket.on("connection", (data) => {
        console.log("Mening idm:", data.id)
    })

    socket.on("newMessage", (data) => {
        messagesDispatch({ type: "create", payload: data })
    })
}, [])

Sinab ko'r — xabar hammaga ketayaptimi? 🚀

---

### 👤 Foydalanuvchi:

backendda on qo'shganim yo'q uni faqat frontda qo'shdim

### 🤖 Claude:

Ha, to'g'ri! 😄



ts
// ws da backend uchun — client.on("message") built-in
client.on("message", (raw) => {  // ← bu ws ning o'z methodi
    const { event, data } = JSON.parse(raw.toString())
})

// socket.on — biz frontda o'zimiz yozgan custom method
socket.on("newMessage", (data) => {  // ← bu bizning custom method
    messagesDispatch(...)
})

Qisqasi:



Backend  → client.on()  — ws paketi beradi ✅
Frontend → socket.on()  — biz yozdik ✅

Endi xabar hammaga ketayaptimi? 🚀

---

