import { AppBar, Box, Link, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import "./index.css";

const Navbar = ({ text, onSearch, fetchMovies }) => {
  const [search, setSearch] = useState(text || "");

  const handleSearch = event => {
    if (event.key === "Enter") {
      onSearch(search);
    }
  }

  return (
    <Box mb={10} sx={{ flexGrow: 1 }}>
      <AppBar enableColorOnDark>
        <Toolbar className="header" variant="dense">
          <Link href="/" color="inherit" underline="none" rel="noreferrer">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "block" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
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
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              value={search}
            />

            <button className="submit-search" type="submit">
              <SearchIcon />
            </button>
          </form>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
