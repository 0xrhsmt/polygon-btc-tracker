import * as dotenv from 'dotenv'
import { kv } from '@vercel/kv';

dotenv.config();

type Coins = {
    [key: string]: {
        order: number;
        coingecko_id: string;
        ethereum_contract_address: `0x${string}` | null;
        polygon_contract_address: `0x${string}` | null;
        token_decimals: number;

    }
}

const coins: Coins = {
    ['coin:WBTC']: {
        "order": 0,
        "coingecko_id": "wrapped-bitcoin",
        "ethereum_contract_address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        "polygon_contract_address": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        "token_decimals": 8,

    },
    ['coin:renBTC']: {
        "order": 1,
        "coingecko_id": "renbtc",
        "ethereum_contract_address": "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
        "polygon_contract_address": "0xDBf31dF14B66535aF65AaC99C32e9eA844e14501",
        "token_decimals": 8,
    },
    ['coin:sBTC']: {
        "order": 2,
        "coingecko_id": "sbtc",
        "ethereum_contract_address": "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6",
        "polygon_contract_address": null,
        "token_decimals": 18,
    },
    ['coin:HBTC']: {
        "order": 3,
        "coingecko_id": "huobi-btc",
        "ethereum_contract_address": "0x0316eb71485b0ab14103307bf65a021042c6d380",
        "polygon_contract_address": null,
        "token_decimals": 18,
    },
    ['coin:BTCB']: {
        "order": 4,
        "coingecko_id": "binance-bitcoin",
        "ethereum_contract_address": null,
        "polygon_contract_address": null,
        "token_decimals": 18,
    },
    ['coin:tBTC']: {
        "order": 5,
        "coingecko_id": "tbtc",
        "ethereum_contract_address": "0x18084fba666a33d37592fa2633fd49a74dd93a88",
        "polygon_contract_address": null,
        "token_decimals": 18,
    },
}

export async function main() {
    const pipeline = kv.pipeline();

    pipeline.sadd('coin_keys', ...Object.keys(coins))

    for (const [key, value] of Object.entries(coins)) {
        pipeline.hmset(key, value);
    }

    await pipeline.exec();
}

main()