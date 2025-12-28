async function serializeMessage(msg, sock) {
    try {
        if (!msg || !msg.message) return null;
        
        const m = msg;
        const from = m.key.remoteJid;
        const messageType = Object.keys(m.message)[0];
        
        // Extract sender dengan cara yang kompatibel dengan Elaina-Baileys
        let sender = m.key.participant || m.key.remoteJid;
        
        // Handle group messages
        if (from.endsWith('@g.us')) {
            sender = m.key.participant || from;
        }
        
        // Extract message content berdasarkan tipe pesan
        let body = '';
        let quoted = null;
        
        switch (messageType) {
            case 'conversation':
                body = m.message.conversation;
                break;
                
            case 'extendedTextMessage':
                body = m.message.extendedTextMessage.text || '';
                
                // Handle quoted message
                if (m.message.extendedTextMessage.contextInfo) {
                    const context = m.message.extendedTextMessage.contextInfo;
                    quoted = {
                        message: context.quotedMessage,
                        sender: context.participant,
                        id: context.stanzaId
                    };
                }
                break;
                
            case 'imageMessage':
                body = m.message.imageMessage.caption || '';
                break;
                
            case 'videoMessage':
                body = m.message.videoMessage.caption || '';
                break;
                
            case 'audioMessage':
                body = m.message.audioMessage.caption || '';
                break;
                
            case 'buttonsResponseMessage':
                // Handle button responses
                body = m.message.buttonsResponseMessage.selectedButtonId || '';
                break;
                
            case 'listResponseMessage':
                // Handle list responses
                body = m.message.listResponseMessage.title || '';
                break;
                
            default:
                body = '';
        }
        
        // Check if message is from bot
        const isBot = m.key.fromMe || false;
        
        // Check if from group
        const isGroup = from.endsWith('@g.us');
        
        return {
            from,
            sender,
            body: body.trim(),
            type: messageType,
            isGroup,
            isBot,
            quoted,
            message: m.message,
            key: m.key,
            timestamp: m.messageTimestamp,
            id: m.key.id,
            pushName: m.pushName || ''
        };
        
    } catch (error) {
        console.error('Error serializing message:', error);
        return null;
    }
}

// Get quoted message details
function getQuotedMessage(msg) {
    if (!msg.quoted) return null;
    
    const quoted = msg.quoted;
    let text = '';
    let type = '';
    
    if (quoted.message?.conversation) {
        text = quoted.message.conversation;
        type = 'conversation';
    } else if (quoted.message?.extendedTextMessage?.text) {
        text = quoted.message.extendedTextMessage.text;
        type = 'extendedTextMessage';
    } else if (quoted.message?.imageMessage) {
        text = quoted.message.imageMessage.caption || '';
        type = 'imageMessage';
    } else if (quoted.message?.videoMessage) {
        text = quoted.message.videoMessage.caption || '';
        type = 'videoMessage';
    } else if (quoted.message?.audioMessage) {
        text = '';
        type = 'audioMessage';
    }
    
    return {
        text: text.trim(),
        sender: quoted.sender,
        id: quoted.id,
        type: type
    };
}

module.exports = {
    serializeMessage,
    getQuotedMessage
};
