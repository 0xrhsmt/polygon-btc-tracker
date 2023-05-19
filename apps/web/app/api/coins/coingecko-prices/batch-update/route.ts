import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

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

function checkCronKey(url: string) {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    const key = searchParams.get('key');

    const valid = key === process.env.CRON_SHARED_KEY
    console.log(key, process.env.CRON_SHARED_KEY, valid)

    if (!valid) {
        throw new Error('Invalid key');
    }
}

export async function GET(request: Request) {
    checkCronKey(request.url);

    const keys = await kv.smembers("coin_keys");
    const fetchPromises = keys.map(async (key) => {
        const id: string = await kv.hget(key, 'coingecko_id');
        const data = await fetchCoin(id);
        await kv.hmset(key, { coingecko_price: JSON.stringify(data) });
    });

    await Promise.all(fetchPromises);

    return NextResponse.json({});
}