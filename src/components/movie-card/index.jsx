import {
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { IMAGE_PATH } from "../../services/api";
import "./index.css";

const MovieCard = ({ movie, loading }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Card
      sx={{
        maxWidth: 345,
        borderTopRightRadius: "25px",
        borderTopLeftRadius: "25px",
      }}
      className="grid-item"
    >
      {loading && <Skeleton variant="rectangular" width={500} height={300} />}
      {loaded ? null : (
        <Skeleton variant="rectangular" width={500} height={300} />
      )}
      {!loading && (
        <CardMedia
          component="img"
          alt={movie.title}
          image={IMAGE_PATH + movie.poster_path}
          onLoad={() => setLoaded(true)}
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
          {loading ? (
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="60%" />
          ) : (
            `Release: ${movie.release_date}`
          )}
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
  );
};

export default MovieCard;
