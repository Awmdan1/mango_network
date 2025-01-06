import { accountList } from './accounts/accounts.js';
import './src/chain/dest_chain.js';
import { COINS } from './src/coin/coins.js';
import { CoreService } from './src/service/core-service.js';
import { Helper } from './src/utils/helper.js';
import logger from './src/utils/logger.js';

async function performAccountOperation(account) {
    const coreService = new CoreService(account);
    try {
        await coreService.connectMango();
        await coreService.refCheck(true);
        await coreService.getFaucet();
        await coreService.getMangoUser(true);
        const user = coreService.user;
        await Helper.clear(user.status);
        await coreService.getSwapTask();
        await coreService.getExchangeTask();
        await coreService.getDiscordTask();

        if (coreService.swapTask.step.find(step => step.status === '0') !== undefined) {
            await coreService.swap(COINS.MAI, COINS.USDT);
            await coreService.exchange(COINS.USDT, COINS.MGO);
            for (const step of coreService.swapTask.step) {
                if (step.status === '0') {
                    await coreService.addStep(coreService.swapTask.ID, step);
                }
            }
            await Helper.delay(2000, account, coreService.swapTask.title + ' Task is now Synchronizing', coreService);
            await coreService.getMangoUser(true);
        }
        
        await coreService.getBalance();
        coreService.exchangeTask.step.find(step => step.status === '0') !== undefined && await coreService.addStep(coreService.exchangeTask.ID, coreService.exchangeTask.step[0]);
        await coreService.getDiscordTask();

        if (coreService.discordTask.step.find(step => step.status === '0') !== undefined) {
            await coreService.swap(COINS.MAI, COINS.USDT);
            await coreService.exchange(COINS.USDT, COINS.Premium);
            await coreService.exchange(COINS.Premium, COINS.USDT);
            for (const step of coreService.exchangeTask.step) {
                if (step.status === '0') {
                    await coreService.addStep(coreService.exchangeTask.ID, step);
                }
            }
            await Helper.delay(2000, account, coreService.exchangeTask.title + ' Task is now Synchronizing', coreService);
            await coreService.getMangoUser(true);
        }
        
        await coreService.exchange(COINS.USDT, COINS.MGO);
        await Helper.delay(86400000, account, 'Accounts Processing Complete, Delaying For ' + Helper.msToTime(86400000) + ' Task is now Synchronizing', coreService);
    } catch (error) {
        logger.error(error.message);
        await Helper.delay(5000, account, error.message, coreService);
        performAccountOperation(account);
    }
}

async function startBot() {
    try {
        logger.info('BOT STARTED');
        if (accountList.length === 0) throw new Error('Please input your account first in the accounts.ts file');
        const accountOperations = accountList.map(account => performAccountOperation(account));
        await Promise.all(accountOperations);
    } catch (error) {
        logger.error('BOT STOPPED');
        logger.error(JSON.stringify(error));
        throw error;
    }
}

(async () => {
    try {
        logger.showSkelLogo();
        logger.info('');
        logger.info('Application Started');
        Helper.connectMango();
        await startBot();
    } catch (error) {
        console.log('Error during bot execution', error);
        await startBot();
    }
})();
