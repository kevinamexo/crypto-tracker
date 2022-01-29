import React, { useState, useEffect } from "react";
import "./CoinCard.css";
import { Coin, CoinsResponse } from "../../pages/Coins/CoinsResponseTypes";
import {
  activeParameterType,
  FetchCoinsOptions,
} from "../../pages/Coins/Coins";
import axios from "axios";

interface CoinCardProps {
  category: activeParameterType;
  title: string;
}
const CoinCard: React.FC<CoinCardProps> = ({ category, title }) => {
  const [coinData, setCoinData] = useState<Coin>({} as Coin);
  const [loadingCoins, setLoadingCoins] = useState<boolean | null>(null);
  const [order, setOrder] = useState<string>("desc");
  const [categoryStat, setCategoryStat] = useState<number | null>(null);
  //   const title
  let fetchCoinOptions: FetchCoinsOptions = {
    method: "GET",
    url: "https://coinranking1.p.rapidapi.com/coins",
    params: {
      referenceCurrencyUuid: "yhjMzLPhuIDl",
      timePeriod: "24h",
      tiers: "1",
      orderBy: category,
      orderDirection: order,
      limit: "1",
      offset: "0",
    },
    headers: {
      "x-rapidapi-host": `${process.env.REACT_APP_RAPID_API_HOST}`,
      "x-rapidapi-key": `${process.env.REACT_APP_RAPID_API_KEY}`,
    },
  };
  useEffect(() => {
    setLoadingCoins(true);
    axios
      .get<CoinsResponse>(fetchCoinOptions.url, {
        headers: fetchCoinOptions.headers,
        params: fetchCoinOptions.params,
      })
      .then((response) => {
        console.log(response);
        setCoinData(response.data.data.coins[0]);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoadingCoins(false);
  }, [category]);

  return (
    <div className="coinCard">
      <p className="coinCard-title">{title}</p>
      <img
        className="coinCard-logo"
        src={coinData.iconUrl}
        alt={coinData.name}
      />
      <p className="coinCard-symbol">{coinData.symbol}</p>
      <div className="coinCard-categoryDetail">
        {category === "listedAt" && coinData && coinData.listedAt && (
          <>
            <p className="value ">Volume </p>
            <p>{new Date(coinData.listedAt * 1000).toDateString()}</p>
          </>
        )}
        {category === "24hVolume" && coinData && coinData["24hVolume"] && (
          <>
            {
              <p className="value">
                {Math.round(Number(coinData["24hVolume"]) / 1000000000)}T{" "}
              </p>
            }{" "}
            <p>Added </p>
          </>
        )}

        {category === "marketCap" && coinData && coinData["marketCap"] && (
          <>
            {
              <p className="value">
                {Number(coinData["marketCap"]) / 1000000000}T{" "}
              </p>
            }{" "}
            <p>cap </p>
          </>
        )}

        {category === "change" && coinData && coinData["change"] && (
          <>
            {<p className="value">{Number(coinData["change"]) / 100}% </p>}{" "}
            <p>change </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CoinCard;
