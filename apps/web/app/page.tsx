"use client";

import { useEffect, useState } from 'react';

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
      <h1>Coingecko IDs</h1>
      <ul>
        {coins.map((coin) => (
          <li key={coin.coingecko_id}>{coin.coingecko_id}</li>
        ))}
      </ul>
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Age</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Address</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase ">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 ">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">John Brown</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">45</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">New York No. 1 Lake Park</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a className="text-blue-500 hover:text-blue-700" href="#">Delete</a>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">Jim Green</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">27</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">London No. 1 Lake Park</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a className="text-blue-500 hover:text-blue-700" href="#">Delete</a>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">Joe Black</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">31</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">Sidney No. 1 Lake Park</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a className="text-blue-500 hover:text-blue-700" href="#">Delete</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
