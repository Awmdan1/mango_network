import logger from './twist.js'; // Pastikan ini mengimpor modul logger yang benar

export class Helper {
    // Metode delay untuk menunda eksekusi
    static delay(ms, account, message, context) {
        return new Promise(async (resolve) => {
            let remainingTime = ms;
            if (account !== undefined) {
                await logger.log(message, account, context, 'Menunggu selama ' + this.msToTime(ms));
            } else {
                logger.info('Menunggu selama ' + this.msToTime(ms));
            }

            const interval = setInterval(async () => {
                remainingTime -= 1000;
                if (account !== undefined) {
                    await logger.log(message, account, context, 'Menunggu selama ' + this.msToTime(remainingTime));
                } else {
                    logger.info('Menunggu selama ' + this.msToTime(remainingTime));
                }
                if (remainingTime <= 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);

            setTimeout(async () => {
                clearInterval(interval);
                await logger.clearInfo();
                if (account) {
                    await logger.log(message, account, context);
                }
                resolve();
            }, ms);
        });
    }

    // Metode untuk mengonversi milidetik ke format waktu yang bisa dibaca
    static msToTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.round((ms % 60000) / 1000);
        return `${hours} Jam ${minutes} Menit ${seconds} Detik`;
    }

    // Hapus metode checkReferral karena tidak diperlukan lagi
    // static checkReferral(referralCode) {
    //     if (referralCode !== 'validReferralCode') {
    //         throw new Error('Maaf, Anda tidak dapat menggunakan bot ini. Silakan bergabung dengan kode referral pembuat.');
    //     }
    // }

    // Metode untuk mendapatkan User Agent acak
    static randomUserAgent() {
        const userAgents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/125.2535.60 Mobile/15E148 Safari/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 EdgA/124.0.2478.104',
            'Mozilla/5.0 (Linux; Android 10; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 OPR/76.2.4027.73374',
            'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 EdgA/124.0.2478.104',
            'Mozilla/5.0 (Linux; Android 10; SM-N975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 OPR/76.2.4027.73374'
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    // Metode untuk menampilkan logo Skel
    static showSkelLogo() {
        console.log(`
          █████████    █████ ███████████    ██████████    ███████████        ███████    ███████████        █████████    █████████    █████████
          ███░░░░░███  ░░███ ░░███░░░░░███  ░░███░░░░███  ░░███░░░░░███      ███░░░░░███  ░░███░░░░░███      ███░░░░░███  ███░░░░░███  ███░░░░░███
          ░███    ░███   ░███  ░███    ░███   ░███    ░░███ ░███    ░███     ░███    ░░███   ░███    ░███     ░███    ░███ ░███    ░░░  ░███    ░░░
          ░███████████   ░███  ░██████████    ░███     ░███ ░██████████     ░███     ░███   ░██████████      ░███████████ ░░█████████  ░█████████
          ░███░░░░░███   ░███  ░███░░░░░███   ░███     ░███ ░███░░░░░███    ░███     ░███   ░███░░░░░░       ░███░░░░░███   ░░░░░░░░███ ░░░░░░░░███
          ░███    ░███   ░███  ░███    ░███   ░███     ███  ░███    ░███    ░███     ░███   ░███             ░███    ░███  ███    ░███  ███    ░███
          ████████████   █████ █████   █████  ███████████  █████   █████   ████████████ ███████████ ████████████ ███████████ ██████████  ██████████
          ░░░░░░░░░░░   ░░░░░ ░░░░░   ░░░░░  ░░░░░░░░░░░  ░░░░░   ░░░░░   ░░░░░░░░░░░  ░░░░░░░░░░░ ░░░░░░░░░░░  ░░░░░░░░░░░  ░░░░░░░░░░  ░░░░░░░░░░
          ================================================================
          BOT           : MANGO NETWORK
          Telegram Channel: @airdropasc
          Telegram Group  : @autosultan_group
          ================================================================
        `);
    }

    // Tambahkan metode clear jika diperlukan, atau gunakan delay sebagai penggantinya
    static clear(status) {
        console.log(`Clearing status: ${status}`);
    }
}
