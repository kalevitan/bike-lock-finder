import classes from "./sidebar.module.css";
import { MarkerProps } from "@/src/interfaces/markers";

interface SidebarProps {
  openModal: (editPointData?: MarkerProps | null) => void;
  updateLocation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openModal, updateLocation }) => {
  return (
    <aside className={classes.sidebar}>

      <div className="sidebar-layout-wrapper flex flex-col gap-4 px-4">
        <div className="intro pt-4">
          <p>Find or add lock stations on the map to safely and conveniently lock your bike.</p>
        </div>

        <nav className={classes.actions}>
          <ul className="grid col-auto grid-flow-col justify-around">
            <li>
              <button onClick={updateLocation} className="button">Locate Me</button>
            </li>
            {/* <li>
              <button onClick={() => openModal(null)} className="button">Add Point</button>
            </li> */}
          </ul>
        </nav>
      </div>

    </aside>
  )
}

export default Sidebar;