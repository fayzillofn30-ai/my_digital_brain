(async () => {
    console.log("%c🚀 ChatGPT tezkor yuklash boshlandi...", "color: green; font-size: 20px; font-weight: bold;");
    let allChats = [];
    try {
        const res = await fetch('https://chatgpt.com/backend-api/conversations?offset=0&limit=100');
        const data = await res.json();
        const items = data.items;
        
        if (!items || items.length === 0) {
            console.log("%cBazada hech qanday chat topilmadi!", "color: red; font-size: 16px;");
            return;
        }
        
        console.log(`Jami ${items.length} ta chat topildi. Yuklab olinmoqda...`);
        
        for(let i = 0; i < items.length; i++) {
            console.log(`Yuklanmoqda (${i+1}/${items.length}): ${items[i].title}`);
            const chatRes = await fetch(`https://chatgpt.com/backend-api/conversation/${items[i].id}`);
            const chatData = await chatRes.json();
            allChats.push(chatData);
            
            // Serverni qizdirib yubormaslik (blok tushmasligi) uchun 0.5 soniya kutamiz
            await new Promise(r => setTimeout(r, 500));
        }
        
        // JSON qilib saqlash
        const blob = new Blob([JSON.stringify(allChats)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chatgpt-fast-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log("%c✅ Barcha chatlar muvaffaqiyatli yuklandi!", "color: blue; font-size: 20px; font-weight: bold;");
    } catch (e) {
        console.error("Xatolik yuz berdi: ", e);
    }
})();
