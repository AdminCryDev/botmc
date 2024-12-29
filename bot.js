const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'mineskyid2.aternos.me',
    port: 29799,
    username: 'BTMC_',
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

  // Mencegah bot menghancurkan blok
  bot.on('blockBreakProgressObserved', () => {
    bot.stopDigging();
  });

  bot.on('time', () => {
    if (bot.time.isNight) {
      console.log('Sudah malam, mencari tempat tidur...');
      findAndSleep();
    }
  });

  function moveRandomly() {
    const x = bot.entity.position.x + (Math.random() * 20 - 10);
    const z = bot.entity.position.z + (Math.random() * 20 - 10);
    const y = bot.entity.position.y;

    bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));

    bot.setControlState('jump', true); // Bot melompat
    setTimeout(() => bot.setControlState('jump', false), 1000);

    setTimeout(moveRandomly, 10000); // Pindah setiap 10 detik
  }

  function findAndSleep() {
    const bed = bot.findBlock({
      matching: block => bot.isABed(block),
      maxDistance: 32, // Cari tempat tidur dalam radius 32 blok
    });

    if (bed) {
      console.log('Menemukan tempat tidur, mencoba tidur...');
      bot.pathfinder.setGoal(new goals.GoalBlock(bed.position.x, bed.position.y, bed.position.z));

      setTimeout(() => {
        bot.sleep(bed, (err) => {
          if (err) {
            console.log(`Gagal tidur: ${err.message}`);
          } else {
            console.log('Berhasil tidur!');
          }
        });
      }, 2000); // Beri waktu untuk mencapai tempat tidur
    } else {
      console.log('Tidak ada tempat tidur di sekitar.');
    }
  }

  bot.on('kicked', (reason) => {
    console.log('Bot di-kick dari server:', reason);
  });

  bot.on('error', (err) => {
    console.error('Terjadi error:', err);
  });

  bot.on('end', () => {
    console.log('Bot terputus, mencoba reconnect...');
    setTimeout(createBot, 5000);
  });
}

createBot();
