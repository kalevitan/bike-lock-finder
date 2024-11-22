import { Outlet } from "react-router-dom";

const About: React.FC = () => {
  return (
    <>
      <Outlet />
      <main className="px-4">
        <h1>About</h1>
        <p>This is the about page</p>
      </main>
    </>
  );
}

export default About;