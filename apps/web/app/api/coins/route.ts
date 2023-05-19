import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
    const keys = await kv.smembers("coin_keys");

    const pipeline = kv.pipeline();
    keys.forEach((key) => pipeline.hgetall(key));
    const data = await pipeline.exec();

    return NextResponse.json({ data });
}