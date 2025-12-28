const { Boom } = require('@hapi/boom');
const fs = require('fs-extra');
const path = require('path');
const { connection } = require('./lib/connection');
const handler = require('./handler');
const config = require('./config');

async function startBot() {
    const { sock, generateQR } = connection();
    
    sock.ev.on('connection.update', async (update) => {
        const { connection: conn, lastDisconnect, qr } = update;
        
        if (qr) {
            generateQR(qr);
        }
        
        if (conn === 'close') {
            const error = lastDisconnect?.error;
            const shouldReconnect = (error?.output?.statusCode !== Boom.statusCode('LOGGED_OUT'));
            console.log('Connection closed due to ', error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (conn === 'open') {
            console.log('✅ Bot Connected Successfully!');
            console.log(`📱 Bot Name: ${config.botName}`);
            console.log(`👑 Owner: ${config.owner}`);
        }
    });

    sock.ev.on('creds.update', () => {
        const sessionPath = path.join(__dirname, 'session');
        fs.ensureDirSync(sessionPath);
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(sock.authState.creds, null, 2));
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        await handler(sock, msg, config);
    });
}

process.on('unhandledRejection', console.error);
startBot();
