import NavLink from "./nav-link";
import { BikeIcon } from "@/assets/icons/bike-icon";
import classes from "./header.module.css";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between py-4 w-full p-4 text-white bg-[#242424]">

      <div className="logo flex items-center">
        <h1><span className="font-bold text-lg m-0">
          <NavLink href="/"><span className="flex items-center gap-1"><BikeIcon />BikeLock Finder</span></NavLink></span>
        </h1>
      </div>

      <nav className={classes.nav}>
        <ul className="flex">
          <li>
            <NavLink href="/about">About</NavLink>
          </li>
          <li>
            <NavLink href="/login">Login</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
