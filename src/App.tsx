import React, { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar/Navbar";
import "./App.css";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Coins from "./pages/Coins/Coins";
import useWindowSize from "./customHooks/useWindowSize";

const Home: React.FC = () => {
  return (
    <div className="homePage">
      <div className="globalStats"></div>
    </div>
  );
};

const Coin: React.FC = () => {
  const { coinId } = useParams();
  return (
    <div>
      <p>This is the coin{coinId} information page</p>
    </div>
  );
};
const CoinHistory: React.FC = () => {
  return (
    <div>
      <p>This is the CoinHistory page</p>
    </div>
  );
};
const App: React.FC = () => {
  const windowSize = useWindowSize();
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="coins">
          <Route index element={<Coins />} />
          <Route path="history" element={<CoinHistory />} />
          <Route path=":coinId" element={<Coin />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
