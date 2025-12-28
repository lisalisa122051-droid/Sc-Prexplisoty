const axios = require('axios');
const config = require('../config.js');
const { formatMessage, getBuffer, isValidUrl } = require('../lib/function.js');

const commands = {
    play: async (message, sock) => {
        const { from, args, quoted } = message;
        
        if (args.length < 1) {
            // Button untuk format selection
            const buttons = [
                {
                    buttonId: `${config.prefix}play music`,
                    buttonText: { displayText: '🎵 MUSIC' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}ytvideo tutorial`,
                    buttonText: { displayText: '📹 VIDEO' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: formatMessage(
                    "PLAY DOWNLOADER",
                    `Usage: ${config.prefix}play <song title>\n\n` +
                    `Example: ${config.prefix}play yellow coldplay\n\n` +
                    `Or select format below:`
                ),
                footer: config.botName,
                buttons: buttons,
                headerType: 1
            });
            return;
        }
        
        const query = args.join(' ');
        await sock.sendMessage(from, { text: `🔍 Searching: ${query}...` });
        
        try {
            // Button untuk format selection setelah search
            const buttons = [
                {
                    buttonId: `${config.prefix}ytvideo ${query}`,
                    buttonText: { displayText: '📹 Video' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}toaudio ${query}`,
                    buttonText: { displayText: '🎵 Audio' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}menu`,
                    buttonText: { displayText: '🏠 Menu' },
                    type: 1
                }
            ];
            
            const messageConfig = {
                text: formatMessage(
                    "SELECT FORMAT",
                    `*Title:* ${query}\n` +
                    `*Source:* YouTube\n` +
                    `*Status:* Available\n\n` +
                    `Choose format below:`
                ),
                footer: config.botName,
                buttons: buttons,
                headerType: 1
            };
            
            // Tambahkan quoted jika ada
            if (quoted) {
                messageConfig.contextInfo = {
                    stanzaId: quoted.id,
                    participant: quoted.sender,
                    quotedMessage: {
                        conversation: quoted.text || 'Play Command'
                    }
                };
            }
            
            await sock.sendMessage(from, messageConfig);
            
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    ytvideo: async (message, sock) => {
        const { from, args } = message;
        
        if (args.length < 1) {
            await sock.sendMessage(from, { 
                text: `Usage: ${config.prefix}ytvideo <url or title>`
            });
            return;
        }
        
        const query = args.join(' ');
        await sock.sendMessage(from, { text: `📥 Downloading YouTube video: ${query}...` });
        
        // Button untuk options
        const buttons = [
            {
                buttonId: `${config.prefix}play ${query}`,
                buttonText: { displayText: '🎵 Audio Only' },
                type: 1
            },
            {
                buttonId: `${config.prefix}menu`,
                buttonText: { displayText: '🏠 Menu' },
                type: 1
            }
        ];
        
        await sock.sendMessage(from, {
            text: "✅ Download started! Please wait...\n\nVideo quality: 720p\nFormat: MP4\nEstimated time: 1-2 minutes",
            footer: "YouTube Downloader",
            buttons: buttons,
            headerType: 1
        });
    },
    
    tiktok: async (message, sock) => {
        const { from, args } = message;
        
        if (args.length < 1) {
            await sock.sendMessage(from, { 
                text: `Usage: ${config.prefix}tiktok <url>`
            });
            return;
        }
        
        const url = args[0];
        if (!isValidUrl(url) || !url.includes('tiktok.com')) {
            await sock.sendMessage(from, { text: '❌ Invalid TikTok URL!' });
            return;
        }
        
        await sock.sendMessage(from, { text: '📥 Downloading TikTok...' });
        
        try {
            // Button untuk TikTok download options
            const buttons = [
                {
                    buttonId: `${config.prefix}tiktok ${url} no_wm`,
                    buttonText: { displayText: '🚫 No Watermark' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}tiktok ${url} audio`,
                    buttonText: { displayText: '🎵 Audio Only' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: formatMessage(
                    "TIKTOK DOWNLOADER",
                    `*URL:* ${url}\n` +
                    `*Status:* Processing...\n\n` +
                    `Select download option:`
                ),
                footer: "TikTok Downloader",
                buttons: buttons,
                headerType: 1
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    instagram: async (message, sock) => {
        const { from, args } = message;
        
        if (args.length < 1) {
            await sock.sendMessage(from, { 
                text: `Usage: ${config.prefix}instagram <url>`
            });
            return;
        }
        
        const url = args[0];
        if (!isValidUrl(url) || !url.includes('instagram.com')) {
            await sock.sendMessage(from, { text: '❌ Invalid Instagram URL!' });
            return;
        }
        
        await sock.sendMessage(from, { text: '📥 Downloading Instagram...' });
        
        try {
            // Button untuk Instagram download options
            const buttons = [
                {
                    buttonId: `${config.prefix}instagram ${url} photo`,
                    buttonText: { displayText: '🖼️ Photo' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}instagram ${url} video`,
                    buttonText: { displayText: '📹 Video' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}instagram ${url} story`,
                    buttonText: { displayText: '📱 Story' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: formatMessage(
                    "INSTAGRAM DOWNLOADER",
                    `*URL:* ${url}\n` +
                    `*Status:* Processing...\n\n` +
                    `Select download option:`
                ),
                footer: "Instagram Downloader",
                buttons: buttons,
                headerType: 1
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    }
};

module.exports = {
    commands,
    ownerOnly: false,
    groupOnly: false,
    adminOnly: false
};
