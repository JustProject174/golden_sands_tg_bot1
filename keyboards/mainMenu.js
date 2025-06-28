module.exports = {
    getMainMenuKeyboard: () => ({
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🔔 Важная информация', callback_data: 'important_info' }
                ],
                [
                    { text: '🛏️ Номерной фонд', callback_data: 'rooms' }
                ],
                [
                    { text: '🚣 Развлечения', callback_data: 'entertainment' }
                ],
                [
                    { text: '📍 На территории', callback_data: 'facilities' }
                ],
                [
                    { text: '🚗 Как добраться', callback_data: 'directions' }
                ],
                [
                    { text: '🛏️ Бронирование', callback_data: 'booking' }
                ]
            ]
        }
    }),

    getBackToMenuKeyboard: () => ({
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 В главное меню', callback_data: 'back_to_menu' }]
            ]
        }
    }),

    getRoomsKeyboard: (roomsData) => {
        const roomButtons = roomsData.map((room, index) => [{ 
            text: room.Название || `Номер ${index + 1}`, 
            callback_data: `room_${index}` 
        }]);
        
        roomButtons.push([{ text: '🔙 В главное меню', callback_data: 'back_to_menu' }]);
        
        return {
            reply_markup: {
                inline_keyboard: roomButtons
            }
        };
    },

    getRoomDetailsKeyboard: () => ({
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🛏️ Забронировать', callback_data: 'booking' },
                    { text: '🔙 К списку номеров', callback_data: 'rooms' }
                ],
                [
                    { text: '🔙 В главное меню', callback_data: 'back_to_menu' }
                ]
            ]
        }
    }),

    getBookingKeyboard: () => ({
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Да', callback_data: 'booking_yes' },
                    { text: 'Нет', callback_data: 'booking_no' }
                ]
            ]
        }
    })
};