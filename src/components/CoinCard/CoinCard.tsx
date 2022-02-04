import React, { useState, useEffect } from "react";
import "./CoinCard.css";
import { Coin, CoinsResponse } from "../../pages/Coins/CoinsResponseTypes";
import "react-loading-skeleton/dist/skeleton.css";

import Skeleton from "react-loading-skeleton";
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
  const [loadingCoin, setLoadingCoin] = useState<boolean | null>(null);
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
    setLoadingCoin(true);
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
    setLoadingCoin(false);
  }, [category]);

  return (
    <div className="coinCard">
      {loadingCoin === true ? (
        <Skeleton width={100} />
      ) : (
        <p className="coinCard-title">{title}</p>
      )}
      {loadingCoin === true ? (
        <Skeleton
          height={30}
          width={30}
          borderRadius="50%"
          style={{ margin: "10px 0" }}
        />
      ) : (
        <img
          className="coinCard-logo"
          src={coinData.iconUrl}
          alt={coinData.name}
        />
      )}
      {loadingCoin === true ? (
        <Skeleton width={120} />
      ) : (
        <p className="coinCard-symbol">{coinData.name}</p>
      )}

      {loadingCoin === false ? (
        <div className="coinCard-categoryDetail">
          {category === "listedAt" && coinData && coinData.listedAt ? (
            <>
              <p className="value ">Listed at </p>
              <p>{new Date(coinData.listedAt * 1000).toDateString()}</p>
            </>
          ) : (
            <></>
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
                  {(Number(coinData["marketCap"]) / 1000000000).toFixed(2)}T{" "}
                </p>
              }{" "}
              <p>cap </p>
            </>
          )}

          {category === "change" && coinData && coinData["change"] && (
            <>
              {
                <p className="value">
                  {(Number(coinData["change"]) / 100).toFixed(2)}%{" "}
                </p>
              }{" "}
              <p>change </p>
            </>
          )}
          {category === "price" && coinData && coinData["price"] && (
            <>
              <p className="value">{Number(coinData["price"]).toFixed(2)}</p>
            </>
          )}
        </div>
      ) : (
        <Skeleton width={150} style={{ marginTop: "5px" }} />
      )}
    </div>
  );
};

export default React.memo(CoinCard);
