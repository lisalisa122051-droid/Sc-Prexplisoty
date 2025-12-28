const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

module.exports = {
    getRuntime: () => {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },

    sendThumbnailMenu: async (sock, m, content, buttons = null, list = null) => {
        const thumbnail = fs.readFileSync(config.thumbnail);
        
        const message = {
            image: thumbnail,
            caption: content,
            footer: `© ${config.botName}`,
            ... (buttons && { templateButtons: buttons }),
            ... (list && { listMessage: list }),
            ...(m.quoted && m.quoted.key && {
                contextInfo: {
                    mentionedJid: [m.quoted.key.remoteJid],
                    quotedMessage: m.quoted.message
                }
            })
        };
        
        return await sock.sendMessage(m.chat, message);
    },

    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
};
