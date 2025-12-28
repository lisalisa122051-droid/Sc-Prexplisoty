module.exports = {
    commands: ['sticker', 'toimg', 'toaudio', 'shortlink'],
    
    execute: async (sock, m, command) => {
        switch (command) {
            case 'sticker':
                if (!m.quoted || !m.quoted.img) {
                    return sock.sendMessage(m.chat, { text: `❌ Reply gambar/video dengan .sticker` });
                }
                // Sticker logic here
                await sock.sendMessage(m.chat, { text: `✅ Sticker sedang diproses!` });
                break;
        }
    }
};
