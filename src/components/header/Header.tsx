import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <header className="flex justify-end py-4 w-full p-4 text-white bg-[#242424]">
      <nav>
        <ul className="flex">
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
