#!/bin/bash
sed -i '132,160c\
    try {\
      const response = await fetch("/api/chatbot", {\
        method: "POST",\
        headers: { "Content-Type": "application/json" },\
        body: JSON.stringify({ \
          prompt: userText, \
          history: chatHistory.map(h => ({ role: h.sender === "user" ? "user" : "model", text: h.text })),\
          fast: true\
        })\
      });\
      const data = await response.json();\
      if (!response.ok) throw new Error(data.error);\
      \
      setChatHistory(prev => [...prev, { sender: "bot", text: data.text }]);\
    } catch (error: any) {\
      setChatHistory(prev => [...prev, { sender: "bot", text: "Помилка зв'\''язку з ШІ: " + error.message }]);\
    }
' src/components/AdvisorTab.tsx
