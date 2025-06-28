module.exports = {
    getAdminKeyboard: () => ({
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📊 Статистика', callback_data: 'admin_stats' },
                    { text: '📝 База знаний', callback_data: 'admin_kb' }
                ],
                [
                    { text: '❓ Неотвеченные вопросы', callback_data: 'admin_pending' }
                ],
                [
                    { text: '🔄 Обновить базу', callback_data: 'admin_reload' },
                    { text: '🔙 Назад в меню', callback_data: 'back_to_menu' }
                ]
            ]
        }
    }),

    getBackToAdminKeyboard: () => ({
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Админ-панель', callback_data: 'admin_panel' }]
            ]
        }
    })
};