import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { css } from "@emotion/react";
import { Coin, CoinsResponse, Stats } from "./CoinsResponseTypes";
import CoinCard from "../../components/CoinCard/CoinCard";
import "./CoinsPage.css";
import { BiSearch } from "react-icons/bi";
import BasicTable from "./CoinsTable";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingAssets,
  setTableData,
  setTimePeriod,
  TableTimePeriod,
  setLoadingSearchResults,
} from "../../redux/app/features/tables/assetsTableSlice";
import { setSearchResultsArr } from "../../redux/app/features/tables/assetsTableSlice";
import { setSearchModal } from "../../redux/app/features/modalsSlice";
import { RootState } from "../../redux/app/store";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineClose } from "react-icons/ai";
import useWindowSize from "../../customHooks/useWindowSize";

import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
const SEARCH_TABLE_BREAKPOINT: number = 768;
const Coins: React.FC = () => {
  const [loadingCoins, setLoadingCoins] = useState<boolean | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [stats, setStats] = useState<Stats>({} as Stats);
  const [searchValue, setSearchValue] = useState<string>("");
  const {
    timePeriod,
    activeColumn,
    tableOrder,
    resultsPerPage,
    assetsTablePage,
    loadingSearchResults,
    searchResults,
  } = useSelector((state: RootState) => state.assetsTable);
  const { searchModal } = useSelector((state: RootState) => state.modals);
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

  let searchCoinsOptions: FetchCoinsOptions = {
    method: "GET",
    url: "https://coinranking1.p.rapidapi.com/search-suggestions",
    params: { referenceCurrencyUuid: "yhjMzLPhuIDl", query: searchValue },
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": "16b19d757bmsh1c2316bb5ece6b7p1286c6jsn227702a96e01",
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

  const handleAssetsSearch = useCallback(
    debounce((searchValue) => {
      if (!searchValue) return;
      console.log("SEARCHING COINS for " + searchValue);
      axios
        .get<CoinsResponse>(searchCoinsOptions.url, {
          headers: searchCoinsOptions.headers,
          params: { referenceCurrencyUuid: "yhjMzLPhuIDl", query: searchValue },
        })
        .then((res) => {
          console.log(res.data.data.coins);
          dispatch(setSearchResultsArr(res.data.data.coins));
          console.log("SEARCH MADE");
          dispatch(setLoadingSearchResults(false));
        });
    }, 500),
    []
  );
  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchModal(true));
    setSearchValue(e.target.value);
    dispatch(setLoadingSearchResults(true));
    handleAssetsSearch(e.target.value);
  };

  const closeSearch = useCallback(() => {
    dispatch(setSearchModal(false));
    setSearchValue("");
  }, [searchModal, searchValue]);

  const fetchTableAssets = () => {
    console.log("fetching with parameters:");
    console.log(assetsTablePage, activeColumn, timePeriod, tableOrder);
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
  };
  useEffect(() => {
    if (!timePeriod) return;
    fetchTableAssets();
  }, [timePeriod, activeColumn, tableOrder]);

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

  useEffect(() => {
    if (!stats) return;
  }, [stats]);

  const overrideClipLoader = css`
    margin-right: 5px;
  `;

  ///MINIMIZED MENU
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("1D");
  const [minimizedSearchActive, setMinimizedSearchActive] =
    useState<boolean>(false);

  const handleMiniTimePeriodChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedTimePeriod(event.target.value as string);
    dispatch(setTimePeriod(event.target.value as TableTimePeriod));
  };

  const handleSearchButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      if (miniminzeTableAndSearch === true && minimizedSearchActive === false) {
        setMinimizedSearchActive(true);
      }
    },
    [miniminzeTableAndSearch, minimizedSearchActive]
  );
  return (
    <div className="coinsPage">
      <section className="coinMarketSummary">
        <div className="header">
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
          <div
            className={`search-input${
              miniminzeTableAndSearch && !minimizedSearchActive
                ? "-min"
                : miniminzeTableAndSearch && minimizedSearchActive === true
                ? "-min-full"
                : ""
            }`}
          >
            {miniminzeTableAndSearch === false ? (
              <input
                name="searchValue"
                value={searchValue}
                onChange={handleSearchValueChange}
                className={`coinPageSearch${
                  minimizedSearchActive === true ? "-mini" : ""
                }`}
                placeholder="Search"
              />
            ) : miniminzeTableAndSearch === true &&
              minimizedSearchActive === true ? (
              <input
                name="searchValue"
                value={searchValue}
                onChange={handleSearchValueChange}
                className="coinPageSearch-mini-full"
              />
            ) : null}
            {miniminzeTableAndSearch === true &&
              minimizedSearchActive === false && (
                <div className="minimizedTimePeriods">
                  <Box sx={{ width: 120 }}>
                    <FormControl>
                      {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={timePeriod}
                        label="timePeriod"
                        className="select"
                        onChange={handleMiniTimePeriodChange}
                      >
                        {["3H", "1D", "1W", "1M", "1Y"].map((p) => (
                          <MenuItem value={timeLabelValues[p]}>{p}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              )}

            <BiSearch
              className={`coinPageSearchIcon${
                miniminzeTableAndSearch ? "-min" : ""
              }`}
              onClick={handleSearchButtonClick}
            />
            {miniminzeTableAndSearch === true &&
              minimizedSearchActive === true && (
                <button
                  className="cancelMiniSearch"
                  onClick={() => setMinimizedSearchActive(false)}
                >
                  Cancel
                </button>
              )}
            {searchModal === true && (
              <div className="loadingSearchResults">
                {loadingSearchResults === true && searchModal === true && (
                  <ClipLoader
                    color={"#0052ff"}
                    size={20}
                    css={overrideClipLoader}
                  />
                )}
                <AiOutlineClose className="closeSearch" onClick={closeSearch} />
              </div>
            )}
            {searchModal === true && (
              <ul className="searchResultsModal">
                {searchResults &&
                  searchResults.map((s) => (
                    <li className="searchResultModal-result">
                      <section className="section1">
                        <img src={s.iconUrl} />
                        <span>
                          <p className="searchResultModal-result-name">
                            {s.name}
                          </p>
                          <p>{s.symbol}</p>
                        </span>
                      </section>
                      <section className="section2">{s.price}</section>
                    </li>
                  ))}
              </ul>
            )}
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
      <div className="assets-table-header">
        <p className="tableTitle"> All assets</p>
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
    </div>
  );
};

export default Coins;
