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
  SquareUser,
  Lock,
  Heart,
  Target,
  ShieldCheck,
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
            <div className="flex items-center justify-center px-4 md:px-0">
              <div className="logo">
                <h1 className="leading-tight mb-0">
                  <NavLink href="/" classes={headerClasses.logo}>
                    <span className="font-display font-bold text-[3rem] text-bold pb-2 block bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] bg-clip-text text-transparent">
                      Dockly
                    </span>
                  </NavLink>
                </h1>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-8">
            <div className="hidden md:block intro">
              <div className="flex items-center justify-center gap-3">
                <p className="text-lg text-center text-[var(--primary-white)] font-light">
                  Find and share secure places
                  <br /> to lock your bike.
                </p>
              </div>
            </div>

            {!isMobile && (
              <SearchWrapper
                onSearch={onSearch}
                onRecenter={onRecenter}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
            )}

            <nav className={classes.nav}>
              <ul className="flex justify-between w-full">
                <li>
                  <Link
                    href="/about"
                    className={`${classes.button} flex flex-col items-center gap-1`}
                  >
                    <span className={classes.button__icon}>
                      <Heart />
                    </span>
                    <span className="text-xs hidden md:block">Our Mission</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={updateLocation}
                    className={`${classes.button} flex flex-col items-center gap-1`}
                  >
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
                        className={`${classes.button} flex flex-col items-center gap-1`}
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
                        <Link
                          href="/account"
                          className={`${classes.button} flex flex-col items-center gap-1`}
                        >
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
                    <Link
                      href="/login"
                      className={`${classes.button} flex flex-col items-center gap-1`}
                    >
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
          <VerifyEmail>
            <div className="pt-6">
              {/* Profile Section Header */}
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-0.5 bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] rounded-full"></div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Your Profile
                  </span>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[var(--primary-purple)] to-transparent rounded-full"></div>
                </div>
              </div>

              {/* Profile Card */}
              <Link
                href="/account"
                className="block p-6 mx-3 rounded-2xl bg-gradient-to-br from-[var(--primary-light-gray)]/15 to-[var(--steel-blue)]/10 hover:from-[var(--primary-light-gray)]/25 hover:to-[var(--steel-blue)]/15 transition-all duration-300 group shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                {/* Profile Image - Centered */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    {userData?.photoURL &&
                    typeof userData.photoURL === "string" ? (
                      <Image
                        src={userData.photoURL}
                        width={80}
                        height={80}
                        className="rounded-2xl object-cover w-[80px] h-[80px] border-3 border-[var(--steel-blue)]/40 group-hover:border-[var(--accent-mint)]/60 transition-all duration-300 shadow-lg"
                        alt="User profile photo"
                        priority={true}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-[80px] h-[80px] border-3 border-[var(--steel-blue)]/40 group-hover:border-[var(--accent-mint)]/60 rounded-2xl bg-gradient-to-br from-[var(--primary-light-gray)] to-[var(--steel-blue)]/20 transition-all duration-300 shadow-lg">
                        <SquareUser color="var(--accent-mint)" size={36} />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--accent-mint)] rounded-full border-2 border-[var(--primary-gray)] shadow-lg"></div>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-xl text-[var(--primary-white)] group-hover:text-[var(--accent-mint)] transition-colors duration-300 mb-3">
                    {userData?.displayName || "User"}
                  </h3>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 justify-center">
                    {/* Verified Badge */}
                    <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-xs font-medium">
                      <ShieldCheck size={12} />
                      <span>Verified</span>
                    </div>

                    {/* Contributions Badge */}
                    <div className="flex items-center gap-1.5 bg-[var(--primary-gold)]/20 text-[var(--primary-gold)] px-2.5 py-1 rounded-full text-xs font-medium">
                      <Trophy size={12} />
                      <span>{userData?.contributions || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </VerifyEmail>
        )}
      </div>
    </aside>
  );
}
