import { DisplayMovies } from "../components/DisplayMovies";

export const MoviesWatchedPage = () => {
  return (
    <div className="flex justify-center">
      <DisplayMovies
        type="watched"
        signedInText="Watched - You have seen "
        signedOutText="Sign in to track movies you have watched"
      />
    </div>
  );
};
