import { accountList } from './accounts/accounts.js';
import './src/chain/dest_chain.js';
import { COINS } from './src/coin/coins.js';
import { CoreService } from './src/service/core-service.js';
import { Helper } from './src/utils/helper.js';
import Logger from './src/utils/logger.js';

// Fungsi untuk menjalankan operasi pada satu akun
async function performAccountOperation(account) {
    const coreService = new CoreService(account);

    try {
        // Langkah-langkah eksekusi akun
        await coreService.connectMango();
        await coreService.getMangoUser(true);
        await coreService.getBalance();
        await coreService.getAccountInfo();

        const user = coreService.user;
        await Helper.delay(1000, account, `Processing account: ${user.title}`, coreService);

        // Operasi tambahan, seperti swap atau task lain
        if (coreService.swapTask.step.find(step => step.status === '0')) {
            await coreService.swap(COINS.MAI, COINS.USDT);
            await coreService.exchange(COINS.USDT, COINS.MGO);
        }

        await coreService.getDiscordTask();
        Logger.info(`Account ${user.title} processed successfully.`);
    } catch (error) {
        Logger.error(`Error during bot execution for account: ${account}. Error: ${error.message}`);
        await Helper.delay(5000, account, `Retrying account due to error: ${error.message}`, coreService);
        await performAccountOperation(account); // Retry operation
    }
}

// Fungsi utama untuk menjalankan bot
async function startBot() {
    try {
        Logger.info('BOT STARTED');

        if (accountList.length === 0) {
            throw new Error('Please input your accounts in the accounts.js file.');
        }

        const accountPromises = accountList.map(account => performAccountOperation(account));
        await Promise.all(accountPromises);

        Logger.info('All accounts processed successfully.');
    } catch (error) {
        Logger.error('BOT STOPPED');
        Logger.error(`Error: ${error.message}`);
        throw error;
    }
}

(async () => {
    try {
        Logger.showSkelLogo();
        Logger.info('Application Started');
        await startBot();
    } catch (error) {
        console.error('Critical error occurred:', error);
        await startBot(); // Retry entire bot if critical error occurs
    }
})();
