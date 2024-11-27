import Header from "@/src/components/header/Header";

const About: React.FC = () => {
  return (
    <>
      <Header />
      <main className="px-4">
        <section className="max-w-[960px]">
          <h1>About</h1>
          <p>BikeLock Finder is a community-driven tool designed to help cyclists locate safe and reliable bike lock stations around town. Whether you're commuting or exploring, our interactive map provides the information you need to secure your bike with confidence.</p>

          <p>In addition to finding stations, users can contribute to the map by adding new locations they’ve discovered, making BikeLock Finder a growing resource built by cyclists, for cyclists.</p>

          <p>Join us in creating a safer, more bike-friendly community!</p>
        </section>
      </main>
    </>
  );
}

export default About;