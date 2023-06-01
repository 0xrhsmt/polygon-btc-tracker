"use client";

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { Tooltip } from 'react-tooltip'
import Modal from 'react-modal';

const MODAL_STYLES = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const GITHUB_URL = 'https://github.com/0xrhsmt/polygon-btc-tracker'

export default function Page() {
  const [btc, setBtc] = useState<any>();
  const [coins, setCoins] = useState([]);
  const [modalState, setModalState] = useState({
    open: false,
    chain: undefined,
    tokenAddress: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/coins');
        const data = await response.json();
        setCoins(data.data.filter((a) => a.order !== null).sort((a, b) => a.order > b.order ? 1 : -1));
        setBtc(data.data.find((c) => c.coingecko_id === 'bitcoin'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const btcPrice = btc?.coingecko_price.market_data.current_price.usd ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(btc?.coingecko_price.market_data.current_price.usd) : '-'
  const circulatingSupply = btc?.coingecko_price.market_data.circulating_supply ? new Intl.NumberFormat('en-US', {
    style: 'decimal',
  }).format(btc?.coingecko_price.market_data.circulating_supply) : '-'
  const circulatingSupplyPolygon = coins.length > 0 ? new Intl.NumberFormat('en-US', {
    style: 'decimal',
  }).format(Math.ceil(coins.reduce((sum, c) => c.polygon_total_supply ? sum + parseFloat(formatUnits(BigInt(c.polygon_total_supply), c.token_decimals)) : sum, 0.0))) : '-'

  const openModal = useCallback((chain: string, tokenAddress: string) => {
    setModalState({
      open: true,
      chain,
      tokenAddress,
    })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({
      open: false,
      chain: undefined,
      tokenAddress: undefined,
    })
  }, [])

  return (
    <div>
      <header className="flex justify-start z-50 w-full bg-purple-600 border-b border-white/[.5] text-sm py-3 sm:py-0">
        <nav className="relative container mx-auto px-1 sm:px-0 w-full flex items-center justify-between  " aria-label="Global">
          <div className="flex items-center justify-between w-full">
            <a className="flex items-center text-xl font-semibold text-white cursor-pointer space-x-2" href="#" aria-label="Brand">
              <Image src="/logo.png" alt="Github" width={30} height={30} />
              <span>BTC Tracker on Polygon</span>
            </a>
          </div>
          <div id="navbar-collapse-with-animation" className="hs-collapse overflow-hidden transition-all duration-300 basis-full grow">
            <div className="flex flex-row tems-center justify-end gap-y-0 gap-x-7 mt-0 pl-7">
              <a className="flex flex-row items-center space-x-1 font-medium text-white underline cursor-pointer sm:py-6" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <span>Github</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto pt-6 px-1 sm:px-0">
        <h2 className="text-2xl font-bold md:text-2xl mb-2">Bitcoin Overviews</h2>
        <div className="flex flex-row justify-start items-center w-full  min-h-[175px] mb-8">
          <div className="grid gap-6 grid-cols-1 sm:gap-20 lg:grid-cols-3 lg:gap-20">
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800">Price</h4>
              <p className="mt-2 sm:mt-3 text-4xl sm:text-6xl font-bold text-purple-500 underline underline-offset-4">{btcPrice}</p>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800">Circulating Supply (Total)</h4>
              <p className="mt-2 sm:mt-3 text-4xl sm:text-6xl font-bold text-purple-500 underline underline-offset-4">{circulatingSupply}</p>

            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800">Circulating Supply (Polygon)</h4>
              <p className="mt-2 sm:mt-3 text-4xl sm:text-6xl font-bold text-purple-500 underline underline-offset-4">{circulatingSupplyPolygon}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold md:text-2xl mb-8">Bitcoin Pegged Tokens</h2>
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Token Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Volume (Total)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Market Cap (Total)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
                        <div className="flex flex-row items-center justify-center space-x-1">
                          <span>Holders (polygon | ethereum) </span><QuestionMarkCircleIcon className="h-5 w-5" data-tooltip-id="my-tooltip" data-tooltip-content="Calculated every 24 hours." />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <div className="flex flex-row items-center justify-center space-x-1">
                          <span>Circulating Supply (polygon | total) </span>
                          <QuestionMarkCircleIcon
                            className="h-5 w-5"
                            data-tooltip-id="my-tooltip"
                            data-tooltip-html={`Calculated every 24 hours.<br />The circulating supply of Polygon is referenced from the values of on-chain data,<br />while the total circulating supply is referenced from the values of the Coingecko API.`}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase ">Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {
                      coins.map((coin) => {
                        const coingeckoPrice = coin.coingecko_price
                        if (!coingeckoPrice) {
                          return null
                        }

                        const iconUrl = coingeckoPrice.image.small
                        const tokenName = coingeckoPrice.name
                        const volume = coingeckoPrice.market_data.total_volume.usd ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(coingeckoPrice.market_data.total_volume.usd) : '-'
                        const marketCap = coingeckoPrice.market_data.market_cap.usd ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(coingeckoPrice.market_data.market_cap.usd) : '-'

                        const rawPolygonTokenHolders = coin.dune_holders_polygon_result?.rows[0]?.token_holders
                        const isShowPolygonTokenHolders = rawPolygonTokenHolders >= 0
                        const polygonHolders = isShowPolygonTokenHolders ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                        }).format(rawPolygonTokenHolders) : '-'

                        const rawEthereumTokenHolders = coin.dune_holders_ethereum_result?.rows[0]?.token_holders
                        const isShowEthereumTokenHolders = rawEthereumTokenHolders >= 0
                        const ethereumHolders = isShowEthereumTokenHolders ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                        }).format(rawEthereumTokenHolders) : '-'

                        const rawPolygonSupply = coin.polygon_total_supply !== undefined ? BigInt(coin.polygon_total_supply) : null
                        const polygonSupply = rawPolygonSupply ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                        }).format(parseFloat(formatUnits(rawPolygonSupply, coin.token_decimals))) : '-'

                        const rawEthereumSupply = coin.ethereum_total_supply !== undefined ? BigInt(coin.ethereum_total_supply) : null
                        const ethereumSupply = rawEthereumSupply ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                        }).format(parseFloat(formatUnits(rawEthereumSupply, coin.token_decimals))) : '-'

                        const coingeckoUrl = `https://www.coingecko.com/en/coins/${coin.coingecko_id}`
                        const polygonScanURL = coin.polygon_contract_address ? `https://polygonscan.com/token/${coin.polygon_contract_address}` : null

                        return (
                          <tr key={coin.coingecko_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">
                              <div className="flex items-center space-x-1">
                                <img className='w-[25px] h-[25px]' src={iconUrl} alt="token-icon" /> <span>{tokenName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{volume}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{marketCap}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                              {
                                isShowPolygonTokenHolders ? (
                                  <span onClick={() => openModal("erc20_polygon.evt_Transfer", coin.polygon_contract_address)} className='underline cursor-pointer text-[#EB5B43] decoration-[#EB5B43]'>{polygonHolders}</span>
                                ) : (
                                  <span>{polygonHolders}</span>
                                )
                              }
                              &nbsp;|&nbsp;
                              {
                                isShowEthereumTokenHolders ? (
                                  <span onClick={() => openModal("erc20_ethereum.evt_Transfer", coin.ethereum_contract_address)} className='underline cursor-pointer text-[#EB5B43] decoration-[#EB5B43]'>{ethereumHolders}</span>
                                ) : (
                                  <span>{ethereumHolders}</span>
                                )
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{polygonSupply} | {ethereumSupply}</td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className='flex flex-row space-x-3'>
                                <a className='cursor-pointer' href={coingeckoUrl} target="_blank" rel="noopener noreferrer">
                                  <Image src="/coingecko-logo.png" alt="Github" width={27} height={27} />
                                </a>

                                {
                                  polygonScanURL ? (
                                    <a className='cursor-pointer' href={polygonScanURL} target="_blank" rel="noopener noreferrer">
                                      <Image src="/polygonscan-logo.png" alt="Github" width={27} height={27} />
                                    </a>
                                  ) : (
                                    <Image src="/polygonscan-logo.png" alt="Github" width={27} height={27} className='brightness-50' />
                                  )
                                }
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Tooltip id="my-tooltip" />
      </div>

{JSON.stringify(modalState)}
      <Modal
        isOpen={modalState.open}
        onRequestClose={closeModal}
        style={MODAL_STYLES}
        contentLabel="Example Modal"
      >
        {
          modalState.chain && modalState.tokenAddress && <iframe src={`https://dune.com/embeds/2492561/4306452/?TARGET_CHAIN=${modalState.chain}&TARGET_TOKEN_ADDRESS=${modalState.tokenAddress.toLowerCase()}`} className='max-h-[100vh] max-w-[100%] h-[500px] w-[1000px]' name={Date.now().toString()}></iframe>
        }
      </Modal>
    </div>
  );
}
