import { Authentication } from "../components/Authentication";
import { useEffect } from "react";

export const AuthenticationPage = () => {
  useEffect(() => {
    document.title = "Authentication";
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none ">
      <Authentication />
    </div>
  );
};
