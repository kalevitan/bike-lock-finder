import classes from "./sidebar.module.css";

interface SidebarProps {
  openModal: () => void;
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
          <ul className="grid grid-cols-2">
            <li>
              <button onClick={updateLocation} className="button">Locate Me</button>
            </li>
            <li>
              <button onClick={openModal} className="button">Add Point</button>
            </li>
          </ul>
        </nav>
      </div>

    </aside>
  )
}

export default Sidebar;