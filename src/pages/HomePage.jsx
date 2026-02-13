import { useAuth } from "../contexts/authContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const HomePage = () => {
  const { user } = useAuth();
  const [movieStillURL, setmovieStillURL] = useState(null);
  const welcomeTextStyle =
    "absolute inset-0 flex flex-col items-center justify-center text-white  font-serif font-semibold text-[41px] [text-shadow:0_0_2px_rgba(255,255,255,0.45)] tracking-wide";

  useEffect(() => {
    const controller = new AbortController();

    const fetchRandMovieStill = async () => {
      const { data, error } = await supabase.from("movie_stills").select("url");

      if (error) {
        console.error("Error fetching stills:", error);
        return;
      }

      if (data && data.length > 0) {
        const random = Math.floor(Math.random() * data.length);
        setmovieStillURL(data[random].url);
      }
    };

    fetchRandMovieStill();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title = "Movie Potatoes";
  }, []);

  return (
    <div className="pointer-events-none">
      <div className="fixed inset-0 -z-10">
        <img
          src={movieStillURL}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/12 z-5" />
      </div>
      {user ? (
        <div className={welcomeTextStyle}>
          <p>Welcome Back, {user.user_metadata.username}</p>
        </div>
      ) : (
        <div className={welcomeTextStyle}>
          <p>Track movies you have watched.</p>
          <p>Save those you want to see.</p>
        </div>
      )}
    </div>
  );
};
