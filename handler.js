const fs = require('fs-extra');
const path = require('path');
const { serialize } = require('./lib/serialize');
const { processBusinessInfo } = require('./lib/database');
const db = require('./lib/database');

module.exports = async (sock, msg, config) => {
    const m = await serialize(sock, msg);
    if (!m.message) return;
    
    const body = m.text || '';
    const prefix = config.prefix;
    const isCmd = prefix.some(p => body.startsWith(p));
    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
    
    // Process Business Info Message (WAJIB)
    await processBusinessInfo(sock, m, config);
    
    // Ignore business info response
    if (body === config.businessInfo) return;
    
    // Command handler
    if (isCmd) {
        const pluginPath = path.join(__dirname, 'plugins');
        const plugins = fs.readdirSync(pluginPath).filter(f => f.endsWith('.js'));
        
        for (const plugin of plugins) {
            const pluginModule = require(`./plugins/${plugin}`);
            if (pluginModule.commands.includes(command)) {
                return await pluginModule.execute(sock, m, command, body, config);
            }
        }
    }
};
