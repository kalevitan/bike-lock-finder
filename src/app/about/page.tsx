import Link from "next/link";
import Header from "@/components/header/Header";
import Image from "next/image";
import { MessageCircleWarning, UserRound } from "lucide-react";
const About: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header />
      <main className="grid md:grid-cols-2 items-stretch gap-8 px-6 pt-[80px] md:py-16 h-[calc(100vh-6rem)] overflow-y-auto">
        <section className="space-y-6 md:px-12">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">Our Mission</h2>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            BikeLock Finder is a community-driven tool designed to help cyclists locate safe and reliable bike lock stations around town.
            Whether you're commuting or exploring, our interactive map provides the information you need to secure your bike with confidence.
          </p>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            In addition to finding stations, users can contribute to the map by adding new locations they've discovered, making BikeLock Finder a growing resource built by cyclists, for cyclists.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <Link href="/login" className="button text-white justify-center flex items-center gap-1">
              <UserRound size={15}/>
              <span>Join the Community</span>
            </Link>
            <Link href="https://github.com/kalevitan/bike-lock-finder/issues" rel="noopener noreferrer" className="button button--secondary flex items-center gap-1 text-white justify-center" target="_blank">
              <MessageCircleWarning size={15}/>
              <span>Suggest a Feature</span>
            </Link>
          </div>
        </section>

        <div className="relative w-full h-[500px] md:h-auto">
          <div className="absolute inset-0 bg-black opacity-30 rounded-[0.25rem] z-10" />
          <Image src="/images/bike-lock-about.jpg" alt="About" fill className="rounded-[0.25rem] shadow-lg object-cover absolute inset-0 z-0" />
        </div>
      </main>

      <footer className="text-center py-6 text-neutral-500 text-sm">
          © {currentYear} BikeLock Finder. All rights reserved.
      </footer>
    </>
  );
}

export default About;