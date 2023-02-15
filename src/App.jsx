import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home";
import MovieList from "./pages/home-query";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Home />} />
      <Route exact path={"/query"} element={<MovieList />} />
      <Route path={"/*"} element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
