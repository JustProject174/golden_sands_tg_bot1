const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const knowledgeBaseService = require('./knowledgeBase');

const pendingQuestions = new Map();

async function loadAndProcessAdminAnswers() {
    try {
        const data = await fs.readFile(config.ADMIN_ANSWERS_FILE, 'utf8');
        const entries = data.split('\n---\n').filter(entry => entry.trim());
        
        for (const entry of entries) {
            const lines = entry.split('\n');
            const questionLine = lines.find(line => line.startsWith('QUESTION:'));
            const answerLine = lines.find(line => line.startsWith('ANSWER:'));
            const keywordsLine = lines.find(line => line.startsWith('KEYWORDS:'));
            
            if (questionLine && answerLine && keywordsLine) {
                const keywords = keywordsLine.replace('KEYWORDS:', '').split(',').map(k => k.trim());
                const answer = answerLine.replace('ANSWER:', '');
                
                const exists = knowledgeBaseService.getKnowledgeBase().some(item => 
                    item.keywords.some(keyword => keywords.includes(keyword))
                );
                
                if (!exists) {
                    await knowledgeBaseService.saveToKnowledgeBase(keywords, answer);
                }
            }
        }
        
        await fs.writeFile(config.ADMIN_ANSWERS_FILE, '', 'utf8');
        console.log('Ответы администраторов обработаны и добавлены в базу знаний');
    } catch (error) {
        console.log('Файл ответов администраторов не найден или пуст');
    }
}

async function saveUnknownQuestion(userId, username, question) {
    const timestamp = new Date().toISOString();
    const userInfo = username ? `@${username}` : `ID: ${userId}`;
    const entry = `TIMESTAMP:${timestamp}\nUSER:${userInfo}\nUSER_ID:${userId}\nQUESTION:${question}\nANSWER:\nKEYWORDS:\n---\n`;
    
    await fs.appendFile(config.ADMIN_ANSWERS_FILE, entry, 'utf8');
    pendingQuestions.set(userId, { question, timestamp });
}

async function updateAdminAnswer(userId, answer, keywords) {
    try {
        const data = await fs.readFile(config.ADMIN_ANSWERS_FILE, 'utf8');
        const entries = data.split('\n---\n');
        
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].includes(`USER_ID:${userId}`) && entries[i].includes('ANSWER:\n')) {
                entries[i] = entries[i]
                    .replace('ANSWER:', `ANSWER:${answer}`)
                    .replace('KEYWORDS:', `KEYWORDS:${keywords.join(',')}`);
                break;
            }
        }
        
        await fs.writeFile(config.ADMIN_ANSWERS_FILE, entries.join('\n---\n'), 'utf8');
        console.log('Ответ администратора сохранен');
    } catch (error) {
        console.error('Ошибка при сохранении ответа администратора:', error);
    }
}

function getPendingQuestions() {
    return pendingQuestions;
}

module.exports = {
    loadAndProcessAdminAnswers,
    saveUnknownQuestion,
    updateAdminAnswer,
    getPendingQuestions
};