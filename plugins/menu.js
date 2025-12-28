const config = require('../config.js');
const { formatMessage, getBuffer } = require('../lib/function.js');

const commands = {
    menu: async (message, sock, database, bot) => {
        const { from, senderNumber, quoted } = message;
        const thumbnail = await getBuffer(config.menuThumbnail);
        
        // Format Button untuk Elaina-Baileys
        const buttons = [
            {
                buttonId: `${config.prefix}allmenu`,
                buttonText: {
                    displayText: '📋 ALL MENU'
                },
                type: 1
            },
            {
                buttonId: `${config.prefix}ping`,
                buttonText: {
                    displayText: '⚡ PING'
                },
                type: 1
            },
            {
                buttonId: `${config.prefix}infobot`,
                buttonText: {
                    displayText: '🤖 BOT INFO'
                },
                type: 1
            }
        ];
        
        const buttonMessage = {
            text: formatMessage(
                `Halo @${senderNumber}`,
                `*${config.botName}* - WhatsApp Bot Multi Device\n\n` +
                `⏰ Time: ${config.getTime()}\n` +
                `📅 Date: ${config.getDate()}\n\n` +
                `Type *${config.prefix}allmenu* to see all commands\n` +
                `Type *${config.prefix}help <command>* for help`,
                `Owner: ${config.ownerName}`
            ),
            footer: config.botName,
            buttons: buttons,
            headerType: 1,
            mentions: [from],
            contextInfo: {
                mentionedJid: [from],
                forwardingScore: 0,
                isForwarded: false
            }
        };
        
        // Tambahkan thumbnail jika ada
        if (thumbnail) {
            buttonMessage.image = thumbnail;
            buttonMessage.headerType = 4; // HEADER_TYPE_IMAGE
        }
        
        // Jika ada quoted message
        if (quoted) {
            buttonMessage.contextInfo = {
                ...buttonMessage.contextInfo,
                stanzaId: quoted.id,
                participant: quoted.sender,
                quotedMessage: {
                    conversation: quoted.text || 'Menu Command'
                }
            };
        }
        
        await sock.sendMessage(from, buttonMessage);
    },
    
    allmenu: async (message, sock) => {
        const { from, senderNumber, quoted } = message;
        const thumbnail = await getBuffer(config.menuThumbnail);
        
        // Format List Message untuk Elaina-Baileys
        const sections = [
            {
                title: "🌟 MAIN MENU",
                rows: [
                    { title: "📋 Menu", rowId: `${config.prefix}menu`, description: "Show main menu" },
                    { title: "⚡ Ping", rowId: `${config.prefix}ping`, description: "Check bot speed" },
                    { title: "🤖 Bot Info", rowId: `${config.prefix}infobot`, description: "Show bot information" }
                ]
            },
            {
                title: "🎮 FUN COMMANDS",
                rows: [
                    { title: "😂 Joke", rowId: `${config.prefix}joke`, description: "Get random joke" },
                    { title: "🎯 Truth", rowId: `${config.prefix}truth`, description: "Truth question" },
                    { title: "💪 Dare", rowId: `${config.prefix}dare`, description: "Dare challenge" },
                    { title: "⭐ Rate", rowId: `${config.prefix}rate`, description: "Rate something" }
                ]
            },
            {
                title: "⬇️ DOWNLOADER",
                rows: [
                    { title: "🎵 Play", rowId: `${config.prefix}play`, description: "Download music" },
                    { title: "📹 YouTube", rowId: `${config.prefix}ytvideo`, description: "Download YouTube" },
                    { title: "📱 TikTok", rowId: `${config.prefix}tiktok`, description: "Download TikTok" },
                    { title: "📸 Instagram", rowId: `${config.prefix}instagram`, description: "Download IG" }
                ]
            },
            {
                title: "🛠️ TOOLS",
                rows: [
                    { title: "🖼️ Sticker", rowId: `${config.prefix}sticker`, description: "Create sticker" },
                    { title: "📝 To Image", rowId: `${config.prefix}toimg`, description: "Sticker to image" },
                    { title: "🔗 Shortlink", rowId: `${config.prefix}shortlink`, description: "Shorten URL" }
                ]
            },
            {
                title: "👥 GROUP",
                rows: [
                    { title: "👋 Welcome", rowId: `${config.prefix}welcome on`, description: "Toggle welcome" },
                    { title: "📛 Setname", rowId: `${config.prefix}setname`, description: "Change group name" },
                    { title: "📝 Setdesc", rowId: `${config.prefix}setdesc`, description: "Change group desc" }
                ]
            }
        ];
        
        const listMessage = {
            text: formatMessage(
                `ALL COMMANDS - ${config.botName}`,
                `Hello @${senderNumber}! Here are all available commands:\n\n` +
                `Total: ${sections.reduce((acc, sec) => acc + sec.rows.length, 0)} commands\n` +
                `Prefix: ${config.prefix}\n\n` +
                `Select category below:`,
                `Owner: ${config.ownerName}`
            ),
            footer: config.botName,
            title: "📚 ALL MENU",
            buttonText: "SELECT CATEGORY",
            sections: sections,
            mentions: [from]
        };
        
        // Tambahkan thumbnail jika ada
        if (thumbnail) {
            listMessage.image = thumbnail;
        }
        
        // Jika ada quoted message
        if (quoted) {
            listMessage.contextInfo = {
                stanzaId: quoted.id,
                participant: quoted.sender,
                quotedMessage: {
                    conversation: quoted.text || 'All Menu Command'
                }
            };
        }
        
        await sock.sendMessage(from, listMessage);
    },
    
    help: async (message, sock) => {
        const { from, args } = message;
        
        if (args.length === 0) {
            // Button untuk help command
            const buttons = [
                {
                    buttonId: `${config.prefix}menu`,
                    buttonText: { displayText: '📋 MENU' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}allmenu`,
                    buttonText: { displayText: '📚 ALL MENU' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: formatMessage(
                    "HELP COMMAND",
                    `Usage: ${config.prefix}help <command>\n\n` +
                    `Example: ${config.prefix}help sticker\n\n` +
                    `Tap buttons below for more:`
                ),
                footer: config.botName,
                buttons: buttons,
                headerType: 1
            });
            return;
        }
        
        const command = args[0].toLowerCase();
        let helpText = '';
        
        switch (command) {
            case 'sticker':
                helpText = `*${config.prefix}sticker*\nCreate sticker from image\nUsage: Reply image with ${config.prefix}sticker or ${config.prefix}sticker <pack>|<author>`;
                break;
            case 'play':
                helpText = `*${config.prefix}play*\nDownload music from YouTube\nUsage: ${config.prefix}play <song title>`;
                break;
            case 'ping':
                helpText = `*${config.prefix}ping*\nCheck bot response time\nUsage: ${config.prefix}ping`;
                break;
            case 'menu':
                helpText = `*${config.prefix}menu*\nShow main menu with buttons\nUsage: ${config.prefix}menu`;
                break;
            case 'allmenu':
                helpText = `*${config.prefix}allmenu*\nShow all commands in list\nUsage: ${config.prefix}allmenu`;
                break;
            default:
                helpText = `No help found for *${command}*. Try ${config.prefix}allmenu to see all commands.`;
        }
        
        await sock.sendMessage(from, {
            text: helpText,
            contextInfo: {
                isForwarded: false,
                forwardingScore: 0
            }
        });
    }
};

module.exports = {
    commands,
    ownerOnly: false,
    groupOnly: false,
    adminOnly: false
};
