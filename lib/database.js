const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const jidUtils = require('./jidUtils');

class Database {
    constructor() {
        this.dbPath = config.databasePath;
        this.init();
    }

    init() {
        if (!fs.existsSync(this.dbPath)) {
            fs.writeJSONSync(this.dbPath, {
                users: {},
                groups: {},
                settings: {
                    selfMode: false,
                    antiLink: {}
                }
            });
        }
    }

    getUser(sender) {
        const normalized = jidUtils.normalizePhoneNumber(sender);
        const db = fs.readJSONSync(this.dbPath);
        if (!db.users[normalized]) {
            db.users[normalized] = {
                sentBusinessInfo: false,
                lastInteraction: Date.now(),
                commandsUsed: 0
            };
            fs.writeJSONSync(this.dbPath, db);
        }
        return db.users[normalized];
    }

    setUser(sender, data) {
        const normalized = jidUtils.normalizePhoneNumber(sender);
        const db = fs.readJSONSync(this.dbPath);
        db.users[normalized] = { ...db.users[normalized], ...data };
        fs.writeJSONSync(this.dbPath, db);
    }
}

const db = new Database();
module.exports = db;

module.exports.processBusinessInfo = async (sock, m, config) => {
    const sender = await jidUtils.processJidFromGroupMessage(sock, m.key.remoteJid, m.key.participant);
    const userData = db.getUser(sender);
    
    if (!userData.sentBusinessInfo) {
        await sock.sendMessage(m.key.remoteJid, { 
            text: config.businessInfo 
        });
        db.setUser(sender, { sentBusinessInfo: true });
    }
};
