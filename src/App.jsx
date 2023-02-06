import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Home />} />
      <Route path={"/*"} element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
