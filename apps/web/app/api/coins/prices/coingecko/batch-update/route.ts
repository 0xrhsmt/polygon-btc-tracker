import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const COIN_BASE_URL = 'https://api.coingecko.com/api/v3/coins';

const buildCoinUrl = (tokenId: string) => {
    return `${COIN_BASE_URL}/${tokenId}`
}

const fetchCoin = async (tokenId: string) => {
    const url = buildCoinUrl(tokenId);
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    } else {
        console.error('Error:', response.status);
    }
}

export async function GET(request: Request) {
    // TODO: verify that the request is coming from vercel cron.

    const keys = await kv.smembers("coin_keys");
    const fetchPromises = keys.map(async (key) => {
        const id: string = await kv.hget(key, 'coingecko_id');
        if(!id) return;

        const data = await fetchCoin(id);
        await kv.hmset(key, { coingecko_price: JSON.stringify(data) });
    });

    await Promise.all(fetchPromises);

    return NextResponse.json({});
}