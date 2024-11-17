import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="logo flex items-center px-4 h-14">
        <h1><span className="font-bold text-lg m-0">BikeLock</span></h1>
      </div>

      <div className="sidebar-layout-wrapper flex flex-col gap-4 px-4">
        <div className="intro">
          <p>Find or add points on the map to lock your bike.</p>
        </div>

        <nav className="actions">
          <ul className="grid grid-cols-2">
            <li>
              <button className="button">Locate Me</button>
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