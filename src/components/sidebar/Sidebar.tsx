import { Link } from "react-router-dom";
import "./sidebar.css";

interface SidebarProps {
  updateLocation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ updateLocation }) => {
  return (
    <aside className="sidebar">

      <div className="sidebar-layout-wrapper flex flex-col gap-4 px-4">
        <div className="intro pt-4">
          <p>Find or add lock stations on the map to safely and conveniently lock your bike.</p>
        </div>

        <nav className="actions">
          <ul className="grid grid-cols-2">
            <li>
            <button onClick={updateLocation} className="button">Locate Me</button>
            </li>
            <li>
              <Link to="/add-point" className="button">Add Point</Link>
            </li>
          </ul>
        </nav>
      </div>

    </aside>
  )
}

export default Sidebar;