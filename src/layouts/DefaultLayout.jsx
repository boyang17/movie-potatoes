import { Outlet } from "react-router";
import { NavBar } from "../components/NavBar";

export const DefaultLayout = () => {
  return (
    <div className="flex flex-col">
      <div>
        <NavBar />
      </div>
      <Outlet />
    </div>
  );
};
