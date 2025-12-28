const jidUtils = require('../lib/jidUtils');
const { sendThumbnailMenu } = require('../lib/function');

module.exports = {
    commands: ['welcome', 'setname', 'setdesc', 'open', 'close', 'kick', 'add', 'promote', 'demote'],
    
    execute: async (sock, m, command, body) => {
        if (!m.isGroup) return sock.sendMessage(m.chat, { text: `❌ Command ini hanya untuk group!` });
        
        const listMsg = {
            title: '⚙️ Group Settings',
            buttonText: 'Pilih Aksi',
            sections: [
                {
                    title: "Group Control",
                    rows: [
                        { title: "Open Group", rowId: ".open" },
                        { title: "Close Group", rowId: ".close" },
                        { title: "Set Name", rowId: ".setname nama baru" }
                    ]
                }
            ]
        };

        switch (command) {
            case 'welcome':
                // Admin check logic here
                await sock.sendMessage(m.chat, { text: `✅ Welcome ${body.slice(8) || 'ON'}` });
                break;
                
            case 'open':
                await sock.groupSettingUpdate(m.chat, 'unlocked');
                await sock.sendMessage(m.chat, { text: `✅ Group telah dibuka!` });
                break;
                
            case 'close':
                await sock.groupSettingUpdate(m.chat, 'locked');
                await sock.sendMessage(m.chat, { text: `✅ Group telah ditutup!` });
                break;
                
            case 'setname':
                await sock.groupUpdateSubject(m.chat, body.slice(9));
                await sock.sendMessage(m.chat, { text: `✅ Nama group diubah!` });
                break;
        }
    }
};
