'use client';

import React, { useState } from "react";
import NavLink from "./nav-link";
import Search from "./search";
import { Bike, CircleUserRound, CircleX } from "lucide-react";
import { Search as SearchIcon } from "lucide-react";
import classes from "./header.module.css";

interface HeaderProps {
  onSearch: (query: google.maps.places.PlaceResult | null) => void;
}

const Header: React.FC<HeaderProps>= ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="flex items-center text-white bg-[#242424]">

      <div className="logo p-4 sm:min-w-72 max-w-72 min-w-fit">
        <h1>
          <span className="font-bold text-lg m-0">
            <NavLink href="/"><span className="flex items-center gap-1">
              <Bike size="20" color="var(--primary-white)" />BikeLock Finder</span>
            </NavLink>
          </span>
        </h1>
      </div>

      <div className="flex justify-between w-full items-center">
        <div className="search-wrapper">
          {isSearchOpen ? (
            <CircleX className="sm:hidden cursor-pointer" onClick={() => setIsSearchOpen(false)}>
              <span className="sr-only">Close</span>
            </CircleX>
          ) : (
            <SearchIcon className="sm:hidden cursor-pointer" onClick={() => setIsSearchOpen(true)} />
          )}
          <form className={`${classes.search_form} ${isSearchOpen ? classes.open : ''}`}>
            <Search onSearch={onSearch} />
          </form>
        </div>

        <nav className={classes.nav}>
          <ul className="flex">
            <li>
              <NavLink href="/about">About</NavLink>
            </li>
            <li>
              <NavLink href="/login"><CircleUserRound /><span className="sr-only">Login</span></NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;
