import { useAuth } from "../contexts/authContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { Link } from "react-router";

export function Authentication() {
  const { signIn, signUp } = useAuth();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const inputStyle =
    "border-1 rounded-sm py-1 px-2 min-w-[300px] focus:outline-none shadow-sm";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (register) {
        const duplicateEmailWarning = await checkExistingUser(email);

        if (duplicateEmailWarning) {
          toast.error(duplicateEmailWarning);
          return;
        }

        const { error } = await signUp(email, username, password);

        if (error) {
          handleError(error, true);
        } else {
          toast.success("Check your email to confirm your signup");
          navigate("/");
        }
      } else {
        const { error } = await signIn(email, password);

        if (error) {
          handleError(error, false);
        } else {
          toast.success("Signed in successfully");
        }
      }
    } catch (error) {
      console.error("Authorization Error: ", error);
      toast.error("An unexpected error occurred, try again");
    }
  };

  const handleError = (error, isSignUp) => {
    switch (error.message) {
      case "Invalid login credentials":
        toast.error("Invalid email or password");
        break;
      case "Email not confirmed":
        toast.error("Confirm your email before signing in");
        break;
      case "User already registered":
        toast.error("Email has been registered, sign in instead");
        break;
      case "Password should be at least 6 characters":
        toast.error("Password must be at least 6 characters long");
        break;
      case "Unable to validate email address: invalid format":
        toast.error("Please enter a valid email address");
        break;
      case "User not found":
        toast.error("No account found with this email, sign up first");
        break;
      case "Email rate limit exceeded":
        toast.error("Too many attempts, try again later");
        break;
      default:
        if (error.message.includes("Invalid email")) {
          toast.error("Enter a valid email address");
        } else if (error.message.includes("password")) {
          toast.error(
            isSignUp
              ? "Password must be at least 6 characters"
              : "Incorrect password",
          );
        } else if (error.message.includes("not found")) {
          toast.error("No account found with this email");
        } else {
          toast.error(error.message || "Authentication failed, try again");
        }
    }
  };

  const checkExistingUser = async (email) => {
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return "This email address is already associated with an account.";
    }
  };

  const handleOnEnter = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" p-10 rounded-md shadow-xl pointer-events-auto bg-white text-[#121212]"
    >
      <div className="flex flex-col w-75 items-center gap-5">
        <Link to="/">
          <p className="nameText select-none text-4xl scale-135">
            Movie Potatoes
          </p>
        </Link>
        <p className="font-semibold text-2xl">
          {!register ? "Sign in" : "Create An Account"}
        </p>
        <div>
          <label className="font-semibold" htmlFor="email">
            Email address
          </label>
          <input
            className={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {!register ? (
          <></>
        ) : (
          <div>
            <label className="font-semibold flex flex-col" htmlFor="username">
              Username
            </label>
            <input
              className={inputStyle}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              pattern="^[a-zA-Z0-9_]{3,15}$"
              minLength={3}
              maxLength={15}
              placeholder="a-z, 0-9 or _ only"
              required
            />
          </div>
        )}
        <div>
          <label className="font-semibold flex flex-col" htmlFor="password">
            Password
          </label>
          <input
            className={inputStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleOnEnter}
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-[#40C4FF] rounded w-25 py-1 cursor-pointer"
        >
          {!register ? "Sign in" : "Sign up"}
        </button>
        <div className="flex gap-1">
          <p> {!register ? "Don't have an account?" : "Have an account?"}</p>
          <button
            className="text-[#40C4FF] cursor-pointer"
            onClick={() => {
              setRegister(!register);
              setEmail("");
              setUsername("");
              setPassword("");
            }}
          >
            {!register ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </form>
  );
}
