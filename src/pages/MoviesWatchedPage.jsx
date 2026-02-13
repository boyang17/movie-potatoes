import { DisplayMovies } from "../components/DisplayMovies";
import { useEffect } from "react";

export const MoviesWatchedPage = () => {
  useEffect(() => {
    document.title = "Watched";
  }, []);

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
