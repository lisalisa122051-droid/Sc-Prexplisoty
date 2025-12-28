const jidUtils = require('./jidUtils');

module.exports = {
    serialize: async (sock, msg) => {
        const m = {};
        m.key = msg.key;
        m.chat = msg.key.remoteJid;
        m.isGroup = jidUtils.isGroupJid(m.chat);
        m.sender = await jidUtils.processJidFromGroupMessage(sock, m.chat, msg.key.participant);
        
        try {
            const textMsg = msg.message.conversation || 
                           msg.message.extendedTextMessage?.text || 
                           msg.message.imageMessage?.caption || 
                           msg.message.videoMessage?.caption || 
                           msg.message.documentMessage?.caption || '';
            m.text = textMsg;
        } catch {
            m.text = '';
        }
        
        m.message = msg.message;
        m.messageTimestamp = msg.messageTimestamp;
        m.type = Object.keys(msg.message)[0];
        
        return m;
    }
};
