const path = require('path');
const fs = require('fs').promises;
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// Безопасная отправка сообщения
async function safeSendMessage(bot, chatId, text, options = {}) {
    try {
        await bot.sendMessage(chatId, text, options);
    } catch (error) {
        console.error(`Ошибка отправки сообщения пользователю ${chatId}:`, error.message);
        try {
            await bot.sendMessage(chatId, text.replace(/[*_`\[\]]/g, ''));
        } catch (secondError) {
            console.error(`Критическая ошибка отправки сообщения пользователю ${chatId}:`, secondError.message);
        }
    }
}

// Проверка администратора
function isAdmin(userId) {
    return config.admins.includes(userId);
}

// Пересылка сообщения администраторам
async function forwardToAdmins(bot, userId, username, message) {
    if (config.admins.length === 0) {
        console.log('Нет настроенных администраторов');
        return;
    }
    
    const userInfo = username ? `@${username}` : `ID: ${userId}`;
    const adminMessage = `❓ Новый вопрос от пользователя ${userInfo}:\n\n${message}\n\n_Для ответа используйте: /answer ${userId} [ваш ответ]_`;
    
    for (const adminId of config.admins) {
        await safeSendMessage(bot, adminId, adminMessage, { parse_mode: 'Markdown' });
    }
}

module.exports = {
    safeSendMessage,
    isAdmin,
    forwardToAdmins
};