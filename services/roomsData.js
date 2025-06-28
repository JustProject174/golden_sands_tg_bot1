const https = require('https');
const Papa = require('papaparse');
const config = require('../config');

let roomsData = [];

async function loadRoomsData() {
    return new Promise((resolve, reject) => {
        https.get(config.roomsDataUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = Papa.parse(data, {
                        header: true,
                        skipEmptyLines: true,
                        dynamicTyping: true
                    });
                    roomsData = parsed.data;
                    console.log(`Загружено ${roomsData.length} номеров из таблицы`);
                    resolve(roomsData);
                } catch (error) {
                    console.error('Ошибка парсинга CSV:', error);
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.error('Ошибка загрузки данных номеров:', error);
            reject(error);
        });
    });
}

function getRoomsData() {
    return roomsData;
}

module.exports = {
    loadRoomsData,
    getRoomsData
};