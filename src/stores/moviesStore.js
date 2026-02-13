import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export const useMoviesStore = create((set, get) => ({
  movies: [],
  loading: false,

  fetchMovies: async (userId) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("user_movies")
      .select(
        `
        id,
        status,
        created_at,
        movie_id,
        movies (
          id,
          imdb_id,
          movie_data
        )
      `,
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching movies: ", error);
    } else {
      const flattenedMovies = (data || []).map((item) => ({
        id: item.id,
        movie_id: item.movies.id,
        imdb_id: item.movies.imdb_id,
        movie_data: item.movies.movie_data,
        status: item.status,
        created_at: item.created_at,
      }));
      set({ movies: flattenedMovies });
    }

    set({ loading: false });
  },

  addMovie: async (movie, status, userId) => {
    const movieToAdd = {
      ...movie,
      status: status,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      movies: [...state.movies, movieToAdd],
    }));

    try {
      const { data: existingMovies, error: searchError } = await supabase
        .from("movies")
        .select("id")
        .eq("imdb_id", movie.imdb_id);

      let movieId;

      if (existingMovies && existingMovies.length > 0) {
        movieId = existingMovies[0].id;
      } else {
        const { data: newMovie, error: insertError } = await supabase
          .from("movies")
          .insert({
            imdb_id: movie.imdb_id,
            movie_data: movie.movie_data,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        movieId = newMovie.id;
      }

      const { data: userMovie, error: userMovieError } = await supabase
        .from("user_movies")
        .insert({
          user_id: userId,
          movie_id: movieId,
          status: status,
        })
        .select(
          `
        id,
        status,
        created_at,
        movie_id,
        movies (
          id,
          imdb_id,
          movie_data
        )
      `,
        )
        .single();

      if (userMovieError) throw userMovieError;

      const flattenedMovie = {
        id: userMovie.id,
        movie_id: userMovie.movies.id,
        imdb_id: userMovie.movies.imdb_id,
        movie_data: userMovie.movies.movie_data,
        status: userMovie.status,
        created_at: userMovie.created_at,
      };

      set((state) => ({
        movies: state.movies.map((m) =>
          m.imdb_id === movie.imdb_id ? flattenedMovie : m,
        ),
      }));
    } catch (error) {
      console.error("Error adding movie:", error);
      set((state) => ({
        movies: state.movies.filter((m) => m.imdb_id !== movie.imdb_id),
      }));
    }
  },

  toggleStatus: async (id, status) => {
    const movie = get().movies.find((m) => m.imdb_id === id);
    if (!movie) return;

    const newStatus = movie.status === status ? "none" : status;

    set((state) => ({
      movies: state.movies.map((movie) => {
        if (movie.imdb_id === id) {
          return {
            ...movie,
            status: newStatus,
            created_at: new Date().toISOString(),
          };
        } else {
          return movie;
        }
      }),
    }));

    if (movie.id) {
      const { error } = await supabase
        .from("user_movies")
        .update({ status: newStatus, created_at: new Date().toISOString() })
        .eq("id", movie.id);

      if (error) {
        console.error("Error updating status:", error);
        set((state) => ({
          movies: state.movies.map((m) =>
            m.imdb_id === id ? { ...m, status: movie.status } : m,
          ),
        }));
      }
    }
  },

  deleteMovies: async () => {
    const moviesToDelete = get().movies.filter(
      (movie) => movie.status === "none",
    );
    const dbIdsToDelete = moviesToDelete.filter((m) => m.id).map((m) => m.id);

    set((state) => ({
      movies: state.movies.filter((movie) => movie.status !== "none"),
    }));

    if (dbIdsToDelete.length > 0) {
      const { error } = await supabase
        .from("user_movies")
        .delete()
        .in("id", dbIdsToDelete);

      if (error) {
        console.error("Error deleting movies:", error);
        set((state) => ({
          movies: [...state.movies, ...moviesToDelete],
        }));
      }
    }
  },

  handleClick: async (movie, status, userId) => {
    const doesExist = get().movies.find((m) => m.imdb_id === movie.imdb_id);

    if (doesExist) {
      await get().toggleStatus(movie.imdb_id, status);
      await get().deleteMovies();
    } else {
      await get().addMovie(movie, status, userId);
    }
  },
}));
