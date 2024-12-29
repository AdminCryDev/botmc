const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'mineskyid2.aternos.me',
    port: 29799,
    username: 'BTMC',
    auth: 'offline',
    version: '1.21.4',
  });

  // Pasang plugin pathfinder
  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log(`Bot berhasil login sebagai ${bot.username}`);
  });

  bot.on('spawn', () => {
    const defaultMove = new Movements(bot, bot.mcData);
    bot.pathfinder.setMovements(defaultMove);

    // Mulai gerakan acak setelah spawn
    moveRandomly();
  });

  //alasan bot terputus
  bot.on('kicked', (reason, loggedIn) => {
    console.log('Bot di-kick dari server:', reason);
  });
  bot.on('error', (err) => {
    console.error('Terjadi error:', err);
  });
  bot.on('end', (reason) => {
    console.log('Bot terputus. Alasan:', reason);
  });


  // Event untuk reconnect jika terputus
  bot.on('end', () => {
    console.log('Bot terputus, mencoba reconnect...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.error('Terjadi error:', err);
  });

  // Event untuk memeriksa waktu malam
  bot.on('time', () => {
    if (bot.time.isNight) {
      console.log('Sudah malam, mencari tempat tidur...');
      findAndSleep();
    }
  });

  function moveRandomly() {
    // Pilih koordinat acak di sekitar bot
    const x = bot.entity.position.x + (Math.random() * 20 - 10);
    const z = bot.entity.position.z + (Math.random() * 20 - 10);
    const y = bot.entity.position.y;

    bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));

    setTimeout(moveRandomly, 10000); // Pindah setiap 10 detik
  }

  function findAndSleep() {
    const bed = bot.findBlock({
      matching: block => bot.isABed(block),
      maxDistance: 32, // Cari tempat tidur dalam jarak 32 blok
    });

    if (bed) {
      bot.chat('Menemukan tempat tidur, mencoba tidur...');
      bot.sleep(bed, (err) => {
        if (err) {
          bot.chat(`Tidak bisa tidur: ${err.message}`);
        } else {
          bot.chat('Tidur...');
        }
      });
    } else {
      bot.chat('Tidak ada tempat tidur di sekitar.');
    }
  }
}

createBot();
