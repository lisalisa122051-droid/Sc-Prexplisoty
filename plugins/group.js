const config = require('../config.js');
const { formatMessage } = require('../lib/function.js');
const { isAdmin } = require('../lib/jidUtils.js');

const commands = {
    welcome: async (message, sock, database) => {
        const { from, args, sender, isGroup } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        if (args.length < 1) {
            const status = database.groups?.[from]?.welcome ? 'ON' : 'OFF';
            
            // Button untuk toggle welcome
            const buttons = [
                {
                    buttonId: `${config.prefix}welcome on`,
                    buttonText: { displayText: '✅ TURN ON' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}welcome off`,
                    buttonText: { displayText: '❌ TURN OFF' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: formatMessage(
                    "WELCOME MESSAGE",
                    `Current status: *${status}*\n\n` +
                    `Select action below:`
                ),
                footer: "Group Settings",
                buttons: buttons,
                headerType: 1
            });
            return;
        }
        
        const action = args[0].toLowerCase();
        database.groups = database.groups || {};
        database.groups[from] = database.groups[from] || { id: from };
        
        if (action === 'on') {
            database.groups[from].welcome = true;
            await sock.sendMessage(from, { 
                text: '✅ Welcome message activated!\n\nNew members will receive welcome message.',
                footer: "Group Settings"
            });
        } else if (action === 'off') {
            database.groups[from].welcome = false;
            await sock.sendMessage(from, { 
                text: '✅ Welcome message deactivated!',
                footer: "Group Settings"
            });
        }
    },
    
    setname: async (message, sock, database) => {
        const { from, args, sender, isGroup } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        if (args.length < 1) {
            // Button untuk contoh setname
            const buttons = [
                {
                    buttonId: `${config.prefix}setname ${config.botName} Group`,
                    buttonText: { displayText: '🤖 Bot Group' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}setname Awesome Group`,
                    buttonText: { displayText: '🌟 Awesome Group' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: formatMessage(
                    "SET GROUP NAME",
                    `Usage: ${config.prefix}setname <new group name>\n\n` +
                    `Or tap button for example:`
                ),
                footer: "Group Management",
                buttons: buttons,
                headerType: 1
            });
            return;
        }
        
        const newName = args.join(' ');
        try {
            await sock.groupUpdateSubject(from, newName);
            await sock.sendMessage(from, { 
                text: `✅ Group name changed to:\n*${newName}*`,
                footer: "Group Updated"
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    setdesc: async (message, sock, database) => {
        const { from, args, sender, isGroup } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        if (args.length < 1) {
            await sock.sendMessage(from, { 
                text: `Usage: ${config.prefix}setdesc <new description>`
            });
            return;
        }
        
        const newDesc = args.join(' ');
        try {
            await sock.groupUpdateDescription(from, newDesc);
            await sock.sendMessage(from, { 
                text: `✅ Group description updated!\n\nNew description:\n${newDesc}`,
                footer: "Group Updated"
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    open: async (message, sock) => {
        const { from, sender, isGroup } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        try {
            await sock.groupSettingUpdate(from, 'not_announcement');
            
            // Button untuk group management
            const buttons = [
                {
                    buttonId: `${config.prefix}close`,
                    buttonText: { displayText: '🔒 Close Group' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}menu`,
                    buttonText: { displayText: '🏠 Menu' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: '✅ Group opened!\n\nAll members can send messages.',
                footer: "Group Settings",
                buttons: buttons,
                headerType: 1
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    close: async (message, sock) => {
        const { from, sender, isGroup } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        try {
            await sock.groupSettingUpdate(from, 'announcement');
            
            // Button untuk group management
            const buttons = [
                {
                    buttonId: `${config.prefix}open`,
                    buttonText: { displayText: '🔓 Open Group' },
                    type: 1
                },
                {
                    buttonId: `${config.prefix}menu`,
                    buttonText: { displayText: '🏠 Menu' },
                    type: 1
                }
            ];
            
            await sock.sendMessage(from, {
                text: '✅ Group closed!\n\nOnly admins can send messages.',
                footer: "Group Settings",
                buttons: buttons,
                headerType: 1
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    kick: async (message, sock) => {
        const { from, sender, isGroup, quoted } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        // Button untuk kick options
        const buttons = [
            {
                buttonId: `${config.prefix}kick @user`,
                buttonText: { displayText: '👤 Kick User' },
                type: 1
            },
            {
                buttonId: `${config.prefix}menu`,
                buttonText: { displayText: '🏠 Menu' },
                type: 1
            }
        ];
        
        let target = '';
        if (quoted) {
            target = quoted.sender;
        } else if (message.args[0]) {
            target = message.args[0].replace('@', '') + '@s.whatsapp.net';
        } else {
            await sock.sendMessage(from, {
                text: formatMessage(
                    "KICK USER",
                    `Usage:\n1. Reply message with ${config.prefix}kick\n2. ${config.prefix}kick @user\n\n` +
                    `Or use button below:`
                ),
                footer: "Group Management",
                buttons: buttons,
                headerType: 1
            });
            return;
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [target], 'remove');
            await sock.sendMessage(from, { 
                text: '✅ User kicked!',
                mentions: [target],
                footer: "Group Management"
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    promote: async (message, sock) => {
        const { from, sender, isGroup, quoted } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        let target = '';
        if (quoted) {
            target = quoted.sender;
        } else if (message.args[0]) {
            target = message.args[0].replace('@', '') + '@s.whatsapp.net';
        } else {
            await sock.sendMessage(from, { 
                text: `Usage: ${config.prefix}promote @user or reply message`
            });
            return;
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [target], 'promote');
            await sock.sendMessage(from, { 
                text: '✅ User promoted to admin!', 
                mentions: [target],
                footer: "Group Management"
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    },
    
    demote: async (message, sock) => {
        const { from, sender, isGroup, quoted } = message;
        
        if (!isGroup) {
            await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
            return;
        }
        
        const isUserAdmin = await isAdmin(sender, from, sock);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '❌ You need to be admin!' });
            return;
        }
        
        let target = '';
        if (quoted) {
            target = quoted.sender;
        } else if (message.args[0]) {
            target = message.args[0].replace('@', '') + '@s.whatsapp.net';
        } else {
            await sock.sendMessage(from, { 
                text: `Usage: ${config.prefix}demote @user or reply message`
            });
            return;
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [target], 'demote');
            await sock.sendMessage(from, { 
                text: '✅ User demoted from admin!', 
                mentions: [target],
                footer: "Group Management"
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    }
};

module.exports = {
    commands,
    ownerOnly: false,
    groupOnly: true,
    adminOnly: true
};
