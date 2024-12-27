const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'mineskyid2.aternos.me', // Ganti dengan alamat server Aternos Anda
    port: 29799, // Port default Minecraft
    username: 'NamaBotAnda', // Ganti dengan nama bot Anda
    auth: 'offline', // Non-premium mode
    version: '1.20.1', // Ganti dengan versi server Anda

  });

  bot.on('login', () => {
    console.log(`Bot berhasil login sebagai ${bot.username}`);
  });

  bot.on('end', () => {
    console.log('Bot terputus, mencoba reconnect...');
    setTimeout(createBot, 5000); // Coba reconnect setelah 5 detik
  });

  bot.on('error', (err) => {
    console.error('Terjadi error:', err);
  });
}

createBot();
