import { Link } from "react-router";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";
import "../index.css";
import {
  BookmarkPlus,
  Clapperboard,
  House,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import toast from "react-hot-toast";

export function NavBar({ blendMode }) {
  const barStyle = "border-2 rounded-lg py-1 px-2 min-w-sm focus:outline-none ";
  const menuItems = [
    { title: "Home", slug: "/", icon: House },
    { title: "Watchlist", slug: "/watchlist", icon: BookmarkPlus },
    { title: "Watched", slug: "/watched", icon: Clapperboard },
  ];

  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-row gap-5 items-center justify-center p-2 font-bold ">
      <Link to={menuItems[0].slug}>
        <div className={`flex flex-row gap-1 ${blendMode}`}>
          <p className={`${blendMode} nameText select-none`}>Movie Potatoes</p>
        </div>
      </Link>
      <div className={blendMode}>
        <SearchBar className={barStyle} />
      </div>
      {menuItems.slice(1).map((item, index) => {
        const Icon = item.icon;
        return (
          <Link to={item.slug} key={`${item.title}-${index}`}>
            <div className={`flex flex-row gap-1 ${blendMode}`}>
              <Icon />
              <p>{item.title}</p>
            </div>
          </Link>
        );
      })}

      {user ? (
        <Menu as="div" className="relative inline-block">
          {({ open }) => (
            <>
              <MenuButton className="flex flex-row gap-1 font-bold cursor-pointer w-26">
                <div
                  className={`flex flex-row gap-1 items-center ${blendMode}`}
                >
                  <User />
                  {user.user_metadata.username}
                  {open ? (
                    <ChevronUp size={15} strokeWidth={4} />
                  ) : (
                    <ChevronDown size={15} strokeWidth={4} />
                  )}
                </div>
              </MenuButton>
              <div className="isolate">
                <MenuItems
                  transition
                  className="absolute -right-4 z-100 mt-2 max-w-30 origin-top-right
             rounded-sm outline-1 outline-white/10
             isolate mix-blend-normal bg-slate-50 text-black
             transition data-closed:scale-95 data-closed:transform
             data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out 
             data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-0 flex flex-col items-center justify-center">
                    <MenuItem>
                      <button
                        className="w-30 text-center block px-4 py-2 data-focus:bg-[rgb(88,64,42)]/10 cursor-pointer"
                        onClick={async () => {
                          const { error } = await signOut();
                          if (error) {
                            toast.error(error.message);
                          } else {
                            toast.success("Signed out successfully");
                          }
                        }}
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </div>
            </>
          )}
        </Menu>
      ) : (
        <div
          className={`flex flex-row gap-1 font-bold cursor-pointer w-26 ${blendMode}`}
        >
          <Link to="/authentication">
            <div className="flex flex-row gap-1">
              <User />
              Sign in
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
