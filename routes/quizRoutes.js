const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Model manzili to'g'riligini tekshiring

// 1. 🟢 SAVE-ROOT YO'LAGI (Front-end'dagi murakkab logikani qo'llaydi)
router.post('/save-root', async (req, res) => {
    try {
        const { title, time, quizId, questionIdx, questionData } = req.body;

        // Ssenariy A: Faqat fan nomi kelgan bo'lsa -> Yangi hujjat (Quiz) yaratamiz
        if (title && !quizId) {
            const newQuiz = new Quiz({
                title: title,
                time: Number(time) || 20,
                questions: [],
                isFinalized: false // default holatda faollashtirilmagan deb turamiz
            });
            await newQuiz.save();
            return res.status(201).json({ success: true, quiz: newQuiz });
        }

        // Ssenariy B: Savol kelgan bo'lsa -> Mavjud Quiz ichiga savol qo'shamiz yoki tahrirlaymiz
        if (quizId && questionData) {
            const currentQuiz = await Quiz.findById(quizId);
            if (!currentQuiz) {
                return res.status(404).json({ success: false, message: "Test paketi topilmadi!" });
            }

            if (questionIdx !== null && questionIdx !== undefined) {
                // Mavjud savolni tahrirlash (Update)
                currentQuiz.questions[questionIdx] = questionData;
            } else {
                // Yangi savol qo'shish (Push)
                currentQuiz.questions.push(questionData);
            }

            // O'zgarishlarni saqlaymiz
            await currentQuiz.save();
            return res.status(200).json({ success: true, quiz: currentQuiz });
        }

        return res.status(400).json({ success: false, message: "Noto'g'ri ma'lumot uzatildi!" });

    } catch (err) {
        console.error("Save-root xatoligi:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// 2. 🔵 FINALIZE-QUIZ YO'LAGI (Testni to'liq yakunlash va faollashtirish)
router.post('/finalize-quiz', async (req, res) => {
    try {
        const { quizId } = req.body;
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId, 
            { isFinalized: true }, 
            { new: true }
        );
        return res.status(200).json({ success: true, quiz: updatedQuiz });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// 3. 🟡 DELETE-QUESTION YO'LAGI (Paket ichidan bitta savolni o'chirish)
router.post('/delete-question', async (req, res) => {
    try {
        const { quizId, questionIdx } = req.body;
        const currentQuiz = await Quiz.findById(quizId);
        
        if (!currentQuiz) return res.status(404).json({ message: "Test topilmadi" });

        // Massivdan ko'rsatilgan indeksdagi savolni olib tashlaymiz
        currentQuiz.questions.splice(questionIdx, 1);
        await currentQuiz.save();

        return res.status(200).json({ success: true, quiz: currentQuiz });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 4. 🔴 TEST PAKETINI BUTUNLAY O'CHIRISH
router.delete('/:id', async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: "O'chirildi" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;