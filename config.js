require('dotenv').config();

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    KNOWLEDGE_BASE_FILE: 'knowledge_base.txt',
    ADMIN_ANSWERS_FILE: 'admin_answers.txt',
    admins: [809245787],
    roomsDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTllwCIja20XxOgfs3VO8EiP3AlGG9VUO25-OnVpLLfAn_CaCuLuKhzeO6DVXRoONbMaVajeUeHtJZI/pub?gid=2091878195&single=true&output=csv'
};