import { useContext, useEffect, useState } from "react";
import { HiCurrencyDollar } from 'react-icons/hi';
import { IoMdTrendingDown, IoMdTrendingUp } from 'react-icons/io';
import { numberWithCommas } from "../helper";
import { getCoinSupply } from '../pugdag-api-client';
import PriceContext from "./PriceContext";

const MarketDataBox = () => {
    const [circCoinsMData, setCircCoinsMData] = useState("-");
    const { price, marketData } = useContext(PriceContext);

    const initBox = async () => {
        try {
            const coinSupplyResponse = await getCoinSupply();
            const circulatingSupply = parseFloat(coinSupplyResponse.circulatingSupply);
            const mcapHundredThousands = circulatingSupply / 100000000; // Market cap in hundreds of thousands
            
            setCircCoinsMData(mcapHundredThousands);
        } catch (error) {
            console.error("Error fetching coin supply:", error);
            // Handle error if needed
        }
    }

    useEffect(() => {
        initBox();
    }, [])

    return (
        <div className="cardBox mx-0">
            <table>
                <tbody>
                    <tr>
                        <td colSpan='2' className="text-center" style={{ "fontSize": "3.8rem" }}>
                            <HiCurrencyDollar style={{ transform: "translateY(-10px)" }} />
                            <div id="light1" className="cardLight" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" className="text-center">
                            <h3>Market data</h3>
                        </td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement">Price</td>
                        <td>$ {price} / PUG</td>
                    </tr>
                    <tr>
                        <td className="cardBoxElement">MCAP</td>
                        <td className="pt-1">$ {(circCoinsMData * price / 1000).toFixed(2)} K <a href="https://xeggex.com/market/PUG_USDT" target="_blank" className="rank ms-1">Buy #</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default MarketDataBox;
