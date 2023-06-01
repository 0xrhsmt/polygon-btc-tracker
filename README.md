# Polygon BTC Tracker

This is a simple app that tracks the metrics of BTCs on Polygon. 
There are more than six types of Bridged BTC, and you can see their current status through basic metrics.
Also, it has also been implemented to be able to accommodate any increase in the types of Bridged BTC in the future.

## Demonstrations

### Live Demo

TODO: paste url

### Demo Video

TODO: paste url

## Architecture

TODO: image

### Metrics And Data Sources

|  Metrics  |  Data Source  | Description |
| ---- | ---- | ---- |
|  Volume |  CoinGecko API  |  Utilizing the [CoinGecko Public API](https://www.coingecko.com/en/api).  |
|  Market Cap |  CoinGecko API |  Utilizing the [CoinGecko Public API](https://www.coingecko.com/en/api).  |
|  Holders |  Dune API |  [The Dune Query](https://dune.com/queries/2492386) has been created to obtain the number of BTC holders, which is invoked using [the Dune API](https://dune.com/docs/api/).  |
|  Circulating Supply |  Polygon (Ethereum) JSON-RPC API |  The `totalSupply` function is called from the JSON-RPC API to retrieve the value.  |

## Development

### Requirements

* node
* turborepo
* pnpm

TODO: node version の指定

### How to run it

* install,
* turbo run dev
* open http://localhost:3000
* env とかも必要かも

## Production Deployment

## Commands
### Seed Data

### Add new Bridged BTC

## License

## Useful Links

- [Turborepo](TODO)
- [Coingecko API](TODO)
  [Dune API](TODO)
- [Vercel Storage](TODO)
- [Vercel Cron](TODO)
