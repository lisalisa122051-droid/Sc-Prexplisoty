module.exports = {
    commands: ['play', 'ytvideo', 'tiktok', 'instagram'],
    
    execute: async (sock, m, command, body) => {
        const buttons = [
            { quickReplyButton: { displayText: '🎵 Audio', id: '.play audio ' + body.slice(6) } },
            { quickReplyButton: { displayText: '🎥 Video', id: '.play video ' + body.slice(6) } }
        ];
        
        if (command === 'play') {
            await sock.sendMessage(m.chat, { 
                text: `🔍 *Searching:* ${body.slice(6)}\n\nPilih format di button bawah!`, 
                templateButtons: buttons 
            });
        }
    }
};
