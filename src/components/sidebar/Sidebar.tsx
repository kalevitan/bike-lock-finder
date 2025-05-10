import classes from "./sidebar.module.css";
import { MarkerProps } from "@/interfaces/markers";
import useAuth from "@/app/hooks/useAuth";
import { CircleUserRound, LocateFixed, MapPinPlusInside, Info } from "lucide-react";
import Link from "next/link";
interface SidebarProps {
  openModal: (editPointData?: MarkerProps | null) => void;
  updateLocation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openModal, updateLocation }) => {
  const loggedIn = useAuth();

  return (
    <aside className={classes.sidebar}>

      <div className="sidebar-layout-wrapper flex flex-col sm:px-4 justify-between h-full">
        <div className="flex flex-col gap-0 sm:gap-4">
          <div className="hidden md:block intro pt-4">
            <p>Find or add lock stations on the map to safely and conveniently lock your bike.</p>
          </div>

          <nav className={classes.actions}>
            <ul className="grid col-auto grid-flow-col justify-evenly">
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
                    <button onClick={() => openModal(null)} className="button button--icon">
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
  )
}

export default Sidebar;