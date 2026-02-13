import { DefaultLayout } from "./layouts/DefaultLayout";
import { HomeLayout } from "./layouts/HomeLayout";
import { AuthenticationLayout } from "./layouts/AuthenticationLayout";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { HomePage } from "./pages/HomePage";
import { MovieWatchlistPage } from "./pages/MovieWatchlistPage";
import { MoviesWatchedPage } from "./pages/MoviesWatchedPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { SearchResultPage } from "./pages/MovieSearchResultPage";
import { AuthenticationPage } from "./pages/AuthenticationPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/*" element={<HomePage />} />
          </Route>
          <Route element={<DefaultLayout />}>
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/watchlist" element={<MovieWatchlistPage />} />
            <Route path="/watched" element={<MoviesWatchedPage />} />
          </Route>
          <Route element={<AuthenticationLayout />}>
            <Route
              path="/authentication"
              element={
                <PublicOnlyRoute>
                  <AuthenticationPage />
                </PublicOnlyRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            maxWidth: "fit-content",
            width: "auto",
            whiteSpace: "nowrap",
          },
          duration: 2000,
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "white",
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: "#FF5C5C",
              secondary: "white",
            },
          },
        }}
      />
    </>
  );
}

export default App;
