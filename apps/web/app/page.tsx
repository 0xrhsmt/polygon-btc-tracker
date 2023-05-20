"use client";

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import Image from 'next/image';
import { useEffect, useState } from 'react';

const GITHUB_URL = 'https://github.com/0xrhsmt/polygon-btc-tracker'

export default function Page() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/coins');
        const data = await response.json();
        console.log(data.data[0].coingecko_price.market_data.circulating_supply)
        setCoins(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <header className="flex justify-start z-50 w-full bg-purple-600 border-b border-white/[.5] text-sm py-3 sm:py-0">
        <nav className="relative max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between px-6 lg:px-8" aria-label="Global">
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
        <h2 className="text-2xl font-bold md:text-2xl mb-2">Bitcoin Pegged Tokens</h2>
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Token Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Volume</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Market Cap</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase ">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {
                      coins.map((coin) => {
                        const coingeckoPrice = coin.coingecko_price
                        const tokenName = coingeckoPrice.name
                        const volume = new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(coingeckoPrice.market_data.total_volume.usd);
                        const marketCap = new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(coingeckoPrice.market_data.market_cap.usd);

                        return (
                          <tr key={coin.coingecko_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{tokenName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{volume}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{marketCap}</td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a className="text-purple-500 hover:text-purple-700" href="#">TODO</a>
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
      </div>
    </div>
  );
}
