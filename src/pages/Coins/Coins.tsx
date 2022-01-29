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
  const [stats, setStats] = useState<Stats>({} as Stats);
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
        <p className="coinPage-marketSummary__title">Global Statistics</p>
        <div className="globalMarketSummary">
          <ul className="globalMarketStat">
            <li className="stat">
              <h2>{stats && (stats.totalCoins / 1000).toFixed(2)}k</h2>
              <p>Total coins</p>
            </li>
            <li className="stat">
              <h2>
                {stats && (stats.totalMarketCap / 1000000000).toFixed(2)}T
              </h2>
              <p>Total MarketCap</p>
            </li>
            <li className="stat">
              <h2>{stats && (stats.totalMarkets / 1000).toFixed(1)}k</h2>
              <p>Total Markets</p>
            </li>
            <li className="stat">
              <h2>{stats && stats.totalExchanges}</h2>
              <p>Total Exchanges</p>
            </li>
          </ul>
        </div>

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
      <h2 style={{ marginTop: "50px" }}>Assets</h2>
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
