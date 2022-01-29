export interface CoinsResponse {
  status: string;
  data: Data;
}

export interface Data {
  stats: Stats;
  coins: Coin[];
}

export interface Coin {
  uuid: string;
  symbol: string;
  name: string;
  color: null | string;
  iconUrl: string;
  marketCap: string;
  price: string;
  listedAt: number;
  tier: number;
  change: string;
  rank: number;
  sparkline: string[];
  lowVolume: boolean;
  coinrankingUrl: string;
  "24hVolume": string;
  btcPrice: string;
}

export interface Stats {
  total: number;
  totalCoins: number;
  totalMarkets: number;
  totalExchanges: number;
  totalMarketCap: number;
  total24hVolume: number;
}
