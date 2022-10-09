import React from "react";
import Auth from "./components/Auth/Auth";
import { DataProvider } from "./context/DataProvider.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./protected/Protected";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Protected Component={Home} />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
