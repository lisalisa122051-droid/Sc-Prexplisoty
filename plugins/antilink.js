const db = require('../lib/database');
const jidUtils = require('../lib/jidUtils');

module.exports = {
    commands: ['antilink'],
    
    execute: async (sock, m, command) => {
        if (!m.isGroup) return;
        if (!jidUtils.isOwner(m.sender)) return sock.sendMessage(m.chat, { text: `❌ Owner only!` });
        
        const status = command === 'antilink on' ? true : false;
        const groupId = m.chat;
        db.settings.antiLink[groupId] = status;
        
        await sock.sendMessage(m.chat, { 
            text: `✅ Antilink ${status ? 'diaktifkan' : 'dimatikan'}` 
        });
    }
};
