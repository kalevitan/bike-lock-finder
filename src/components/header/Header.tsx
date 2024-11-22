import "./header.css";
import NavLink from "./nav-link";

const Header = () => {
  return (
    <header className="flex justify-between py-4 w-full p-4 text-white bg-[#242424]">

      <div className="logo flex items-center">
        <h1><span className="font-bold text-lg m-0">
          <NavLink href="/">BikeLock Finder</NavLink></span>
        </h1>
      </div>

      <nav>
        <ul className="flex">
          <li>
            <NavLink href="/about">About</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
