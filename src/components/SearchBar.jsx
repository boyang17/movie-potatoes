import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ className }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
      setSearchTerm("");
    } else {
      console.error("Search term cannot be empty!");
    }
  };

  const handleOnEnter = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative font-semibold">
      <input
        className={className}
        type="text"
        placeholder="Search a movie"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleOnEnter}
      />
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 scale-90 cursor-pointer"
        onClick={handleSearch}
      >
        <Search strokeWidth={3} />
      </button>
    </div>
  );
}
