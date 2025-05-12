'use client';

import React, { useState } from "react";
import { usePathname } from 'next/navigation';
import { NavLink } from "./NavLink";
import SearchForm from "@/components/searchform/SearchForm";
import { CircleX, Target, Map } from "lucide-react";
import BikeLockIcon from '@/components/icons/bike-lock-icon';
import { Search as SearchIcon } from "lucide-react";
import classes from "./header.module.css";
import { HeaderProps } from "@/interfaces/header";

export default function Header({ onSearch, onRecenter }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 w-full flex p-4 items-center text-white bg-[var(--primary-gray)]">
      <div className="logo md:min-w-72 max-w-72 min-w-fit">
        <h1 className="font-bold text-[1.25rem]">
          <span className="font-bold m-0">
            <NavLink href="/" classes="logo">
              <div className="flex items-center gap-2">
                <BikeLockIcon />BikeLock Finder
              </div>
            </NavLink>
          </span>
        </h1>
      </div>

      <div className="flex w-full justify-end">
        <div className="search-wrapper flex gap-4">
          {pathname === '/' ? (
            <>
              {isSearchOpen ? (
                <CircleX className="sm:hidden cursor-pointer" onClick={() => setIsSearchOpen(false)}>
                  <span className="sr-only">Close</span>
                </CircleX>
              ) : (
                <SearchIcon className="sm:hidden cursor-pointer" onClick={() => setIsSearchOpen(true)} />
              )}
              <form className={`${classes.search_form} ${isSearchOpen ? classes.open : ''}`}>
                <SearchForm
                  onSearch={onSearch}
                  classes={classes.autocomplete_container}
                  shouldFocus={isSearchOpen}
                />
              </form>

              <Target className="md:hidden cursor-pointer" onClick={onRecenter} />
              <button className="button hidden md:inline-block" onClick={onRecenter}>Re-center</button>
            </>
          ) : (
            <NavLink href="/">
              <Map />
              <span className="sr-only">Back to Map</span>
            </NavLink>
          )}
        </div>
      </div>

    </header>
  )
}