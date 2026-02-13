import { MovieSearchResult } from "../components/MovieSearchResult";
import { useEffect } from "react";

export const SearchResultPage = () => {
  useEffect(() => {
    document.title = "Search Result";
  }, []);

  return (
    <div className="flex justify-center ">
      <MovieSearchResult />
    </div>
  );
};
