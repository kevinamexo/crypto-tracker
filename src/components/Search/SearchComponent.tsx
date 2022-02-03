import React, { useCallback, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setTimePeriod,
  TableTimePeriod,
  setLoadingSearchResults,
  setSearchResultsArr,
  setSearchValue,
} from "../../redux/app/features/tables/assetsTableSlice";
import {
  setSearchModal,
  setMinimizedSearchActive,
} from "../../redux/app/features/modalsSlice";
import { RootState } from "../../redux/app/store";
import { FetchCoinsOptions } from "../../pages/Coins/Coins";
import { CoinsResponse } from "../../pages/Coins/CoinsResponseTypes";
import "./SearchComponent.css";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineClose } from "react-icons/ai";
import useWindowSize from "../../customHooks/useWindowSize";
import { css } from "@emotion/react";
import { BiSearch } from "react-icons/bi";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const SearchComponent = () => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("1D");
  const dispatch = useDispatch();

  useState<boolean>(false);
  const { windowWidth, searchTableBreakpoint } = useSelector(
    (state: RootState) => state.layout
  );
  const { searchModal, minimizedSearchActive } = useSelector(
    (state: RootState) => state.modals
  );
  const { searchValue, timePeriod, loadingSearchResults, searchResults } =
    useSelector((state: RootState) => state.assetsTable);
  const miniminzeTableAndSearch =
    windowWidth && windowWidth < searchTableBreakpoint ? true : false;

  const handleMiniTimePeriodChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedTimePeriod(event.target.value as string);
    dispatch(setTimePeriod(event.target.value as TableTimePeriod));
  };

  const timeLabelValues: Record<string, TableTimePeriod> = {
    "3H": "3h",
    "1D": "24h",
    "1W": "7d",
    "1M": "30d",
    "1Y": "1y",
  };

  const handleSearchButtonClick = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      if (miniminzeTableAndSearch === true && minimizedSearchActive === false) {
        dispatch(setMinimizedSearchActive(true));
      }
    },
    [miniminzeTableAndSearch, minimizedSearchActive]
  );
  let searchCoinsOptions: FetchCoinsOptions = {
    method: "GET",
    url: "https://coinranking1.p.rapidapi.com/search-suggestions",
    params: { referenceCurrencyUuid: "yhjMzLPhuIDl", query: searchValue },
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": "16b19d757bmsh1c2316bb5ece6b7p1286c6jsn227702a96e01",
    },
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
    dispatch(setSearchValue(e.target.value));
    if (e.target.value !== "") {
      dispatch(setLoadingSearchResults(true));
    }
    handleAssetsSearch(e.target.value);
  };

  const closeSearch = useCallback(() => {
    console.log("HANDLING CLOSING MINI SEARCH");
    dispatch(setSearchModal(false));
    dispatch(setMinimizedSearchActive(false));
    setSearchValue("");
    dispatch(setSearchResultsArr([]));
  }, [searchModal, searchValue]);
  const overrideClipLoader = css`
    margin-right: 5px;
  `;

  useEffect(() => {
    if (windowWidth && windowWidth < searchTableBreakpoint) return;
    console.log("WIDTH IS MORE");
    dispatch(setMinimizedSearchActive(false));
    dispatch(setSearchModal(false));
  }, [windowWidth]);

  useEffect(() => {
    if (!minimizedSearchActive) return;
    if (minimizedSearchActive === true) {
      dispatch(setSearchModal(true));
    }
  }, [minimizedSearchActive]);

  return (
    <div
      className={`search-input${
        miniminzeTableAndSearch === true && minimizedSearchActive === false
          ? "-min"
          : miniminzeTableAndSearch === true && minimizedSearchActive === true
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
      ) : miniminzeTableAndSearch === true && minimizedSearchActive === true ? (
        <input
          name="searchValue"
          value={searchValue}
          onChange={handleSearchValueChange}
          className="coinPageSearch-mini-full"
        />
      ) : null}
      {miniminzeTableAndSearch === true && minimizedSearchActive === false && (
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
                {["3H", "1D", "1W", "1M", "1Y"].map((p, key) => (
                  <MenuItem key={key} value={timeLabelValues[p]}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      )}
      <BiSearch
        className={`coinPageSearchIcon${miniminzeTableAndSearch ? "-min" : ""}`}
        onClick={handleSearchButtonClick}
      />
      {miniminzeTableAndSearch === true && minimizedSearchActive === true && (
        <button className="cancelMiniSearch" onClick={closeSearch}>
          Cancel
        </button>
      )}
      {searchModal === true && (
        <div className="loadingSearchResults">
          {!minimizedSearchActive &&
            loadingSearchResults === true &&
            searchModal === true && (
              <ClipLoader
                color={"#0052ff"}
                size={20}
                css={overrideClipLoader}
              />
            )}
          {!(
            miniminzeTableAndSearch === true && minimizedSearchActive === true
          ) && <AiOutlineClose className="closeSearch" onClick={closeSearch} />}
        </div>
      )}
      {searchModal === true && (
        <ul className="searchResultsModal">
          {searchResults &&
            searchResults.map((s: any, key: number) => (
              <li key={key} className="searchResultModal-result">
                <section className="section1">
                  <img src={s.iconUrl} />
                  <span>
                    <p className="searchResultModal-result-name">{s.name}</p>
                    <p className="searchResultModal-result-symbol">
                      {s.symbol}
                    </p>
                  </span>
                </section>
                <section className="section2">
                  ${Number(s.price).toFixed(4)}
                </section>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
