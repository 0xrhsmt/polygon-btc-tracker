import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { PublicClient, createPublicClient, http } from 'viem'
import { mainnet, polygon } from 'viem/chains'
import erc20Abi from './erc20-abi.json'

const SUPPORTED_CHAINS = ["polygon", 'ethereum'] as const

const INFURA_API_KEY = process.env['INFURA_API_KEY']

const polygonClient = createPublicClient({
    chain: polygon,
    transport: http(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`)
})
const ethClient = createPublicClient({
    chain: mainnet,
    transport: http(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`)
})

const getClient = (chain: typeof SUPPORTED_CHAINS[number]): PublicClient => {
    switch (chain) {
        case 'polygon':
            return polygonClient
        case 'ethereum':
            return ethClient
    }
}


const fetchTotalSupply = async (contractAddress: `0x${string}`, chain: typeof SUPPORTED_CHAINS[number]): Promise<bigint> => {
    const client = getClient(chain)

    const data = await client.readContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'totalSupply',
    }) as bigint

    return data
}

export async function GET(request: Request) {
    // TODO: verify that the request is coming from vercel cron.
    const keys = await kv.smembers("coin_keys");

    for (const chain of SUPPORTED_CHAINS) {
        const fetchPromises = keys.map(async (key) => {
            const contractAddress: `0x${string}` = await kv.hget(key, `${chain}_contract_address`);
            if (!contractAddress) return;

            const data = await fetchTotalSupply(contractAddress, chain);

            await kv.hmset(key, { [`${chain}_total_supply`]: data.toString() });
        });

        await Promise.all(fetchPromises);

    }

    return NextResponse.json({});
}