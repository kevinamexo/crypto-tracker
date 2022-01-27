import { useState, useEffect } from "react";
import axios from "axios";
import { Coin, CoinsResponse, Data, Stats } from "./CoinsResponseTypes";
import "./CoinsPage.css";

const Coins: React.FC = () => {
  interface RankParameter {
    marketCap: string;
    "24hVolume": string;
    change: string;
    listedAt: string;
  }

  type RankParameters = Record<keyof RankParameter, string>;

  const parameters: RankParameters = {
    marketCap: "Market Cap",
    "24hVolume": "24hr Volume",
    change: "Change",
    listedAt: "Time listed",
  };

  type activeParameterType = keyof RankParameter;

  const [loadingCoins, setLoadingCoins] = useState<boolean | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [stats, setStats] = useState<Stats | {}>({});
  const [sortBy, setSortBy] = useState<activeParameterType>("listedAt");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const activeParameterName = parameters[sortBy];

  interface FetchCoinsOptions {
    method: "GET";
    url: string;
    params: Record<string, string>;
    headers: Record<string, string>;
  }
  let fetchCoinOptions: FetchCoinsOptions = {
    method: "GET",
    url: "https://coinranking1.p.rapidapi.com/coins",
    params: {
      referenceCurrencyUuid: "yhjMzLPhuIDl",
      timePeriod: "24h",
      tiers: "1",
      orderBy: sortBy,
      orderDirection: order,
      limit: "20",
      offset: "0",
    },
    headers: {
      "x-rapidapi-host": "",
      "x-rapidapi-key": "",
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
        setCoins(response.data.data.coins);
        setStats(response.data.data.stats);
      });
    setLoadingCoins(false);
  }, []);

  return (
    <div className="coinsPage">
      <h2>Coin ranking by {activeParameterName}</h2>
      {loadingCoins === true && <h3>Loading Coins</h3>}
      {loadingCoins === false && <h3>Loaded Coins</h3>}
      <p>{coins.length}</p>
      <p></p>

      <p>This is the coins page</p>
      {coins &&
        coins.length > 0 &&
        coins.map((c) => (
          <p>
            {c.name} - {c.price}
          </p>
        ))}
    </div>
  );
};

export default Coins;
