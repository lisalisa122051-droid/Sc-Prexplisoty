const jokes = [
    "Kenapa semut tidak bisa main bola? Karena takut digantung!",
    "Apa yang dikatakan robot saat lapar? Aku butuh baterai!",
    "Kenapa tomat merah? Karena malu liat cabai!"
];

module.exports = {
    commands: ['joke', 'tebakgambar', 'truth', 'dare', 'rate'],
    
    execute: async (sock, m, command, body) => {
        switch (command) {
            case 'joke':
                const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                await sock.sendMessage(m.chat, { text: `😂 *Joke:* ${randomJoke}` });
                break;
                
            case 'rate':
                const rate = Math.floor(Math.random() * 100);
                await sock.sendMessage(m.chat, { text: `⭐ Rating ${body.slice(6) || 'kamu'}: ${rate}/100` });
                break;
        }
    }
};
