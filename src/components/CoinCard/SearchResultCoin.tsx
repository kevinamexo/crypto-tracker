import React from "react";
import "./SearchResultCoins.css";
import { Coin } from "../../pages/Coins/CoinsResponseTypes";

type SearchResultCoin = Partial<Coin>;

const SearchResultCoins: React.FC<SearchResultCoin> = () => {
  return <div className="search-result-coin"></div>;
};

export default React.memo(SearchResultCoins);
