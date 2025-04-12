'use client';

import React, { useState } from "react";
import { usePathname } from 'next/navigation';
import NavLink from "./NavLink";
import SearchForm from "@/components/searchform/SearchForm";
import { CircleUserRound, CircleX, Target } from "lucide-react";
import { BikeLockIcon } from '@/components/icons/bike-lock-icon';
import { Search as SearchIcon } from "lucide-react";
import classes from "./header.module.css";
import useAuth from "@/app/hooks/useAuth";

interface HeaderProps {
  onSearch?: (query: google.maps.places.PlaceResult | null) => void;
  onRecenter?: () => void;
}

const Header: React.FC<HeaderProps>= ({ onSearch, onRecenter }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const loggedIn = useAuth();

  return (
    <header className="z-10 w-full flex items-center text-white bg-[var(--primary-gray)]">
      <div className="logo p-4 md:min-w-72 max-w-72 min-w-fit">
        <h1 className="font-bold text-[1.25rem]">
          <span className="font-bold m-0">
            <NavLink href="/" classes="logo"><span className="flex items-center gap-1">
              <span className="pr-1"><BikeLockIcon /></span>BikeLock Finder</span>
            </NavLink>
          </span>
        </h1>
      </div>

      <div className="flex justify-between w-full items-center gap-2">
        <div className="search-wrapper flex items-center gap-2">
          {pathname === '/' && (
            <>
              {isSearchOpen ? (
                <CircleX className="sm:hidden cursor-pointer" onClick={() => setIsSearchOpen(false)}>
                  <span className="sr-only">Close</span>
                </CircleX>
              ) : (
                <SearchIcon className="sm:hidden cursor-pointer" onClick={() => setIsSearchOpen(true)} />
              )}
              <form className={`${classes.search_form} ${isSearchOpen ? classes.open : ''}`}>
                <SearchForm onSearch={onSearch} classes={classes.autocomplete_container} />
              </form>

              <Target className="md:hidden cursor-pointer" onClick={onRecenter} />
              <button className="button hidden md:inline-block" onClick={onRecenter}>Re-center</button>
            </>
          )}
        </div>

        <nav className={classes.nav}>
          <ul className="flex">
            <li>
              <NavLink href="/about">About</NavLink>
            </li>
            <li>
              <NavLink href="/login" classes="flex gap-1">
                <CircleUserRound />
                  {loggedIn ? (
                    <div className="login-info hidden md:block">
                      <span>{loggedIn.email}</span>
                    </div>
                  ) : (
                    <span className="hidden sm:block">Login</span>
                  )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;
