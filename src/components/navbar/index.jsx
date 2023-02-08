import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import "./index.css";


const Navbar = ({ text, onSearch, fetchMovies }) => {
  const [search, setSearch] = useState(text || "");

  useEffect(() => {
    if (onSearch) {
      onSearch(search);
    }
  }, [search]);

  return (
    <AppBar>
      <Toolbar className="header">
        <Link href="/" color="inherit" underline="none" rel="noreferrer">
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Movie App
          </Typography>
        </Link>
        <form className="form" onSubmit={fetchMovies}>
            
          <input
            className="search"
            name="q"
            type="search"
            id="search"
            placeholder="Search..."
            onInput={(e) => setSearch(e.target.value)}
            value={search}
          />
          
          <button className="submit-search" type="submit">
            <SearchIcon />
          </button>
        </form>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
