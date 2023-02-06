import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Link,
  Pagination,
  PaginationItem,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DISCOVER_API,
  IMAGE_PATH,
  SEARCH_API
} from "../../services/api";
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
      setTotalPage(data.total_pages);
      setMovies(data.results);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <header className="center-max-size header">
        <Link href="/" color="inherit" underline="none" rel="noreferrer">
          <span className={"brand"}>Movie App</span>
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

      <Typography gutterBottom variant="button" component="div" align="right">
        Page: {pageApi}
      </Typography>

      <Box mt={2} mb={5} className="container">
        {movies.map((movie) => (
          <Card
            sx={{
              maxWidth: 345,
              borderTopRightRadius: "25px",
              borderTopLeftRadius: "25px",
            }}
            className="grid-item"
            key={movie.id}
          >
            {loading && (
              <Skeleton variant="rectangular" width={500} height={300} />
            )}
            {!loading && (
              <CardMedia
                component="img"
                alt={movie.title}
                image={IMAGE_PATH + movie.poster_path}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = `https://picsum.photos/200/300?${Math.random()}`;
                }}
              />
            )}
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {loading === false ? (
                  movie.title
                ) : (
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                )}
              </Typography>
              <Typography
                align="justify"
                variant="body2"
                gutterBottom
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {loading === false ? (
                  movie.overview
                ) : (
                  <>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </>
                )}
              </Typography>
              <Typography align="left" variant="subtitle1">
                Release: {movie.release_date}
              </Typography>
            </CardContent>
            {!loading && movie.vote_average ? (
              <span className={"movie-voting"}>{movie.vote_average}</span>
            ) : null}
            {loading && (
              <Skeleton
                className="movie-voting"
                variant="circular"
                width={16}
                height={16}
              />
            )}
          </Card>
        ))}
      </Box>

      <Stack spacing={2} alignItems="center">
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
          boundaryCount={2}
          count={totalPage}
          onChange={(e, value) => setPageApi(value)}
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
