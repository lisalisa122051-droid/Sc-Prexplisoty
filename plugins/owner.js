const jidUtils = require('../lib/jidUtils');
const config = require('../config');
const { sendThumbnailMenu } = require('../lib/function');

module.exports = {
    commands: ['owner', 'self', 'public', 'restart', 'eval'],
    
    execute: async (sock, m, command, body) => {
        if (!jidUtils.isOwner(m.sender)) {
            return sock.sendMessage(m.chat, { text: `❌ Command ini khusus owner!` });
        }

        switch (command) {
            case 'owner':
                await sendThumbnailMenu(sock, m,
                    `👑 *OWNER MENU*\n\n` +
                    `✅ Owner: ${config.owner}\n` +
                    `📱 Status: Active`);
                break;
                
            case 'self':
                global.public = false;
                await sock.sendMessage(m.chat, { text: `✅ Bot mode SELF` });
                break;
                
            case 'public':
                global.public = true;
                await sock.sendMessage(m.chat, { text: `✅ Bot mode PUBLIC` });
                break;
                
            case 'restart':
                await sock.sendMessage(m.chat, { text: `🔄 Restarting bot...` });
                process.exit(1);
                break;
                
            case 'eval':
                try {
                    let evaled = await eval(body.slice(6));
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                    await sock.sendMessage(m.chat, { text: `${evaled}` });
                } catch (e) {
                    await sock.sendMessage(m.chat, { text: `${e}` });
                }
                break;
        }
    }
};
