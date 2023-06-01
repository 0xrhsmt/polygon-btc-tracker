// dune execution api の実行
// request id を kv に保存する

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { QueryParameter, DuneClient } from "@cowprotocol/ts-dune-client";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const DUNE_API_KEY = process.env['DUNE_API_KEY']

async function getDuneQueryResult(executionId: string) {
    const client = new DuneClient(DUNE_API_KEY ?? "");

    return await client.getResult(executionId)
}

const DUNE_HOLDERS_QUERY_SUPPORTED_CHAINS = ["polygon", 'ethereum'] as const


export async function GET(request: Request) {
    // TODO: verify that the request is coming from vercel cron.

    const keys = await kv.smembers("coin_keys");
    for (const chain of DUNE_HOLDERS_QUERY_SUPPORTED_CHAINS) {
        const getResultPromises = keys.map(async (key) => {
            const state: string = await kv.hget(key, `dune_holders_${chain}_state`);
            const executionId: string = await kv.hget(key, `dune_holders_${chain}_execution_id`);

            if (!['QUERY_STATE_PENDING', 'QUERY_STATE_EXECUTING'].includes(state)) {
                return Promise.resolve();
            }
            if (!executionId) {
                return Promise.resolve();
            }

            const res = await getDuneQueryResult(executionId)
            if (['QUERY_STATE_PENDING', 'QUERY_STATE_EXECUTING'].includes(res.state)) {
                return Promise.resolve();
            }
            const value: {[field: string]: any} = {
                [`dune_holders_${chain}_state`]: res.state,
                [`dune_holders_${chain}_execution_ended_at`]: res.execution_ended_at,
            }
            if (res.state === 'QUERY_STATE_COMPLETED' && res.result) {
                value[`dune_holders_${chain}_result`] = JSON.stringify(res.result)
            }
            await kv.hmset(key, value)
        });

        await Promise.all(getResultPromises);
    }

    return NextResponse.json({});
}
