import { useState } from "react";
import classes from "./sidebar.module.css";
import { MarkerProps } from "@/interfaces/markers";
import useAuth from "@/app/hooks/useAuth";
import { CircleUserRound, LocateFixed, MapPinPlusInside, Info, ArrowUp, ChevronUp, ChevronsUp, Minus } from "lucide-react";
import BikeLockIcon from '@/components/icons/bike-lock-icon';
import Link from "next/link";
import { useModal } from "@/contexts/ModalProvider";
import AddLock from "@/components/addlock/AddLock";
import { NavLink } from "../header/NavLink";
import SearchWrapper from "../searchform/SearchWrapper";
import { useIsMobile } from "@/app/hooks/useIsMobile";
interface SidebarProps {
  updateLocation: () => void;
  onAddLock?: (pointData?: MarkerProps | null) => void;
  onSearch?: (place: google.maps.places.PlaceResult | null) => void;
  onRecenter?: () => void;
}

export default function Sidebar({ updateLocation, onAddLock, onSearch, onRecenter }: SidebarProps) {
  const loggedIn = useAuth();
  const isMobile = useIsMobile();
  const { openModal } = useModal();
  const [searchInput, setSearchInput] = useState('');
  const handleAddLock = () => {
    openModal(<AddLock formMode="add" />, 'Add Lock');
  };

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
                <li className="flex flex-col items-center gap-1">
                  <Link href="/about" className="button button--icon">
                    <Info />
                  </Link>
                  <span className="text-sm">About</span>
                </li>
                <li className="flex flex-col items-center gap-1">
                  <button onClick={updateLocation} className="button button--icon">
                    <LocateFixed />
                  </button>
                  <span className="text-sm">Locate Me</span>
                </li>
                {loggedIn ? (
                  <>
                    <li className="flex flex-col items-center gap-1">
                      <button onClick={handleAddLock} className="button button--icon">
                        <MapPinPlusInside />
                      </button>
                      <span className="text-sm">Add Lock</span>
                    </li>
                    <li className="flex md:hidden flex-col items-center gap-1">
                      <Link href="/account" className="button button--icon">
                        <CircleUserRound />
                      </Link>
                      <span className="text-sm">Account</span>
                    </li>
                  </>
                ) : (
                  <li className="flex flex-col items-center gap-1">
                    <Link href="/login" className="button button--icon">
                      <CircleUserRound />
                    </Link>
                    <span className="text-sm">Login</span>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        {loggedIn && (
          <div className="hidden md:flex gap-3 py-2 md:py-6 border-t border-gray-700">
            <div className="user-info flex gap-3">
              <Link href="/account" className="flex gap-2">
                <CircleUserRound />
                <span>{loggedIn?.email}</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};