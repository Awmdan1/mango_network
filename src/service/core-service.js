import { getFullnodeUrl, MgoClient, MgoHTTPTransport } from '@mgonetwork/mango.js/client';
import { Ed25519Keypair } from '@mgonetwork/mango.js/keypairs/ed25519';
import { Helper } from '../utils/helper.js';
import { bcs, decodeMgoPrivateKey, MIST_PER_MGO, TransactionBlock } from '@mgonetwork/mango.js';
import { API } from './api.js';
import { SIGNPACKAGE } from '../packages/sign-package.js';
import { AMMPACKAGE } from '../packages/amm-package.js';
import { COINS } from '../coin/coins.js';
import { BEINGDEXPACKAGE } from '../packages/beingdex.js';
import { accountList } from '../../accounts/accounts.js';
import { proxyList } from '../../config/proxy_list.js';
import { MANGOBRIDGEPACKAGE } from '../packages/mangobridge.js';
import { BRIDGE } from '../chain/dest_chain.js';

export class CoreService extends API {
    constructor(account) {
        const accountIndex = accountList.indexOf(account);
        if (proxyList.length !== accountList.length && proxyList.length !== 0) {
            throw new Error(`You Have ${accountList.length} Accounts But Provide ${proxyList.length}`);
        }
        const proxy = proxyList[accountIndex];
        super(proxy);
        this.acc = account;
        this.network = 'testnet';
        this.client = new MgoClient({ transport: new MgoHTTPTransport({ url: getFullnodeUrl('testnet') }) });
    }

    async getAccountInfo() {
        try {
            await Helper.delay(500, this.acc, 'Getting Account Information...', this);
            const privateKey = decodeMgoPrivateKey(this.acc);
            this.keypair = Ed25519Keypair.fromSecretKey(privateKey.secretKey);
            this.address = this.keypair.getPublicKey().toMgoAddress();
            await Helper.delay(1000, this.acc, 'Successfully Get Account Information', this);
        } catch (error) {
            throw error;
        }
    }

    async connectMango() {
        try {
            await Helper.delay(500, this.acc, 'Connecting to mango DAPPS...', this);
            const signTime = Math.floor(Date.now() / 1000);
            const signData = {
                address: this.address,
                signTime: signTime,
                signType: 'Login'
            };
            const signMessage = new TextEncoder().encode(JSON.stringify(signData));
            const signature = await this.keypair.signPersonalMessage(signMessage);
            const response = await this.fetch('https://task-api.testnet.mangonetwork.io/mgoUser/loginMgoUserPublic', 'POST', {
                signData: signature.signature,
                address: this.address,
                signTime: signTime
            });
            if (response.data.code === 0) {
                this.token = response.data.data.token;
                await Helper.delay(500, this.acc, response.data.msg, this);
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            throw error;
        }
    }

    async getMangoUser(showDelay = false) {
        try {
            if (showDelay) {
                await Helper.delay(500, this.acc, 'Getting User Information...', this);
            }
            const response = await this.fetch('https://task-api.testnet.mangonetwork.io/mgoUser/getMgoUser', 'GET', undefined, this.token);
            if (response.data.code === 0) {
                this.user = response.data.data;
                if (showDelay) {
                    await Helper.delay(500, this.acc, response.data.msg, this);
                }
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            throw error;
        }
    }

    async getSwapTask() {
        try {
            await Helper.delay(2000, this.acc, 'Getting Swap Task Details..', this);
            const response = await this.fetch('https://task-api.testnet.mangonetwork.io/base/taskDetail', 'POST', { taskId: 2, type: 0 }, this.token);
            if (response.data.code === 0) {
                this.swapTask = response.data.data;
                await Helper.delay(500, this.acc, response.data.msg, this);
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            throw error;
        }
    }

    async getExchangeTask() {
        try {
            await Helper.delay(2000, this.acc, 'Getting BeingDex Task Details..', this);
            const response = await this.fetch('https://task-api.testnet.mangonetwork.io/base/taskDetail', 'POST', { taskId: 5, type: 0 }, this.token);
            if (response.data.code === 0) {
                this.exchangeTask = response.data.data;
                await Helper.delay(500, this.acc, response.data.msg, this);
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            throw error;
        }
    }

    async getDiscordTask() {
        try {
            await Helper.delay(2000, this.acc, 'Getting Discord Task Details..', this);
            const response = await this.fetch('https://task-api.testnet.mangonetwork.io/base/taskDetail', 'POST', { taskId: 3, type: 0 }, this.token);
            if (response.data.code === 0) {
                this.discordTask = response.data.data;
                await Helper.delay(500, this.acc, response.data.msg, this);
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            throw error;
        }
    }

    async addStep(taskId, step, showDelay = true) {
        try {
            if (showDelay) {
                await Helper.delay(2000, this.acc, `Try Completing Step ${step.label}...`, this);
            }
            await this.fetch('https://task-api.testnet.mangonetwork.io/base/addStep', 'POST', { taskId, stepId: step.sort }, this.token);
        } catch (error) {
            throw error;
        }
    }

    async getBalance(showDelay = false) {
        try {
            if (showDelay) {
                await Helper.delay(500, this.acc, 'Getting Account Balance...', this);
            }
            this.balances = await this.client.getAllBalances({ owner: this.address });
            this.balances = this.balances.map(balance => {
                balance.totalBalance = parseFloat((Number(balance.totalBalance) / Number(MIST_PER_MGO)).toFixed(5));
                return balance;
            });
            if (showDelay) {
                await Helper.delay(1000, this.acc, 'Successfully Get Account Balance', this);
            }
        } catch (error) {
            throw error;
        }
    }

    async getFaucet() {
        try {
            await Helper.delay(1000, this.acc, 'Requesting MGO Faucet', this);
            const response = await this.fetch('https://task-api.testnet.mangonetwork.io/base/getFaucet', 'POST', { chain: '0', type: false }, this.token);
            if (response.status === 200) {
                await Helper.delay(1000, this.acc, response.data.msg, this);
                await this.getBalance();
            } else {
                throw response;
            }
            await this.addStep(1, { label: 'Gas', value: 'Gas', extend: 'Gas', sort: 0 }, false);
        } catch (error) {
            await Helper.delay(3000, this.acc, error.data.msg, this);
        }
    }

    async checkIn() {
        try {
            await Helper.delay(1000, this.acc, 'Trying to Daily Sign In', this);
            const txBlock = new TransactionBlock();
            txBlock.moveCall({
                target: SIGNPACKAGE.ADDRESS + '::sign::sign_in',
                arguments: [
                    txBlock.pure(SIGNPACKAGE.MODULE.SIGNPOOL.CLOCK),
                    txBlock.object(SIGNPACKAGE.MODULE.SIGNPOOL.SIGNPOOL)
                ]
            });
            await this.executeTx(txBlock);
            await Helper.delay(1000, this.acc, 'Successfully Daily Sign In', this);
        } catch (error) {
            await Helper.delay(1000, this.acc, 'Failed to Daily Sign In, Possible already Sign In', this);
        }
    }

    async swap(coinA, coinB) {
        try {
            const txBlock = new TransactionBlock();
            let coins = await this.client.getCoins({ owner: this.address, coinType: coinA.TYPE });
            if (coins.data[0].totalBalance === 0) {
                await Helper.delay(10000, this.acc, `Not enough ${coinA.SYMBOL} balance or already Swaped`, this);
                return;
            }
            while (coins.data.length === 0) {
                coins = await this.client.getCoins({ owner: this.address, coinType: coinA.TYPE });
                await this.getBalance();
                await Helper.delay(10000, this.acc, 'Delaying for ' + Helper.msToTime(10000) + ' until swap balance update', this);
            }
            if (coins.data.length > 1) {
                await this.mergeCoin(coinA);
                coins = await this.client.getCoins({ owner: this.address, coinType: coinA.TYPE });
            }
            let amount = Number(coins.data[0].totalBalance);
            const swapAmount = txBlock.splitCoins(txBlock.object(coins.data[0].coinObjectId), [txBlock.pure(amount)]);
            await Helper.delay(1000, this.acc, `Try to Swapping ${parseFloat((Number(amount) / Number(MIST_PER_MGO)).toFixed(2))} ${coinA.SYMBOL} to ${coinB.SYMBOL}`, this);
            txBlock.moveCall({
                target: AMMPACKAGE.ADDRESS + '::amm_script::swap_exact_coinA_for_coinB',
                typeArguments: [coinA.TYPE, coinB.TYPE],
                arguments: [
                    swapAmount,
                    txBlock.object(AMMPACKAGE.MODULE.AMMCONFIG.AIUSDTPOOL),
                    txBlock.pure(amount),
                    txBlock.pure(amount)
                ]
            });
            await this.executeTx(txBlock);
            await Helper.delay(1000, this.acc, `Successfully Swapping ${parseFloat((Number(amount) / Number(MIST_PER_MGO)).toFixed(2))} ${coinA.SYMBOL} to ${coinB.SYMBOL}`, this);
        } catch (error) {
            throw error;
        }
    }

    async exchange(coinA, coinB) {
        try {
            await Helper.delay(1000, this.acc, `Exchanging ${coinA.SYMBOL} to ${coinB.SYMBOL}`, this);
            const txBlock = new TransactionBlock();
            const coins = await this.client.getCoins({ owner: this.address, coinType: coinA.TYPE });
            if (coins.data.length === 0) {
                while (coins.data.length === 0) {
                    await this.getBalance();
                    await Helper.delay(10000, this.acc, 'Delaying for ' + Helper.msToTime(10000) + ' until swap balance update', this);
                }
            }
            if (coins.data.length > 1) {
                await this.mergeCoin(coinA);
                coins = await this.client.getCoins({ owner: this.address, coinType: coinA.TYPE });
            }
            const amount = Number(coins.data[0].totalBalance);
            txBlock.moveCall({
                target: BEINGDEXPACKAGE.ADDRESS + '::clob::market_buy',
                typeArguments: [coinA.TYPE, coinB.TYPE],
                arguments: [
                    txBlock.object(BEINGDEXPACKAGE.MODULE.CLOB.AIUSDTPOOL),
                    txBlock.object(coins.data[0].coinObjectId),
                    txBlock.pure(amount)
                ]
            });
            await this.executeTx(txBlock);
            await Helper.delay(1000, this.acc, `Successfully Exchanging ${parseFloat((Number(amount) / Number(MIST_PER_MGO)).toFixed(2))} ${coinA.SYMBOL} to ${coinB.SYMBOL}`, this);
        } catch (error) {
            throw error;
        }
    }

    async mergeCoin(coin) {
        try {
            const coins = await this.client.getCoins({ owner: this.address, coinType: coin.TYPE });
            if (coin === COINS.MGO && coins.data.length < 3) return;
            if (coins.data.length < 2) return;
            const txBlock = new TransactionBlock();
            const primaryCoin = coins.data[0].coinObjectId;
            const secondaryCoins = coins.data.slice(1).map(c => c.coinObjectId);
            await Helper.delay(1000, this.acc, `Merging ${coin.SYMBOL}`, this);
            await txBlock.mergeCoins(txBlock.object(primaryCoin), secondaryCoins.map(id => txBlock.object(id)));
            await this.executeTx(txBlock);
            await this.getBalance();
        } catch (error) {
            throw error;
        }
    }

    async bridge(destination) {
        try {
            const txBlock = new TransactionBlock();
            let coins = await this.client.getCoins({ owner: this.address, coinType: COINS.USDT.TYPE });
            if (coins.data.length === 0) {
                while (coins.data.length === 0) {
                    await this.getBalance();
                    await Helper.delay(10000, this.acc, 'Delaying for ' + Helper.msToTime(10000) + ' until swap balance update', this);
                }
            }
            if (coins.data.length > 1) {
                await this.mergeCoin(COINS.USDT);
                coins = await this.client.getCoins({ owner: this.address, coinType: COINS.USDT.TYPE });
            }
            const amount = Number(coins.data[0].totalBalance) * Number(MIST_PER_MGO);
            const bridgeAmount = txBlock.splitCoins(txBlock.object(coins.data[0].coinObjectId), [txBlock.pure(amount)]);
            await Helper.delay(1000, this.acc, `Try to Bridge ${parseFloat((Number(amount) / Number(MIST_PER_MGO)).toFixed(2))} ${COINS.USDT.SYMBOL} to ${destination}`, this);
            txBlock.moveCall({
                target: MANGOBRIDGEPACKAGE.ADDRESS + '::bridge::bridge_token',
                typeArguments: [COINS.USDT.TYPE],
                arguments: [
                    txBlock.object(MANGOBRIDGEPACKAGE.MODULE.BRIDGE.BRIDGEXECUTOR),
                    bridgeAmount,
                    txBlock.pure(destination),
                    txBlock.pure('0x1f0ea6e0b3590e1ab6c12ea0a24d3d0d9bf7707d')
                ]
            });
            await this.executeTx(txBlock);
            await Helper.delay(1000, this.acc, `Successfully Bridge ${parseFloat((Number(amount) / Number(MIST_PER_MGO)).toFixed(2))} ${COINS.USDT.SYMBOL} to ${destination}`, this);
        } catch (error) {
            throw error;
        }
    }

    // Fungsi untuk menjalankan transaksi
    async executeTx(txBlock) {
        try {
            await Helper.delay(1000, this.acc, 'Executing Tx ...', this);
            const txResult = await this.client.signAndExecuteTransactionBlock({ signer: this.keypair, transactionBlock: txBlock });
            await Helper.delay(3000, this.acc, `Tx Executed : ${this.network}/txblock/${txResult.digest}`, this);
            await this.getBalance();
            return txResult;
        } catch (error) {
            throw error;
        }
    }

    // Fungsi untuk membaca transaksi
    async readTx(txBlock) {
        try {
            const txResult = await this.client.devInspectTransactionBlock({ sender: this.address, transactionBlock: txBlock });
            return txResult;
        } catch (error) {
            throw error;
        }
    }
}
