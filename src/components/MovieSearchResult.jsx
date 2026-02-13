import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { DetailedMovieProfile } from "./MovieProfile";
import { useMoviesStore } from "../stores/moviesStore";
import { SearchX } from "lucide-react";

export function MovieSearchResult() {
  const { user } = useAuth();
  const movies = useMoviesStore((state) => state.movies);
  const fetchMovies = useMoviesStore((state) => state.fetchMovies);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q");

  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    getMovie();
  }, [searchTerm]);

  useEffect(() => {
    if (user) {
      fetchMovies(user.id);
    }
  }, [user, fetchMovies]);

  async function getMovie() {
    setIsLoading(true);
    const options = {
      method: "GET",
      url: `https://imdb.iamidiotareyoutoo.com/search?q=${searchTerm}`,
    };

    try {
      const { data } = await axios.request(options);

      const detailsPromises = data.description.map(async (item) => {
        try {
          const detailsOptions = {
            method: "GET",
            url: `https://imdb.iamidiotareyoutoo.com/search?tt=${item["#IMDB_ID"]}`,
          };

          const { data: detailData } = await axios.request(detailsOptions);

          const directors = [
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[0].credits[0].name.nameText.text,
              "",
            ),
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[0].credits[1].name.nameText.text,
              "",
            ),
          ].filter(Boolean);
          const stars = [
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[2].credits[0].name.nameText.text,
              "",
            ),
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[2].credits[1].name.nameText.text,
              "",
            ),
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[2].credits[2].name.nameText.text,
              "",
            ),
          ].filter(Boolean);
          const writers = [
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[1].credits[0].name.nameText.text,
              "",
            ),
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[1].credits[1].name.nameText.text,
              "",
            ),
            getDetail(
              detailData,
              (data) =>
                data.top.principalCreditsV2[1].credits[2].name.nameText.text,
              "",
            ),
          ].filter(Boolean);

          return {
            id: null,
            movie_id: null,
            imdb_id: getDetail(detailData, (data) => data.imdbId),
            status: "none",
            created_at: null,
            movie_data: {
              ...item,
              type: getDetail(
                detailData,
                (data) => data.short["@type"],
                "Unkown type",
              ),
              genres: getDetail(detailData, (data) => data.short.genre, ""),
              contentRating: getDetail(
                detailData,
                (data) => data.short.contentRating,
                "None",
              ),
              datePublished: americanDateBuilder(
                getDetail(detailData, (data) => data.top.releaseDate.day, null),
                getDetail(
                  detailData,
                  (data) => data.top.releaseDate.month,
                  null,
                ),
                getDetail(
                  detailData,
                  (data) => data.top.releaseDate.year,
                  null,
                ),
              ),
              country: getDetail(
                detailData,
                (data) => data.top.releaseDate.country.text,
                "Unkown",
              ),
              duration: getDetail(
                detailData,
                (data) => data.top.runtime.displayableProperty.value.plainText,
                "Unkown",
              ),
              directors: directors.length ? directors : ["Unkown"],
              stars: stars.length ? stars : ["Unkown"],
              plot: getDetail(
                detailData,
                (data) => data.top.plot.plotText.plainText,
                "",
              ),
              writers: writers.length ? writers : ["Unkown"],
              year: getDetail(
                detailData,
                (data) => data.top.releaseDate.year,
                "Unkown",
              ),
            },
          };
        } catch (error) {
          console.error(`Error fetching ${item["#IMDB_ID"]}:`, error);
          return null;
        }
      });

      const allResults = await Promise.all(detailsPromises);

      const moviesOnly = allResults.filter(
        (item) => item.movie_data.type === "Movie",
      );

      if (moviesOnly.length !== 0) {
        setSearchResult(moviesOnly);
        setIsLoading(false);
      } else {
        setSearchResult(["No Results Found"]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function getDetail(data, fn, fallback) {
    try {
      return fn(data) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function americanDateBuilder(day, month, year) {
    return day && month && year
      ? `${MONTHS[month - 1]} ${day}, ${year}`
      : "Unkown date";
  }

  function isOnRecord(movie) {
    const found = movies.find((m) => m.imdb_id === movie.imdb_id);
    return found ? [true, found.status] : [false, null];
  }

  return (
    <div>
      <p className="flex justify-center pt-5 pb-2 text-lg font-semibold">
        Search "{searchTerm}"
      </p>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`loading-${index}`}
            className="mx-auto min-w-3xl h-80 rounded-md p-4 flex items-center"
          >
            <div className="flex animate-pulse space-x-4">
              <div className="w-40 h-60 bg-gray-200"></div>
              <div className="flex-1 space-y-6 py-1 ">
                <div className="h-4 w-60 rounded bg-gray-200"></div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-4 mt-auto mb-auto">
                    <div className="w-75 h-2 rounded bg-gray-200"></div>
                    <div className="w-100 h-2 rounded bg-gray-200"></div>
                    <div className="w-80 h-2 rounded bg-gray-200"></div>
                    <div className="w-50 h-2 rounded bg-gray-200"></div>
                    <div className="w-40 h-2 rounded bg-gray-200"></div>
                    <div className="w-50 h-2 rounded bg-gray-200"></div>
                    <div className="w-40 h-2 rounded bg-gray-200"></div>
                    <div className="w-175 h-2 rounded bg-gray-200"></div>
                    <div className="w-175 h-2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : searchResult[0] === "No Results Found" ? (
        <div
          className={
            "flex items-center flex-col gap-5 justify-center text-xl my-50"
          }
        >
          <SearchX size={100} color="#FFB8B8" />
          <p className="font-medium">No Results Found</p>
        </div>
      ) : (
        <>
          <div className={"flex justify-end"}></div>
          <ul className="flex flex-col divide-y" style={{ zoom: 0.85 }}>
            {searchResult.map((movie, index) => {
              const [isRecorded, status] = isOnRecord(movie);
              return (
                <li
                  key={`${movie.movie_data["#TITLE"]}-${index}`}
                  className="py-3"
                >
                  {isRecorded ? (
                    <DetailedMovieProfile movie={movie} searchStatus={status} />
                  ) : (
                    <DetailedMovieProfile movie={movie} />
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
