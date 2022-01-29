import { useState, useEffect } from "react";
import axios from "axios";
import { Coin, CoinsResponse, Data, Stats } from "./CoinsResponseTypes";
import CoinCard from "../../components/CoinCard/CoinCard";
import "./CoinsPage.css";

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
export interface FetchCoinsOptions {
  method: "GET";
  url: string;
  params: Record<string, string>;
  headers: Record<string, string>;
}

export type activeParameterType = keyof RankParameter;
const Coins: React.FC = () => {
  const [loadingCoins, setLoadingCoins] = useState<boolean | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [stats, setStats] = useState<Stats | {}>({});
  const [sortBy, setSortBy] = useState<activeParameterType>("listedAt");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const activeParameterName = parameters[sortBy];

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
      "x-rapidapi-host": process.env.REACT_APP_RAPID_API_HOST as string,
      "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY as string,
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
      })
      .catch((err) => {
        console.log(err);
      });
    setLoadingCoins(false);
  }, []);

  return (
    <div className="coinsPage">
      <section className="coinMarketSummary">
        <p className="coinPage-marketSummary__title">
          Market summary - 24 hours
        </p>
        <ul className="coinMarketSummary-coins">
          {Object.keys(parameters).map((parameter) => (
            <CoinCard
              category={parameter as keyof RankParameters}
              title={parameters[parameter as keyof RankParameters]}
            />
          ))}
        </ul>
      </section>
      {/* <CoinCard category="24hVolume" /> */}
      <h2>Coin ranking by {activeParameterName}</h2>
      <p> {process.env.REACT_APP_RAPID_API_HOST}</p>

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
