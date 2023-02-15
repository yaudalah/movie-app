import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import MovieCard from "../../components/movie-card";
import { DISCOVER_API, SEARCH_API } from "../../services/api";
const apiKey = import.meta.env.VITE_API_KEY;

const client = new QueryClient({
  queryDeduplication: true,
  queryCache: new QueryCache({ defaultConfig: { queries: { } } }),
});

const MovieList = () => {
  const [query, setQuery] = useSearchParams();
  const [pageApi, setPageApi] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [search, setSearch] = useState(query.get(`search`) || "");
  const counter = useRef(0);
  const navigate = useNavigate();

  const { status, data, error } = useQuery(
    ["movies", pageApi],
    async () => {
      const response = await axios.get(
        `${search ? SEARCH_API : DISCOVER_API}`,
        {
          params: {
            api_key: apiKey,
            query: search,
            page: pageApi,
          },
        }
      );
      console.log(response.data);
      setTotalPage(Math.min(response.data.total_pages, 500));
      return response.data;
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    // client.clearQueryCache();
    client.setQueryData("movies", {
        status: "loading",
        data: null,
        error: null,
    });
    setQuery({search});
  };

  const imageLoaded = () => {
    counter.current += 1;
    if (counter.current >= data.results.length) {
      counter.current = 0;
    }
  };

  return (
    <>
      <form
        className="form"
        onSubmit={handleSubmit}
        style={{
          alignItems: "center",
        }}
      >
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" style={{ all: "unset" }}>
          <SearchIcon />
        </button>
      </form>
      {status === "loading" && <div>Loading...</div>}
      {status === "error" && <div>Error: {error.message}</div>}
      {status === "success" && (
        <Box mt={2} mb={5} className="container">
          {Array.from(data.results).map((movie) => (
            <MovieCard
              movie={movie}
              key={movie.id}
              loading={false}
              onLoad={imageLoaded}
            />
          ))}
        </Box>
      )}

      {status === "success" && data.results.length <= 0 && (
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

export default () => (
  <QueryClientProvider client={client}>
    <MovieList />
  </QueryClientProvider>
);
