import { Outlet } from "react-router-dom";
import Header from "@components/header/Header";
// import Sidebar from "../components/sidebar/Sidebar";

const RootLayout = () => {
  return (
    <>
      {/* <Sidebar /> */}
      <div className="layout-container">
        <Header />
        <Outlet />
      </div>
    </>
  )
}

export default RootLayout;