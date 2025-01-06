function a0_0x34d7() {
    const _0x4cf391 = [
        '...', '441000Pxzsxi', 'getMangoUser', 'Please\x20input\x20your\x20account\x20first\x20in\x20the\x20accounts.ts\x20file', 'refCheck', '2550132BagEcp', 'getSwapTask', 'message', 'info', 'swapTask', '32OXSMwX', 'exchange', 'length', 'stringify', 'exchangeTask', 'Accounts\x20Processing\x20Complete,\x20Delaying\x20For\x20', '2XiFzjB', 'delay', 'BOT\x20STARTED', 'map', 'Premium', 'getAccountInfo', 'title', 'msToTime', 'detail', 'getFaucet', 'clear', 'discordTask', 'connectMango', 'checkIn', '756815veSZpQ', '442573eJzxLG', 'MGO', 'USDT', 'status', 'addStep', 'step', 'find', 'Error\x20during\x20bot\x20execution', '7nxrKDN', 'log', 'showSkelLogo', 'swap', 'MAI', '26463sNuTLo', 'getExchangeTask', 'Application\x20Started', '2426592qUEmbf', 'all', 'getBalance', 'getDiscordTask', '13869390NNBwSV', '\x20Task\x20is\x20now\x20Synchronizing'
    ];
    a0_0x34d7 = function () {
        return _0x4cf391;
    };
    return a0_0x34d7();
}

(function (_0x463c43, _0x523267) {
    const _0x1048f1 = a0_0x2aa8, _0x57c9ff = _0x463c43();
    while (!![]) {
        try {
            const _0x256c0b = parseInt(_0x1048f1(0xe7)) / 0x1 * (-parseInt(_0x1048f1(0xd8)) / 0x2) + parseInt(_0x1048f1(0xf4)) / 0x3 * (parseInt(_0x1048f1(0xd2)) / 0x4) + -parseInt(_0x1048f1(0xe6)) / 0x5 + parseInt(_0x1048f1(0xf7)) / 0x6 * (-parseInt(_0x1048f1(0xef)) / 0x7) + parseInt(_0x1048f1(0xfe)) / 0x8 + -parseInt(_0x1048f1(0x102)) / 0x9 + parseInt(_0x1048f1(0xfb)) / 0xa;
            if (_0x256c0b === _0x523267) break; else _0x57c9ff.push(_0x57c9ff.shift());
        } catch (_0x2c2ba6) {
            _0x57c9ff.push(_0x57c9ff.shift());
        }
    }
}(a0_0x34d7, 0x38604));

import { accountList } from './accounts/accounts.js';
import './src/chain/dest_chain.js';
import { COINS } from './src/coin/coins.js';
import { CoreService } from './src/service/core-service.js';
import { Helper } from './src/utils/helper.js';

function a0_0x2aa8(_0x31c62d, _0x38f87e) {
    const _0x34d7ff = a0_0x34d7();
    return a0_0x2aa8 = function (_0x2aa832, _0x5804ef) {
        _0x2aa832 = _0x2aa832 - 0xd1;
        let _0x11fe8c = _0x34d7ff[_0x2aa832];
        return _0x11fe8c;
    }, a0_0x2aa8(_0x31c62d, _0x38f87e);
}

import a0_0x21a9b3 from './src/utils/logger.js';

async function performAccountOperation(_0x542054)

async function startBot() {
    const _0x532fa6 = a0_0x2aa8;
    try {
        a0_0x21a9b3[_0x532fa6(0x105)](_0x532fa6(0xda));
        if (accountList[_0x532fa6(0xd4)] === 0x0) throw new Error(_0x532fa6(0x100));
        const _0x4702a0 = accountList[_0x532fa6(0xdb)](_0x47fe80 => performAccountOperation(_0x47fe80));
        await Promise[_0x532fa6(0xf8)](_0x4702a0);
    } catch (_0x4921b5) {
        a0_0x21a9b3[_0x532fa6(0x105)]('BOT\x20STOPPED');
        a0_0x21a9b3['error'](JSON[_0x532fa6(0xd5)](_0x4921b5));
        throw _0x4921b5;
    }
}

(async () => {
    const _0x113b03 = a0_0x2aa8;
    try {
        a0_0x21a9b3[_0x113b03(0xe2)]();
        a0_0x21a9b3[_0x113b03(0x105)]('');
        a0_0x21a9b3['info'](_0x113b03(0xf6));
        Helper[_0x113b03(0xf1)]();
        await startBot();
    } catch (_0xf89528) {
        console[_0x113b03(0xf0)](_0x113b03(0xee), _0xf89528);
        await startBot();
    }
})();
