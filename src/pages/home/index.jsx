import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../../components/movie-card";
import Navbar from "../../components/navbar";
import { DISCOVER_API, SEARCH_API } from "../../services/api";
import "./index.css";
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [query] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState(query.get(`q`) || "");
  const [pageApi, setPageApi] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const counter = useRef(0);

  useEffect(() => {
    fetchMovies();
  }, [pageApi]);

  const fetchMovies = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
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

      setTotalPage(Math.min(data.total_pages, 500));
      setMovies(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const imageLoaded = () => {
    counter.current += 1;
    if (counter.current >= movies.length) {
      setLoading(false);
      counter.current = 0;
    }
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPageApi(1); // reset the page to 1 on every search
  };

  return (
    <>
      <Navbar onSearch={handleSearch} text={search} fetchMovies={fetchMovies} />

      <Box mt={2} mb={5} className="container">
        {movies.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id}
            loading={loading}
            onLoad={imageLoaded}
          />
        ))}
      </Box>

      {movies.length <= 0 && (
        <>
          <Typography variant="h4" mb={5} gutterBottom>
            Movie Not Available
          </Typography>
          <Button variant="contained" startIcon={<ArrowBackIcon />} href="/">
            Back to Home
          </Button>
        </>
      )}

      <Stack spacing={2} alignItems="center">
        <Typography
          gutterBottom
          variant="subtitle1"
          component="div"
          align="right"
        >
          Page: {pageApi} / {totalPage}
        </Typography>

        <Pagination
          color="info"
          shape="rounded"
          size="large"
          page={pageApi}
          siblingCount={2}
          count={totalPage}
          onChange={(e, value) => {
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
    </>
  );
};

export default Home;
