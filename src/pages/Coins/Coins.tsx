import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { Coin, CoinsResponse, Stats } from "./CoinsResponseTypes";
import CoinCard from "../../components/CoinCard/CoinCard";
import "./CoinsPage.css";

import BasicTable from "./CoinsTable";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingAssets,
  setTableData,
  setTimePeriod,
  TableTimePeriod,
  setLoadingSearchResults,
  setStats,
  setSearchResultsArr,
  setMostExpensive,
} from "../../redux/app/features/tables/assetsTableSlice";
import { setSearchModal } from "../../redux/app/features/modalsSlice";
import { RootState } from "../../redux/app/store";
import SearchComponent from "../../components/Search/SearchComponent";

export interface RankParameter {
  marketCap: string;
  sparkline: Number[];
  "24hVolume": string;
  change: string;
  listedAt: string;
  name?: string;
  price?: string;
}

export type RankParameters = Record<keyof Partial<RankParameter>, string>;

export const parameters: RankParameters = {
  marketCap: "Market Cap",
  sparkline: "Price chart",
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
  const {
    timePeriod,
    activeColumn,
    tableOrder,
    resultsPerPage,
    assetsTablePage,
    searchValue,
    stats,
  } = useSelector((state: RootState) => state.assetsTable);
  const { minimizedSearchActive, searchModal } = useSelector(
    (state: RootState) => state.modals
  );
  const { windowWidth, searchTableBreakpoint } = useSelector(
    (state: RootState) => state.layout
  );
  const miniminzeTableAndSearch =
    windowWidth && windowWidth < searchTableBreakpoint ? true : false;

  // const activeParameterName = parameters[sortBy];
  const dispatch = useDispatch();

  let fetchCoinOptions: FetchCoinsOptions = {
    method: "GET",
    url: "https://coinranking1.p.rapidapi.com/coins",
    params: {
      referenceCurrencyUuid: "yhjMzLPhuIDl",
      timePeriod: timePeriod,
      tiers: "1",
      orderBy: activeColumn,
      orderDirection: tableOrder,
      limit: String(resultsPerPage),
      offset: String((assetsTablePage - 1) * resultsPerPage),
    },
    headers: {
      "x-rapidapi-host": process.env.REACT_APP_RAPID_API_HOST as string,
      "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY as string,
    },
  };

  const tableRows: string[] = [
    "name",
    "price",
    "sparkline",
    "marketCap",
    "24hVolume",
    "change",
    "listedAt",
    "iconUrl",
  ];

  const timeLabelValues: Record<string, TableTimePeriod> = {
    "3H": "3h",
    "1D": "24h",
    "1W": "7d",
    "1M": "30d",
    "1Y": "1y",
  };
  const handleTimeLabelChange = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    timeLabel: string
  ) => {
    console.log(timeLabelValues[timeLabel]);
    dispatch(setTimePeriod(timeLabelValues[timeLabel]));
  };

  const fetchMostExpensive = () => {
    axios
      .get<CoinsResponse>(fetchCoinOptions.url, {
        headers: fetchCoinOptions.headers,
        params: {
          referenceCurrencyUuid: "yhjMzLPhuIDl",
          timePeriod: timePeriod,
          tiers: "1",
          orderBy: "price",
          orderDirection: tableOrder,
          limit: 5,
          offset: 0,
        },
      })
      .then((response) => {
        console.log(response);
        // setCoins(response.data.data.coins);
        // dispatch(setSt(response.data.data.stats));
        const mostExpensive = response.data.data.coins.map((r) => {
          return {
            iconUrl: r.iconUrl,
            name: r.name,
            price: r.price,
            symbol: r.symbol,
          };
        });
        console.log(mostExpensive);
        dispatch(setSearchResultsArr(mostExpensive));

        // console.log(x);
        // console.log(x)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTableAssets = () => {
    axios
      .get<CoinsResponse>(fetchCoinOptions.url, {
        headers: fetchCoinOptions.headers,
        params: fetchCoinOptions.params,
      })
      .then((response) => {
        console.log(response);
        setCoins(response.data.data.coins);
        dispatch(setStats(response.data.data.stats));
        const tableData = response.data.data.coins.map((r) => {
          let tmpObj: Record<string, any> = {};
          tableRows.map((rowName) => {
            tmpObj[`${rowName}`] = r[rowName as keyof Coin];
          });
          return tmpObj;
        });
        console.log(tableData);
        dispatch(setTableData(tableData));
        fetchMostExpensive();
      })
      .catch((err) => {
        console.log(err);
      });
    setLoadingCoins(false);
    dispatch(setLoadingAssets(false));
  };
  useEffect(() => {
    if (!timePeriod) return;
    dispatch(setLoadingAssets(true));
    fetchTableAssets();
  }, [timePeriod, activeColumn, tableOrder, assetsTablePage]);

  useEffect(() => {
    if (!stats) return;
  }, [stats]);

  useEffect(() => {
    console.log(searchValue.length);
    const numberOfSearchChars =
      searchValue.length - searchValue.split(" ").length + 1;

    if (numberOfSearchChars === 0) {
      dispatch(setLoadingSearchResults(false));
      dispatch(setSearchModal(false));

      fetchTableAssets();
    }
  }, [searchValue]);

  ///MINIMIZED MENU

  return (
    <div className="coinsPage">
      <section
        className={`coinMarketSummary${
          minimizedSearchActive === true && searchModal == false
            ? "-mini"
            : minimizedSearchActive === true && searchModal === true
            ? "-mini-full"
            : ""
        }`}
      >
        <div className={`header`}>
          {!(
            miniminzeTableAndSearch === true && minimizedSearchActive === true
          ) && (
            <p
              className={`coinPage-marketSummary__title${
                miniminzeTableAndSearch ? "-min" : ""
              }`}
            >
              Global Statistics
            </p>
          )}
          <SearchComponent />
        </div>
        {/* <div className="globalMarketSummary">
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
        </div> */}

        <p className="coinPage-marketSummary__title">
          Market summary - 24 hours
        </p>
        <ul className="coinMarketSummary-coins">
          {Object.keys(parameters)
            .filter((p) => p !== "name" && p !== "sparkline")
            .map((parameter, key) => {
              return (
                <CoinCard
                  key={key}
                  category={parameter as keyof RankParameters}
                  title={parameters[parameter as keyof RankParameters]}
                />
              );
            })}
        </ul>
      </section>
      {/* <CoinCard category="24hVolume" /> */}
      {minimizedSearchActive === false && (
        <>
          <div className="assets-table-header">
            <div className="quickFilters">
              <p className="tableTitle"> All assets</p>
              <p className="tableTitle">Gainers</p>
              <p className="tableTitle"> Losers</p>
            </div>
            {miniminzeTableAndSearch === false && (
              <ul className="tablefilterTimePeriods">
                {["3H", "1D", "1W", "1M", "1Y"].map((x) => (
                  <li
                    className={`timeLabel${
                      timePeriod === timeLabelValues[x] ? "-active" : ""
                    }`}
                    onClick={(e) => handleTimeLabelChange(e, x)}
                  >
                    {x}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="assets-table">
            <BasicTable />
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Coins);
