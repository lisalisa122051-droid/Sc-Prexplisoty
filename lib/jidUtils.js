const config = require('../config');

module.exports = {
    isGroupJid: (jid) => jid.endsWith('@g.us'),
    extractPhoneFromJid: (jid) => {
        if (jid.endsWith('@s.whatsapp.net')) {
            return jid.replace('@s.whatsapp.net', '');
        }
        return jid.replace('@g.us', '');
    },
    normalizePhoneNumber: (phone) => {
        phone = phone.replace(/[^0-9]/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.slice(1);
        } else if (phone.startsWith('62')) {
            phone = phone;
        } else {
            phone = '62' + phone;
        }
        return phone + '@s.whatsapp.net';
    },
    mapRawJidToOriginalNumber: async (sock, jid) => {
        try {
            if (!this.isGroupJid(jid)) return this.extractPhoneFromJid(jid);
            
            const groupMetadata = await sock.groupMetadata(jid);
            const participant = groupMetadata.participants.find(p => p.admin);
            return this.extractPhoneFromJid(participant?.id || jid);
        } catch {
            return this.extractPhoneFromJid(jid);
        }
    },
    processJidFromGroupMessage: async (sock, jid) => {
        return await this.mapRawJidToOriginalNumber(sock, jid);
    },
    isOwner: (sender) => {
        const ownerNum = config.owner.replace(/[^0-9]/g, '');
        const senderNum = sender.replace(/[^0-9]/g, '');
        return ownerNum === senderNum;
    }
};
