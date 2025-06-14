import { useState } from "react";
import classes from "./sidebar.module.css";
import headerClasses from "../header/header.module.css";
import { MarkerProps } from "@/interfaces/markers";
import { useAuth } from "@/contexts/AuthProvider";
import {
  CircleUserRound,
  LocateFixed,
  MapPinPlusInside,
  Info,
  Trophy,
  MessageCircleWarning,
  Lock,
  SquareUser,
  UserRound,
} from "lucide-react";
import BikeLockIcon from "@/components/icons/bike-lock-icon";
import Link from "next/link";
import { useModal } from "@/contexts/ModalProvider";
import AddLock from "@/components/addlock/AddLock";
import { NavLink } from "../header/NavLink";
import SearchWrapper from "../searchform/SearchWrapper";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useUserDocument } from "@/lib/users";
import Image from "next/image";
import VerifyEmail from "../boundaries/VerifyEmail";
import { useRouter } from "next/navigation";

interface SidebarProps {
  updateLocation: () => void;
  onAddLock?: (pointData?: MarkerProps | null) => void;
  onSearch?: (place: google.maps.places.PlaceResult | null) => void;
  onRecenter?: () => void;
}

export default function Sidebar({
  updateLocation,
  onAddLock,
  onSearch,
  onRecenter,
}: SidebarProps) {
  const { user, isLoading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const { openModal } = useModal();
  const [searchInput, setSearchInput] = useState("");
  const { userData, isLoading: userLoading } = useUserDocument(
    user?.uid || null
  );
  const router = useRouter();
  const handleAddLock = () => {
    if (!user?.emailVerified) {
      router.push("/verify-email");
      return;
    }
    openModal(<AddLock formMode="add" />, "Add Lock");
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return null;
  }

  return (
    <aside className={classes.sidebar}>
      <div className="sidebar-layout-wrapper flex flex-col gap-8 justify-between md:px-8 h-full">
        <div className="flex flex-col gap-6">
          {!isMobile && (
            <div className="flex items-center justify-between px-4 md:px-0">
              <div className="logo md:min-w-72 max-w-72 min-w-fit">
                <h1 className="">
                  <span className="m-0">
                    <NavLink href="/" classes={headerClasses.logo}>
                      {/* <BikeLockIcon /> */}
                      <span className="font-display font-bold text-[3rem]">Dockly</span>
                    </NavLink>
                  </span>
                </h1>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">

            <div className="hidden md:block intro">
              <p className="italic">Find and share safe locking spots in your city.</p>
            </div>

            {!isMobile && onSearch && onRecenter && (
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
                      <button
                        onClick={handleAddLock}
                        className={classes.button}
                      >
                        <span className={classes.button__icon}>
                          <MapPinPlusInside />
                        </span>
                        <span className="text-xs hidden md:block">
                          Add Lock
                        </span>
                      </button>
                    </li>

                    {isMobile && (
                      <li>
                        <Link href="/account" className={classes.button}>
                          <span className={classes.button__icon}>
                            <CircleUserRound />
                          </span>
                          <span className="text-xs hidden md:block">
                            Account
                          </span>
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

        <VerifyEmail>
          {user && !userLoading && !isMobile && (
            <div className="flex gap-y-4 pt-2 md:pt-8 border-t border-[var(--primary-light-gray)]">
              <div className="user-info w-full flex flex-col gap-4">
                <Link href="/account" className="flex items-center gap-4">
                  {userData?.photoURL &&
                  typeof userData.photoURL === "string" ? (
                    <Image
                      src={userData.photoURL}
                      width={50}
                      height={50}
                      className="rounded-full object-cover w-[50px] h-[50px]"
                      alt="User profile photo"
                      priority={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-[50px] h-[50px] border border-[#6b7280] rounded-full">
                      <SquareUser color="#6b7280" size={20} />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg text-[var(--primary-white)]">
                        {userData?.displayName || userData?.email}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-[var(--primary-white)] font-light bg-[var(--primary-light-gray)] px-2 py-1 rounded-md">
                        <Trophy size={12} color={"var(--primary-gold)"} />
                        {25} contributions
                      </span>
                    </div>
                  </div>
                </Link>
                {/* <div className="grid grid-cols-2 items-center gap-2">
                  <span className="text-sm text-[var(--primary-white)] font-light bg-[var(--primary-light-gray)] px-2 py-2 rounded-md flex items-center justify-center gap-2">
                    <Lock size={15} />
                    My Locks
                  </span>
                  <span className="text-sm text-[var(--primary-white)] font-light bg-[var(--primary-light-gray)] px-2 py-2 rounded-md flex items-center justify-center gap-2">
                    <MessageCircleWarning size={15} />
                    Report Issue
                  </span>
                </div> */}
              </div>
            </div>
          )}
        </VerifyEmail>
      </div>
    </aside>
  );
}
