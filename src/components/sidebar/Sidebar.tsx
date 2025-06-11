import { useState } from 'react';
import classes from "./sidebar.module.css";
import { MarkerProps } from "@/interfaces/markers";
import { useAuth } from "@/contexts/AuthProvider";
import { CircleUserRound, LocateFixed, MapPinPlusInside, Info, Trophy } from "lucide-react";
import BikeLockIcon from '@/components/icons/bike-lock-icon';
import Link from "next/link";
import { useModal } from "@/contexts/ModalProvider";
import AddLock from "@/components/addlock/AddLock";
import { NavLink } from "../header/NavLink";
import SearchWrapper from "../searchform/SearchWrapper";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useUserDocument } from '@/lib/users';
import Image from 'next/image';

interface SidebarProps {
  updateLocation: () => void;
  onAddLock?: (pointData?: MarkerProps | null) => void;
  onSearch?: (place: google.maps.places.PlaceResult | null) => void;
  onRecenter?: () => void;
}

export default function Sidebar({ updateLocation, onAddLock, onSearch, onRecenter }: SidebarProps) {
  const { user, isLoading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const { openModal } = useModal();
  const [searchInput, setSearchInput] = useState('');
  const { userData, isLoading: userLoading } = useUserDocument(user?.uid || null);

  const handleAddLock = () => {
    openModal(<AddLock formMode="add" />, 'Add Lock');
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return null;
  }

  return (
    <aside className={classes.sidebar}>
      <div className="sidebar-layout-wrapper flex flex-col gap-8 justify-between md:px-8 h-full">

        <div className="flex flex-col gap-4">
          {!isMobile && (
            <div className="flex items-center justify-between px-4 md:px-0">
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
            </div>
          )}

          <div className="flex flex-col gap-4 sm:gap-4">

            <div className="hidden md:block intro">
              <p>Find or add lock stations on the map to safely and conveniently lock your bike.</p>
            </div>

            {!isMobile && (
              <SearchWrapper onSearch={onSearch} onRecenter={onRecenter} searchInput={searchInput} setSearchInput={setSearchInput} />
            )}

            <nav className={classes.nav}>
              <ul className="flex justify-between w-full">
                <li>
                  <Link href="/about" className={classes.button}>
                    <span className={classes.button__icon}>
                      <Info />
                    </span>
                    <span className="text-xs hidden md:block">About</span>
                  </Link>
                </li>
                <li>
                  <button onClick={updateLocation} className={classes.button}>
                    <span className={classes.button__icon}>
                      <LocateFixed />
                    </span>
                    <span className="text-xs hidden md:block">Locate Me</span>
                  </button>
                </li>
                {user ? (
                  <>
                    <li>
                      <button onClick={handleAddLock} className={classes.button}>
                        <span className={classes.button__icon}>
                          <MapPinPlusInside />
                        </span>
                        <span className="text-xs hidden md:block">Add Lock</span>
                      </button>
                    </li>

                    {isMobile && (
                      <li>
                        <Link href="/account" className={classes.button}>
                          <span className={classes.button__icon}>
                            <CircleUserRound />
                          </span>
                          <span className="text-xs hidden md:block">Account</span>
                        </Link>
                      </li>
                    )}
                  </>
                ) : (
                  <li>
                    <Link href="/login" className={classes.button}>
                      <span className={classes.button__icon}>
                        <CircleUserRound />
                      </span>
                      <span className="text-xs hidden md:block">Login</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        {user && !userLoading && !isMobile && (
          <div className="flex pt-2 md:pt-8 border-t border-gray-700">
            <div className="user-info">
              <Link href="/account" className="flex items-center gap-2">
                {userData?.photoURL && typeof userData.photoURL === 'string' && (() => {
                  try {
                    new URL(userData.photoURL);
                    return (
                      <Image
                        src={userData.photoURL}
                        width={50}
                        height={50}
                        className="rounded-full object-cover w-[50px] h-[50px]"
                        alt='User profile photo'
                        priority={true}
                      />
                    );
                  } catch {
                    return null;
                  }
                })()}
                <div className="flex items-center gap-2">
                  {(!userData?.photoURL || typeof userData.photoURL !== 'string') && <CircleUserRound />}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-[var(--primary-white)] text-sm">{userData?.displayName || userData?.email}</span>
                    <span className="flex items-center gap-2 text-[var(--primary-white)] text-sm text-gray-400 font-light bg-[var(--primary-light-gray)] px-2 py-1 rounded-md"><Trophy size={12} color={"var(--primary-gold)"}/>{25} contributions</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};