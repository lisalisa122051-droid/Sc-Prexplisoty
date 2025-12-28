const { Boom } = require('@hapi/boom');
const { makeWASocket, useMultiFileAuthState } = require('elaina-baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment-timezone');

const config = require('./config.js');
const { loadHandler } = require('./handler.js');
const { connectToDatabase, saveDatabase, getDatabase } = require('./lib/database.js');
const { serializeMessage, getQuotedMessage } = require('./lib/serialize.js');
const { processJidFromGroupMessage, normalizePhoneNumber, isOwner } = require('./lib/jidUtils.js');

class WhatsAppBot {
    constructor() {
        this.sock = null;
        this.isConnected = false;
        this.qrCode = null;
        this.sessionPath = path.join(__dirname, 'session', 'creds.json');
        this.database = null;
        this.handler = null;
        
        this.startBot();
    }
    
    async startBot() {
        try {
            console.log(chalk.cyan('🚀 Starting WhatsApp Bot MD dengan Elaina-Baileys...'));
            
            // Load database
            this.database = await connectToDatabase();
            console.log(chalk.green('✓ Database loaded'));
            
            // Load handler
            this.handler = loadHandler(this);
            console.log(chalk.green('✓ Handler loaded'));
            
            // Initialize connection
            await this.initializeConnection();
            
        } catch (error) {
            console.error(chalk.red('❌ Error starting bot:'), error);
            process.exit(1);
        }
    }
    
    async initializeConnection() {
        const { state, saveCreds } = await useMultiFileAuthState(
            path.dirname(this.sessionPath)
        );
        
        this.sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            logger: config.logger,
            browser: ['Chrome (Windows)', '', ''],
            markOnlineOnConnect: true,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                return null;
            }
        });
        
        // Save credentials
        this.sock.ev.on('creds.update', saveCreds);
        
        // Connection updates
        this.sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                this.qrCode = qr;
                qrcode.generate(qr, { small: true });
                console.log(chalk.yellow('📱 Scan QR Code above'));
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== 401;
                console.log(chalk.red('⚠️ Connection closed, reconnecting...'));
                
                if (shouldReconnect) {
                    setTimeout(() => {
                        this.initializeConnection();
                    }, 5000);
                }
            } else if (connection === 'open') {
                this.isConnected = true;
                console.log(chalk.green('✅ Connected to WhatsApp!'));
                
                // Send bot status
                const botName = this.sock.user?.name || 'WhatsApp Bot';
                console.log(chalk.cyan(`🤖 Bot Name: ${botName}`));
                console.log(chalk.cyan(`📱 JID: ${this.sock.user?.id}`));
            }
        });
        
        // Message handler
        this.sock.ev.on('messages.upsert', async (m) => {
            try {
                const message = m.messages[0];
                if (!message.message || message.key.fromMe) return;
                
                // Serialize message
                const serialized = await serializeMessage(message, this.sock);
                if (!serialized) return;
                
                // Process message
                await this.handler(serialized, this.sock, this.database);
                
            } catch (error) {
                console.error(chalk.red('❌ Error processing message:'), error);
            }
        });
        
        // Group updates
        this.sock.ev.on('group-participants.update', async (update) => {
            try {
                const { id, participants, action } = update;
                
                if (action === 'add' && this.database.groups?.[id]?.welcome) {
                    const member = participants[0];
                    const groupMetadata = await this.sock.groupMetadata(id);
                    const groupName = groupMetadata.subject;
                    
                    const welcomeMsg = `👋 Welcome @${member.split('@')[0]} to *${groupName}*!\nPlease read group rules.`;
                    
                    await this.sock.sendMessage(id, {
                        text: welcomeMsg,
                        mentions: [member]
                    });
                }
            } catch (error) {
                console.error(chalk.red('❌ Error in group update:'), error);
            }
        });
    }
    
    async sendMessage(jid, content, options = {}) {
        try {
            if (!this.sock || !this.isConnected) return;
            return await this.sock.sendMessage(jid, content, options);
        } catch (error) {
            console.error(chalk.red('❌ Error sending message:'), error);
        }
    }
}

// Start bot
const bot = new WhatsAppBot();

// Handle process exit
process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n🛑 Shutting down bot...'));
    await saveDatabase(bot.database);
    process.exit(0);
});

module.exports = WhatsAppBot;
