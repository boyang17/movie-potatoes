import { useMoviesStore } from "../stores/moviesStore";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

function movieDataTemplate(type, data, label, postfix = ":") {
  const flexRow = "flex flex-row gap-1";
  const isArray = Array.isArray(data);

  return (
    <div className={flexRow}>
      <p className="text-[#BDBDBD]">
        {isArray && data.length !== 1 && type === "detailed"
          ? `${label}s${postfix}`
          : `${label}${postfix}`}
      </p>
      <div className={flexRow}>
        {isArray ? (
          data.map((datum, index) => (
            <div key={`${datum}-${index}`} className={flexRow}>
              <p className="text-stone-700">
                {index === 0 || index === data.length || datum === ""
                  ? ""
                  : "\u00B7"}
              </p>
              <p>{datum}</p>
            </div>
          ))
        ) : (
          <p>{data}</p>
        )}
      </div>
    </div>
  );
}

function btnTemplate(
  movie,
  searchStatus,
  type,
  color,
  hoverColor,
  userId,
  style = "",
  text = true,
) {
  const btnStyle = `${style} flex flex-row items-center justify-center gap-2 p-1 pt-2 
  pb-2 transition ease-in-out duration-300 cursor-pointer ${text ? "w-45" : "w-auto"} rounded-sm `;

  const handleClick = useMoviesStore((state) => state.handleClick);
  const notify = (msg) => toast(msg);

  return (
    <button
      className={`${btnStyle} ${hoverColor} ${
        movie.status === type || searchStatus === type ? `${color}` : ""
      }`}
      onClick={() => {
        if (userId) {
          if (type === searchStatus) {
            notify(`Removed from your ${type}`);
          } else {
            notify(`Added to your ${type}`);
          }
          handleClick(movie, type, userId);
        } else {
          notify(`Sign in to add movies to ${type}`);
        }
      }}
    >
      {movie.status === type || searchStatus === type ? (
        type === "watched" ? (
          <>
            <Eye />
            {text && "Watched"}
          </>
        ) : (
          <>
            <Minus />
            {text && "On the Watchlist"}
          </>
        )
      ) : type === "watched" ? (
        <>
          <EyeOff />
          {text && "Mark as Watched"}
        </>
      ) : (
        <>
          <Plus />
          {text && "Add to Watchlist"}
        </>
      )}
    </button>
  );
}

export function DetailedMovieProfile({ movie, searchStatus }) {
  const { user } = useAuth();

  return (
    <div className="relative flex flex-row gap-5 w-6xl p-2 rounded-sm h-80">
      <img
        className="w-50 h-75"
        src={
          movie.movie_data["#IMG_POSTER"] ||
          "https://placehold.co/400x600?text=No+Image"
        }
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x600?text=No+Image";
        }}
        alt={movie.movie_data["#TITLE"]}
        title={movie.movie_data["#TITLE"]}
      />
      <div className="mt-auto mb-auto">
        <p className="text-2xl font-bold line-clamp-1 max-w-2xl">
          {movie.movie_data["#TITLE"]}
        </p>
        {movieDataTemplate("detailed", movie.movie_data.directors, "Director")}
        {movieDataTemplate("detailed", movie.movie_data.writers, "Writer")}
        {movieDataTemplate("detailed", movie.movie_data.stars, "Star")}
        {movieDataTemplate("detailed", movie.movie_data.genres, "Genre")}
        {movieDataTemplate(
          "detailed",
          movie.movie_data.duration,
          "Running time",
        )}
        {movieDataTemplate("detailed", movie.movie_data.country, "Country")}
        {movieDataTemplate(
          "detailed",
          movie.movie_data.datePublished,
          "Date Published",
        )}
        {movieDataTemplate(
          "detailed",
          movie.movie_data.contentRating,
          "Content Rating",
        )}
        <p className="w-4xl line-clamp-3">{movie.movie_data.plot}</p>
      </div>
      <div className="absolute top-3 right-3 flex flex-col gap-2 scale-90">
        {btnTemplate(
          movie,
          searchStatus,
          "watched",
          "bg-[#BB86FC]",
          "hover:bg-[#BB86FC]",
          user?.id,
        )}
        {btnTemplate(
          movie,
          searchStatus,
          "watchlist",
          "bg-[#FFB107]",
          "hover:bg-[#FFC107]",
          user?.id,
        )}
      </div>
    </div>
  );
}

export function CardMovieProfile({ movie, searchStatus }) {
  const { user } = useAuth();

  return (
    <div className="relative flex flex-row gap-5 w-6xl p-2 rounded-sm h-80">
      <img
        className="w-50 h-75"
        src={movie.movie_data["#IMG_POSTER"]}
        alt={movie.movie_data["#TITLE"]}
        title={movie.movie_data["#TITLE"]}
      />
      <div className="flex flex-col items-center text-center m-auto gap-15">
        <p className="text-4xl font-bold max-w-3xl line-clamp-1">
          {movie.movie_data["#TITLE"]}
        </p>
        <div className="flex flex-row gap-20 text-lg">
          {movieDataTemplate("simple", movie.movie_data.directors, "", "")}
          {movieDataTemplate("simple", movie.movie_data.year, "", "")}
          {movieDataTemplate("simple", movie.movie_data.country, "", "")}
          {movieDataTemplate("simple", movie.movie_data.duration, "", "")}
        </div>
        <div className="grid grid-cols-2 gap-20">
          {btnTemplate(
            movie,
            searchStatus,
            "watched",
            "bg-[#BB86FC]",
            "hover:bg-[#BB86FC]",
            user?.id,
          )}
          {btnTemplate(
            movie,
            searchStatus,
            "watchlist",
            "bg-[#FFC107]",
            "hover:bg-[#FFC107]",
            user?.id,
          )}
        </div>
      </div>
    </div>
  );
}

export function PosterMovieProfile({ movie, searchStatus }) {
  const { user } = useAuth();
  const style = "max-w-fit";
  const [showTitle, setShowTitle] = useState(false);

  return (
    <div
      className="relative group w-fit rounded-md outline-5 outline-transparent -outline-offset-4 hover:outline-[#40C4FF] transition ease-in-out duration-300"
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
    >
      <img
        className="rounded-md w-46 h-69"
        src={
          movie.movie_data["#IMG_POSTER"] ||
          "https://placehold.co/400x600?text=No+Image"
        }
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x600?text=No+Image";
        }}
        alt={movie.movie_data["#TITLE"]}
      />
      <div className="absolute left-0 right-0 bottom-5 flex justify-center text-white">
        <div className="transition ease-in-out duration-300 inline-flex w-fit flex-row gap-1 bg-black/82 rounded-sm px-1 h-8 opacity-0 group-hover:opacity-100">
          {btnTemplate(
            movie,
            searchStatus,
            "watched",
            "text-[#BB86FC]",
            "hover:text-[#BB86FC]",
            user?.id,
            style,
            false,
          )}
          {btnTemplate(
            movie,
            searchStatus,
            "watchlist",
            "text-[#FFC107]",
            "hover:text-[#FFC107]",
            user?.id,
            style,
            false,
          )}
        </div>
      </div>
      <div
        className={`opacity-0 absolute text-[#DBDBDB] py-1 px-2 rounded-md text-sm font-semibold left-1/2 
       -translate-x-1/2 -top-9 bg-[#282828] w-fit whitespace-nowrap flex justify-center
      ${showTitle ? "opacity-100" : ""} transition duration-200`}
      >
        {movie.movie_data["#TITLE"]}
      </div>
    </div>
  );
}
