import { useState } from 'react';
import classes from "./sidebar.module.css";
import { MarkerProps } from "@/interfaces/markers";
import useAuth from "@/app/hooks/useAuth";
import { CircleUserRound, LocateFixed, MapPinPlusInside, Info } from "lucide-react";
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
  const { user, loading: authLoading } = useAuth();
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
      <div className="sidebar-layout-wrapper flex flex-col gap-4 justify-between md:px-6 h-full">

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

          <div className="flex flex-col gap-0 sm:gap-4">

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
                    <span className="text-sm">About</span>
                  </Link>
                </li>
                <li>
                  <button onClick={updateLocation} className={classes.button}>
                    <span className={classes.button__icon}>
                      <LocateFixed />
                    </span>
                    <span className="text-sm">Locate Me</span>
                  </button>
                </li>
                {user ? (
                  <>
                    <li>
                      <button onClick={handleAddLock} className={classes.button}>
                        <span className={classes.button__icon}>
                          <MapPinPlusInside />
                        </span>
                        <span className="text-sm">Add Lock</span>
                      </button>
                    </li>
                    <li className="flex md:hidden flex-col items-center gap-1">
                      <Link href="/account" className={classes.button}>
                        <span className={classes.button__icon}>
                          <CircleUserRound />
                        </span>
                        <span className="text-sm">Account</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link href="/login" className={classes.button}>
                      <span className={classes.button__icon}>
                        <CircleUserRound />
                      </span>
                      <span className="text-sm">Login</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        {user && !userLoading && (
          <div className="hidden md:flex pt-2 md:pt-6 border-t border-gray-700">
            <div className="user-info">
              <Link href="/account" className="flex items-center gap-2">
                {userData?.photoURL && typeof userData.photoURL === 'string' && (() => {
                  try {
                    new URL(userData.photoURL);
                    return (
                      <Image
                        src={userData.photoURL}
                        width={30}
                        height={30}
                        className="rounded-full object-cover w-[30px] h-[30px]"
                        alt='User profile photo'
                        priority={true}
                      />
                    );
                  } catch {
                    return null;
                  }
                })()}
                {(!userData?.photoURL || typeof userData.photoURL !== 'string') && <CircleUserRound />}
                <span className="text-[var(--primary-white)]">{userData?.displayName || userData?.email}</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};