import { useState, useEffect } from "react";
import axios from "axios";
import { Coin, CoinsResponse, Stats } from "./CoinsResponseTypes";
import CoinCard from "../../components/CoinCard/CoinCard";
import "./CoinsPage.css";
import { BiSearch } from "react-icons/bi";
import BasicTable from "./CoinsTable";
import { useDispatch } from "react-redux";
import {
  setLoadingAssets,
  setTableData,
} from "../../redux/app/features/tables/assetsTableSlice";

export interface RankParameter {
  marketCap: string;
  "24hVolume": string;
  change: string;
  listedAt: string;
  name?: string;
  price?: string;
}

export type RankParameters = Record<keyof Partial<RankParameter>, string>;

export const parameters: RankParameters = {
  marketCap: "Market Cap",
  "24hVolume": "24hr Volume",
  change: "Change",
  listedAt: "Time listed",
  name: "Name",
  price: "Price",
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
  const [searchValue, setSearchValue] = useState<string>("");
  const [stats, setStats] = useState<Stats>({} as Stats);
  const [sortBy, setSortBy] = useState<activeParameterType>("listedAt");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  // const activeParameterName = parameters[sortBy];
  const dispatch = useDispatch();

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

  const tableRows: string[] = [
    "name",
    "marketCap",
    "24hVolume",
    "change",
    "listedAt",
  ];
  useEffect(() => {
    setLoadingCoins(true);
    dispatch(setLoadingAssets(true));
    axios
      .get<CoinsResponse>(fetchCoinOptions.url, {
        headers: fetchCoinOptions.headers,
        params: fetchCoinOptions.params,
      })
      .then((response) => {
        console.log(response);
        setCoins(response.data.data.coins);
        setStats(response.data.data.stats);
        const tableData = response.data.data.coins.map((r) => {
          let tmpObj: Record<string, any> = {};
          tableRows.map((rowName) => {
            tmpObj[`${rowName}`] = r[rowName as keyof Coin];
          });
          return tmpObj;
        });
        console.log(tableData);
        dispatch(setTableData(tableData));
        // console.log(x);
        // console.log(x)
      })
      .catch((err) => {
        console.log(err);
      });
    setLoadingCoins(false);
    dispatch(setLoadingAssets(false));
  }, []);

  useEffect(() => {
    if (!stats) return;
  }, [stats]);

  return (
    <div className="coinsPage">
      <section className="coinMarketSummary">
        <div className="header">
          <p className="coinPage-marketSummary__title">Global Statistics</p>
          <div className="search-input">
            <input
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="coinPageSearch"
              placeholder="Search"
            />
            <BiSearch className="coinPageSearchIcon" />
          </div>
        </div>
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
          {Object.keys(parameters).map((parameter, key) => {
            if (parameter !== "name") {
              return (
                <CoinCard
                  key={key}
                  category={parameter as keyof RankParameters}
                  title={parameters[parameter as keyof RankParameters]}
                />
              );
            }
          })}
        </ul>
      </section>
      {/* <CoinCard category="24hVolume" /> */}
      <h2 style={{ marginTop: "50px" }}>Assets</h2>

      {/* <p>This is the coins page</p>
      {coins &&
        coins.length > 0 &&
        coins.map((c) => (
          <p>
            {c.name} - {c.price}
          </p>
        ))} */}
      <BasicTable />
    </div>
  );
};

export default Coins;
