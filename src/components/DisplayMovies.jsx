import { useEffect, useState } from "react";
import { useMoviesStore } from "../stores/moviesStore";
import { useViewStore } from "../stores/viewStore";
import {
  DetailedMovieProfile,
  CardMovieProfile,
  PosterMovieProfile,
} from "./MovieProfile";
import { FilterBar } from "./FilterBar";
import { useAuth } from "../contexts/authContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DisplayMovies({ type, signedInText, signedOutText }) {
  const { user } = useAuth();
  const movies = useMoviesStore((state) => state.movies);
  const fetchMovies = useMoviesStore((state) => state.fetchMovies);
  const view = useViewStore((state) => state.view);
  const toggleView = useViewStore((state) => state.toggleView);
  const displayStyleUL =
    view === "Poster"
      ? "grid grid-cols-6 w-6xl pt-5 mb-4"
      : "flex flex-col divide-y mb-4";
  const displayStyleLI = view === "Poster" ? "py-1" : "py-3";
  const [moviesPerPage, setMoviesPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) {
      fetchMovies(user.id);
    }
  }, [user, fetchMovies]);

  useEffect(() => {
    if (view === "Detailed" || view === "Card") {
      setCurrentPage(1);
      setMoviesPerPage(8);
    } else if (view === "Poster") {
      setCurrentPage(1);
      setMoviesPerPage(18);
    }
  }, [view]);

  const moviesList = movies
    .filter((movie) => movie.status === type)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const moviesToDisplay = moviesList.slice(
    moviesPerPage * (currentPage - 1),
    moviesPerPage * currentPage,
  );

  function isOnRecord(movie) {
    const found = movies.find((m) => m.imdb_id === movie.imdb_id);
    return found ? [true, found.status] : [false, null];
  }

  function chooseView(movie, status = null) {
    if (view === "Detailed") {
      return <DetailedMovieProfile movie={movie} searchStatus={status} />;
    } else if (view === "Card") {
      return <CardMovieProfile movie={movie} searchStatus={status} />;
    } else {
      return <PosterMovieProfile movie={movie} searchStatus={status} />;
    }
  }

  function choosePages() {
    const pages = [];
    const lastPage = Math.ceil(moviesList.length / moviesPerPage);

    if (lastPage <= 7) {
      return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    pages.push(1);

    if (currentPage <= 3) {
      pages.push(2, 3, 4, "...");
    } else if (currentPage >= lastPage - 2) {
      pages.push("...", lastPage - 3, lastPage - 2, lastPage - 1);
    } else {
      pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
    }

    pages.push(lastPage);

    return pages;
  }

  return (
    <div>
      {user ? (
        <p className="flex justify-center pt-5 pb-2 text-lg font-semibold">
          {`${signedInText} ${moviesList.length} movies`}
        </p>
      ) : (
        <p className="flex justify-center pt-5 pb-2 text-lg font-semibold">
          {signedOutText}
        </p>
      )}
      {user ? (
        <div>
          <div
            className={`${
              moviesList.length !== 0 ? "" : "invisible"
            } flex justify-end`}
          >
            <FilterBar view={view} onViewChange={toggleView} />
          </div>
          <ul className={displayStyleUL} style={{ zoom: 0.85 }}>
            {moviesToDisplay.map((movie, index) => {
              const [isRecorded, status] = isOnRecord(movie);
              return (
                <li
                  key={`${movie.movie_data["#TITLE"]}-${index}`}
                  className={displayStyleLI}
                >
                  {isRecorded ? chooseView(movie, status) : chooseView(movie)}
                </li>
              );
            })}
          </ul>
          {moviesList.length !== 0 && (
            <div
              className={`flex flex-row gap-2 items-center justify-between mb-4 `}
            >
              <button
                className={`${currentPage === 1 ? " opacity-0" : "cursor-pointer"}`}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </button>
              <ul className={`flex flex-row gap-2.5 select-none`}>
                {choosePages().map((page, index) => {
                  return (
                    <li
                      key={`page-${index}`}
                      className={`transition duration-200 px-1.5 ${page === "..." || page === currentPage ? "cursor-default text-gray-400" : "cursor-pointer hover:bg-[#9E9E9E]/30"}`}
                      onClick={() => {
                        if (page !== "..." || page !== currentPage) {
                          setCurrentPage(page);
                        }
                      }}
                    >
                      {page}
                    </li>
                  );
                })}
              </ul>
              <button
                className={`${currentPage === Math.ceil(moviesList.length / moviesPerPage) ? "opacity-0" : "cursor-pointer"}`}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={
                  currentPage === Math.ceil(moviesList.length / moviesPerPage)
                }
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
