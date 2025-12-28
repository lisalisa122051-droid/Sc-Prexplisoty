const { sendThumbnailMenu } = require('../lib/function');
const config = require('../config');

module.exports = {
    commands: ['ping', 'speed', 'runtime'],
    
    execute: async (sock, m, command) => {
        const start = new Date().getTime();
        const runtime = require('../lib/function').getRuntime();
        
        if (command === 'ping') {
            const loaded = await sock.sendMessage(m.chat, { text: `⚡` });
            const end = new Date().getTime();
            await sock.sendMessage(m.chat, { 
                edit: loaded.key, 
                text: `🏓 *PONG!*\n📡 *Kecepatan:* ${end - start}ms\n⏱️ *Uptime:* ${runtime}` 
            });
        } else if (command === 'speed' || command === 'runtime') {
            await sendThumbnailMenu(sock, m, 
                `🚀 *SYSTEM INFO*\n\n` +
                `⏱️ *Runtime:* ${runtime}\n` +
                `⚡ *Ping:* ${(new Date().getTime() - start)}ms\n` +
                `💾 *Library:* Baileys MD\n` +
                `🔥 *Status:* Active`);
        }
    }
};
