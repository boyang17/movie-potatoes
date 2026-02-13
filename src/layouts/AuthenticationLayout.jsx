import { Outlet } from "react-router";

export const AuthenticationLayout = () => {
  return (
    <div className="flex flex-col">
      <Outlet />
    </div>
  );
};
