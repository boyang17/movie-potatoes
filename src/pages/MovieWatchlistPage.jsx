import { DisplayMovies } from "../components/DisplayMovies";

export const MovieWatchlistPage = () => {
  return (
    <div className="flex justify-center">
      <div className="flex justify-center">
        <DisplayMovies
          type="watchlist"
          signedInText="Watchlist - You want to see "
          signedOutText="Sign in to save movies you want to watch"
        />
      </div>
    </div>
  );
};
