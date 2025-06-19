import Link from "next/link";
import Image from "next/image";
import {
  MessageCircleWarning,
  UserRound,
  Search,
  MapPinPlusInside,
  Users,
} from "lucide-react";

export default function About() {
  return (
    <div className="about-page space-y-16 md:space-y-24 md:px-12">
      {/* --- Mission Section --- */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Our Mission
          </h1>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            Dockly is a community-driven tool designed to help cyclists locate
            safe and reliable bike lock stations around town. Whether you're
            commuting or exploring, our interactive map provides the information
            you need to secure your bike with confidence.
          </p>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            In addition to finding stations, users can contribute to the map by
            adding new locations they've discovered, making Dockly a growing
            resource built by cyclists, for cyclists.
          </p>
        </div>
        <div className="relative w-full h-80 md:h-96">
          <Image
            src="/images/bike-lock-about.jpg"
            alt="A black and white photo of a bike rack"
            fill
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="space-y-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 pt-4">
          <div className="flex flex-col items-center gap-3 p-8 rounded-lg bg-[var(--primary-purple)] hover:scale-105 transition-all duration-300">
            <Search size={40} className="text-[var(--primary-white)]" />
            <h3 className="text-xl font-semibold mt-2">1. Find a Spot</h3>
            <p>
              Use our interactive map to find safe, user-verified bike lock
              locations near you.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 p-8 rounded-lg bg-[var(--primary-purple)] hover:scale-105 transition-all duration-300">
            <MapPinPlusInside
              size={40}
              className="text-[var(--primary-white)]"
            />
            <h3 className="text-xl font-semibold mt-2">2. Add a New Lock</h3>
            <p>
              Found a great spot that's not on the map? Add it in seconds to
              help fellow cyclists.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 p-8 rounded-lg bg-[var(--primary-purple)] hover:scale-105 transition-all duration-300">
            <Users size={40} className="text-[var(--primary-white)]" />
            <h3 className="text-xl font-semibold mt-2">
              3. Grow the Community
            </h3>
            <p>
              Every contribution makes our community stronger and our streets
              safer for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="text-center bg-[var(--primary-light-gray)] p-8 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Building a Better Ride
        </h2>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-6">
          Join the movement to make biking safer, smarter, and more accessible.
        </p>
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="button text-white justify-center flex items-center gap-2"
          >
            <UserRound size={15} />
            <span>Join the Community</span>
          </Link>
          <Link
            href="https://github.com/kalevitan/bike-lock-finder/issues"
            rel="noopener noreferrer"
            className="button button--outline flex items-center gap-2 text-white justify-center"
            target="_blank"
          >
            <MessageCircleWarning size={15} />
            <span>Suggest a Feature</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
