import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// This is just to create a packpack to put values I want to use globally
const AuthContext = createContext({});

// Simple function to stop typing it all the time to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// So this is the main code that actually provides the values?
export const AuthProvider = ({ children }) => {
  // One is to store the user info the other is an indicator to
  // show that the web app is still authenticating with supabase or not
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Whent the app first loads or reloads, this will get the session from the supabase, and sets the user info from the session
  // And it will listen to any change on the auth side, signing out etc
  // not sure what () => subscription.unsubscribe() does
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // the value will provide any component in the app with the user info, loading or not,
  // and three functions to sign in out or up.
  const value = {
    user,
    loading,
    signUp: async (email, username, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      return { data, error };
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    },
    signOut: () => supabase.auth.signOut(),
  };

  // Now this is to so that I can wrap the app with this and provide the auth
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
