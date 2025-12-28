const { sendThumbnailMenu } = require('../lib/function');
const config = require('../config');

module.exports = {
    commands: ['infobot', 'botinfo', 'about'],
    
    execute: async (sock, m, command) => {
        const runtime = require('../lib/function').getRuntime();
        
        await sendThumbnailMenu(sock, m,
            `ℹ️ *INFORMATION BOT*\n\n` +
            `📱 *Nama Bot:* ${config.botName}\n` +
            `📡 *Library:* @whiskeysockets/baileys\n` +
            `🎯 *Mode:* Multi Device\n` +
            `⏱️ *Runtime:* ${runtime}\n` +
            `👑 *Owner:* ${config.owner}\n\n` +
            `💎 *Fitur Utama:*\n` +
            `• Button & List Menu\n` +
            `• Download Media\n` +
            `• Group Management\n` +
            `• Anti Link\n` +
            `• WhatsApp Business Style`);
    }
};
