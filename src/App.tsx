import React from "react";
import Navbar from "./components/layout/Navbar/Navbar";
import "./App.css";
import { Routes, Route, useParams } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
      <p>This is the home page</p>
    </div>
  );
};

const Coins: React.FC = () => {
  return (
    <div>
      <p>This is the coins page</p>
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
const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/coins/:coinId" element={<Coin />} />
      </Routes>
    </div>
  );
};

export default App;
