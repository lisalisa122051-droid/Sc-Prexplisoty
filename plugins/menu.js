const { sendThumbnailMenu } = require('../lib/function');
const config = require('../config');
const jidUtils = require('../lib/jidUtils');

module.exports = {
    commands: ['menu', 'allmenu', 'help'],
    
    execute: async (sock, m, command, body, config) => {
        const buttons = [
            { index: 1, urlButton: { displayText: '📱 Website', url: 'https://wa.me/6281234567890' } },
            { index: 2, callButton: { displayText: '📞 Call Owner', phoneNumber: '+6281234567890' } },
            { index: 3, quickReplyButton: { displayText: '📥 Download', id: '.play lagu' } },
            { index: 4, quickReplyButton: { displayText: '⚙️ Group', id: '.open' } },
            { index: 5, quickReplyButton: { displayText: '👑 Owner', id: '.owner' } }
        ];

        const listMsg = {
            title: '📋 Daftar Menu Lengkap',
            buttonText: 'Pilih Menu',
            description: 'Pilih salah satu menu dibawah ini:',
            footerText: `${config.botName}`,
            listType: 1,
            sections: [
                {
                    title: "📱 Utama",
                    rows: [
                        { title: "Menu", description: "Tampilkan menu utama", rowId: ".menu" },
                        { title: "Ping", description: "Cek kecepatan bot", rowId: ".ping" },
                        { title: "Info Bot", description: "Info lengkap bot", rowId: ".infobot" }
                    ]
                },
                {
                    title: "⬇️ Download",
                    rows: [
                        { title: "Play", description: "Download audio/video YT", rowId: ".play lagu" },
                        { title: "YT Video", description: "Download video YT", rowId: ".ytvideo" },
                        { title: "TikTok", description: "Download TikTok", rowId: ".tiktok" }
                    ]
                },
                {
                    title: "🛠️ Tools",
                    rows: [
                        { title: "Stiker", description: "Buat stiker", rowId: ".sticker" },
                        { title: "To Img", description: "Sticker ke gambar", rowId: ".toimg" },
                        { title: "Shortlink", description: "Pemendek URL", rowId: ".shortlink" }
                    ]
                }
            ]
        };

        switch (command) {
            case 'menu':
                await sendThumbnailMenu(sock, m, 
                    `✨ *MENU UTAMA ${config.botName}*\n\n` +
                    `📱 *Status:* Online\n` +
                    `⏱️ *Runtime:* ${require('../lib/function').getRuntime()}\n` +
                    `👤 *User:* ${jidUtils.extractPhoneFromJid(m.sender)}\n\n` +
                    `Klik button dibawah untuk menggunakan bot!`, 
                    buttons);
                break;
                
            case 'allmenu':
            case 'help':
                await sendThumbnailMenu(sock, m, 
                    `📋 *SEMUA MENU TERSEDIA*\n\n` +
                    `Klik list message untuk melihat semua command!`, 
                    null, listMsg);
                break;
        }
    }
};
