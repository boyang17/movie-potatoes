import { Outlet } from "react-router";
import { NavBar } from "../components/NavBar";

export const HomeLayout = () => {
  return (
    <div className="flex flex-col">
      <div>
        <NavBar blendMode="text-white mix-blend-difference"/>
      </div>
      <Outlet />
    </div>
  );
};
