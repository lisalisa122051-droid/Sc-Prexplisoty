const { makeWASocket, useMultiFileAuthState } = require('elaina-baileys');
const path = require('path');

async function connection(sessionPath) {
    const { state, saveCreds } = await useMultiFileAuthState(
        path.dirname(sessionPath)
    );
    
    return {
        state,
        saveCreds
    };
}

module.exports = connection;
