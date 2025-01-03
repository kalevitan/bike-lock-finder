import classes from "./sidebar.module.css";
import { MarkerProps } from "@/interfaces/markers";
import useAuth from "@/app/hooks/useAuth";

interface SidebarProps {
  openModal: (editPointData?: MarkerProps | null) => void;
  updateLocation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openModal, updateLocation }) => {
  const loggedIn = useAuth();

  return (
    <aside className={classes.sidebar}>

      <div className="sidebar-layout-wrapper flex flex-col gap-0 sm:gap-4 px-12 pb-4 sm:px-4">
        <div className="intro pt-4">
          <p>Find or add lock stations on the map to safely and conveniently lock your bike.</p>
        </div>

        <nav className={classes.actions}>
          <ul className="grid col-auto grid-flow-col justify-around">
            <li>
              <button onClick={updateLocation} className="button">Locate Me</button>
            </li>
            {loggedIn && (
              <li>
              <button onClick={() => openModal(null)} className="button">Add Lock</button>
            </li>
            )}
          </ul>
        </nav>
      </div>

    </aside>
  )
}

export default Sidebar;