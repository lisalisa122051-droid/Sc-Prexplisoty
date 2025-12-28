const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const path = require('path');
const config = require('../config');

module.exports = {
    connection: async () => {
        const { state, saveCreds } = await useMultiFileAuthState(config.sessionPath);
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            generateHighQualityLinkPreview: true,
            logger: false,
            browser: ['Senior Bot MD', 'Chrome', '1.0.0'],
            defaultQueryTimeoutMs: 60000
        });

        sock.ev.on('creds.update', saveCreds);

        const generateQR = (qr) => {
            qrcode.generate(qr, { small: true });
            console.log('📱 Scan QR Code di atas untuk login!');
        };

        return { sock, generateQR };
    }
};
