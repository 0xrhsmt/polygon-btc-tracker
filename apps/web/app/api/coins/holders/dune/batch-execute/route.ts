// dune execution api の実行
// request id を kv に保存する

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { QueryParameter, DuneClient } from "@cowprotocol/ts-dune-client";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const { DUNE_API_KEY } = process.env;
const DUNE_ERC20_HOLDERS_QUERY_ID = 2492386;
const DUNE_HOLDERS_QUERY_SUPPORTED_CHAINS = ["polygon", 'ethereum'] as const
const DUNE_TARGET_CHAIN = (chain:  typeof DUNE_HOLDERS_QUERY_SUPPORTED_CHAINS[number]) => `erc20_${chain}.evt_Transfer`


async function executeDuneQuery(contractAddress: string, chain: typeof DUNE_HOLDERS_QUERY_SUPPORTED_CHAINS[number]) {
    const client = new DuneClient(DUNE_API_KEY ?? "");
    const parameters = [
        QueryParameter.text("TARGET_CHAIN", DUNE_TARGET_CHAIN(chain)),
        QueryParameter.text("TARGET_TOKEN_ADDRESS", contractAddress),
    ];

    return await client.execute(DUNE_ERC20_HOLDERS_QUERY_ID, parameters)
}

function check24HoursPassed(time: string) {
    const oldTime = dayjs(time);
    const currentTime = dayjs();

    const diff = currentTime.diff(oldTime);
    const durationObj = dayjs.duration(diff);

    return durationObj.asHours() >= 24

}

export async function GET(request: Request) {
    // TODO: verify that the request is coming from vercel cron.

    const keys = await kv.smembers("coin_keys");

    for (const chain of DUNE_HOLDERS_QUERY_SUPPORTED_CHAINS) {
        const executionPromises = keys.map(async (key) => {
            const contractAddress: string = await kv.hget(key, `${chain}_contract_address`);
            const state: string = await kv.hget(key, `dune_holders_${chain}_state`);
            const startAt: string = await kv.hget(key, `dune_holders_${chain}_execution_submitted_at`);
            const endAt: string = await kv.hget(key, `dune_holders_${chain}_execution_ended_at`);

            if (!contractAddress) {
                return Promise.resolve();
            }
            if (['QUERY_STATE_PENDING', 'QUERY_STATE_EXECUTING'].includes(state)) {
                return Promise.resolve();
            }
            if ((startAt !== null && endAt === null) || (endAt !== null && !check24HoursPassed(endAt))) {
                return Promise.resolve();
            }

            const res = await executeDuneQuery(contractAddress, chain)
            await kv.hmset(key, {
                [`dune_holders_${chain}_state`]: res.state,
                [`dune_holders_${chain}_execution_id`]: res.execution_id,
                [`dune_holders_${chain}_execution_submitted_at`]: new Date(),
                [`dune_holders_${chain}_execution_ended_at`]: null,
            })
        });

        await Promise.all(executionPromises);

    }

    return NextResponse.json({});
}
