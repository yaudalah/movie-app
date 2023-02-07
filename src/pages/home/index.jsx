import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Link,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../../components/movie-card";
import { DISCOVER_API, SEARCH_API } from "../../services/api";
import "./index.css";
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [query] = useSearchParams();
  const inputEl = useRef(null);
  const [movies, setMovies] = useState([]);
  const [search, setsearch] = useState(query.get(`q`) || "");
  const [pageApi, setPageApi] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [pageApi]);

  const fetchMovies = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${search ? SEARCH_API : DISCOVER_API}`,
        {
          params: {
            api_key: apiKey,
            query: search,
            page: pageApi,
          },
        }
      );
      console.log(data);
      setTotalPage(data.total_pages > 500 ? 500 : data.total_pages);
      setMovies(data.results);
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <header className="center-max-size header">
        <Link href="/" color="inherit" underline="none" rel="noreferrer">
          <h2 className={"brand"}>Movie App</h2>
        </Link>
        <form className="form" onSubmit={fetchMovies}>
          <input
            ref={inputEl}
            className="search"
            name="q"
            type="search"
            id="search"
            placeholder="Search..."
            onInput={(e) => setsearch(e.target.value)}
            value={search}
          />
          <button className="submit-search" type="submit">
            <SearchIcon />
          </button>
        </form>
      </header>

      <Typography gutterBottom variant="subtitle1" component="div" align="right">
        Page: {pageApi}
      </Typography>
      <Box mt={2} mb={5} className="container">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} loading={loading} />
        ))}
      </Box>

      {movies.length <= 0 ? (
        <>
          <Typography variant="h4" mb={5}></Typography>
          <Button variant="contained" startIcon={<ArrowBackIcon />} href="/">
            Back to Home
          </Button>
        </>
      ) : (
        <Stack spacing={2} alignItems="center">
          <Pagination
            color="info"
            shape="rounded"
            size="large"
            count={totalPage}
            onChange={(e, value) => {
              if (e) e.preventDefault();
              window.scrollTo(0, 0);
              setPageApi(value);
            }}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Stack>
      )}
    </>
  );
};

export default Home;
