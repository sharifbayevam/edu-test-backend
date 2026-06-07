require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

app.use(cors({
    origin: "*", 
    
}));
app.use(express.json({ limit: '50mb' }));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/quiz/generate-ai', async (req, res) => {
  const { savolMatni, quizTitle } = req.body;

  if (!savolMatni || savolMatni.trim().length < 5) {
    return res.status(400).json({ error: "Matn juda qisqa..." });
  }

  try {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        role: "system",
        content: "Siz faqat va faqat so'ralgan JSON formatida javob beradigan va hech qanday ortiqcha matn qo'shmaydigan tezkor AI yordamchisiz."
      },
      {
        role: "user",
        content: `Mavzu/Fan: "${quizTitle || 'Umumiy'}". Quyidagi matn yoki kalit so'zlarga asoslanib, unga mos keladigan 3 ta har xil test savolini tayyorla. Har bir testning 4 ta varianti (A, B, C, D) va to'g'ri javobi bo'lsin.
        Matn: "${savolMatni}"
        Javob faqat va faqat quyidagi toza JSON formatida bo'lsin, boshqa hech qanday izoh qo'shma:
        {
          "savollar": [
            { 
              "savol": "1-savol matni", 
              "a": "A variant matni", 
              "b": "B variant matni", 
              "c": "C variant matni", 
              "d": "D variant matni", 
              "javob": "A" 
            },
            { 
              "savol": "2-savol matni", 
              "a": "A variant matni", 
              "b": "B variant matni", 
              "c": "C variant matni", 
              "d": "D variant matni", 
              "javob": "B" 
            }
          ]
        }`
      }
    ],
    model: "llama-3.1-8b-instant", // 👈 70b modeldan eng tezkor 8b modelga o'tkazildi
    response_format: { type: "json_object" } 
  });

    const info = JSON.parse(chatCompletion.choices[0].message.content);
    res.json(info.savollar || []);

  } catch (error) {
    console.error("AI Server xatoligi:", error);
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishlamoqda...`));