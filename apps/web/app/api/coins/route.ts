import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

let cachedCoinKeys = []
async function getCoinKeys() {
    if (cachedCoinKeys.length === 0) {
        cachedCoinKeys = await kv.smembers("coin_keys");
    }

    return cachedCoinKeys
}

export async function GET() {
    const coinKeys = await getCoinKeys()
    
    const pipeline = kv.pipeline();
    coinKeys.forEach((key) => pipeline.hgetall(key));
    const data = await pipeline.exec();

    return NextResponse.json({ data });
}