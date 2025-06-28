const states = require('../states');
const utils = require('../utils');
const services = require('../services');
const keyboards = require('../keyboards/mainMenu');

module.exports = function setupMessageHandlers(bot, userStates) {
    bot.on('message', async (msg) => {
        if (!msg.text || msg.text.startsWith('/') || msg.text.match(/меню|menu/i)) {
            return;
        }
        
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const username = msg.from.username;
        const messageText = msg.text.trim();
        
        if (!messageText) return;
        
        const userState = userStates.get(userId) || states.MAIN_MENU;
        
        // Обработка ответа администратора с ключевыми словами
        if (userState === states.ADMIN_ANSWERING && utils.isAdmin(userId)) {
            const answerData = userStates.get(`${userId}_answer_data`);
            if (answerData) {
                const keywords = messageText.split(',').map(k => k.trim()).filter(k => k);
                
                if (keywords.length > 0) {
                    await services.adminAnswers.updateAdminAnswer(answerData.targetUserId, answerData.answer, keywords);
                    await services.knowledgeBase.saveToKnowledgeBase(keywords, answerData.answer);
                    
                    userStates.delete(`${userId}_answer_data`);
                    userStates.set(userId, states.MAIN_MENU);
                    
                    await utils.safeSendMessage(bot, chatId, `✅ Ответ добавлен в базу знаний с ключевыми словами: ${keywords.join(', ')}`);
                } else {
                    await utils.safeSendMessage(bot, chatId, '❌ Укажите хотя бы одно ключевое слово');
                }
                return;
            }
        }
        
        // Проверка специальных команд
        if (messageText.toLowerCase().includes('трансфер')) {
            userStates.set(userId, states.TRANSFER_REQUEST);
            await utils.safeSendMessage(bot, chatId, `🚖 Заказ трансфера

Для оформления трансфера, пожалуйста, укажите:
• Дату и время
• Количество человек
• Откуда забрать
• Контактный телефон

Наш менеджер свяжется с вами для уточнения деталей.`, 
                { parse_mode: 'Markdown' });
            return;
        }
        
        // Поиск в базе знаний
        const autoAnswer = services.knowledgeBase.findAnswerInKnowledgeBase(messageText);
        
        if (autoAnswer) {
            await utils.safeSendMessage(bot, chatId, autoAnswer, { 
                parse_mode: 'Markdown',
                ...keyboards.getBackToMenuKeyboard()
            });
        } else {
            // Если ответ не найден, сохраняем вопрос и отправляем администраторам
            await services.adminAnswers.saveUnknownQuestion(userId, username, messageText);
            
            await utils.safeSendMessage(bot, chatId, `Спасибо за ваш вопрос! 🤔
            
Я передам его нашему менеджеру, и он ответит вам в ближайшее время.

А пока вы можете воспользоваться меню с готовыми ответами 👇`, 
                keyboards.getMainMenuKeyboard());
            
            await utils.forwardToAdmins(bot, userId, username, messageText);
        }
    });
};