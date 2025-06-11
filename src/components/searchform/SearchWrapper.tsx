import { SearchIcon, Map } from "lucide-react";

import { CircleX } from "lucide-react";
import SearchForm from "./SearchForm";
import { NavLink } from "../header/NavLink";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { HeaderProps } from "@/interfaces/header";
import classes from "../header/header.module.css";

export default function SearchWrapper({ onSearch, onRecenter, searchInput, setSearchInput }: HeaderProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [place, setPlace] = useState(null);

  return (
    <div className="search-wrapper flex gap-4 items-center">
      {pathname === '/' ? (
        <>
          {isSearchOpen ? (
            <CircleX
              className="sm:hidden cursor-pointer"
              onClick={() => {
                setIsSearchOpen(false);
                setPlace(null);
              }}
            >
              <span className="sr-only">Close</span>
            </CircleX>
          ) : (
            <SearchIcon className="sm:hidden cursor-pointer" onClick={() => setIsSearchOpen(true)} />
          )}
          <form className={`${classes.search_form} ${isSearchOpen ? classes.open : ''}`}>
            <SearchForm
              onSearch={onSearch}
              onRecenter={onRecenter}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              classes={classes.autocomplete_container}
              shouldFocus={isSearchOpen}
            />
          </form>
        </>
      ) : (
        <NavLink href="/">
          <Map />
          <span className="sr-only">Back to Map</span>
        </NavLink>
      )}
    </div>
  )
}