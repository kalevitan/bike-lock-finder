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
    <div className="about-page bg-[var(--primary-white)] min-h-screen">
      {/* --- Hero/Mission Section --- */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block py-2 bg-[var(--accent-mint)]/10 text-[var(--primary-purple)] rounded-full text-sm font-semibold">
                  Community-Driven
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--primary-gray)] leading-tight">
                  Our Mission
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] rounded-full"></div>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-[var(--primary-gray)] font-light leading-relaxed">
                  Dockly is a community-driven tool designed to help cyclists
                  locate safe and reliable bike lock stations around town.
                </p>
                <p className="text-lg text-[var(--primary-gray)] leading-relaxed">
                  Whether you're commuting or exploring, our interactive map
                  provides the information you need to secure your bike with
                  confidence. Built by cyclists, for cyclists.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="button button--accent flex items-center gap-2"
                >
                  <UserRound size={16} />
                  Get Started
                </Link>
                <Link
                  href="/"
                  className="button button--outline flex items-center gap-2"
                >
                  View Map
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96 md:h-[500px]">
                <Image
                  src="/images/bike-lock-about.jpg"
                  alt="A black and white photo of a bike rack"
                  fill
                  className="rounded-2xl shadow-2xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-mint)]/20 to-[var(--primary-purple)]/20 rounded-2xl"></div>
              </div>
              {/* Floating accent elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--accent-mint)] rounded-2xl opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[var(--primary-gold)] rounded-xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary-gray)] to-[var(--deep-purple)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--primary-white)]">
              How It Works
            </h2>
            <p className="text-xl text-[var(--primary-white)] max-w-2xl mx-auto">
              Three simple steps to find and share secure bike parking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-[var(--primary-white)] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-mint)] to-[var(--primary-purple)] rounded-2xl flex items-center justify-center mb-6">
                  <Search size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary-gray)] mb-4">
                  Find a Spot
                </h3>
                <p className="text-[var(--primary-gray)] leading-relaxed">
                  Use our interactive map to discover safe, user-verified bike
                  lock locations near you.
                </p>
                <div className="mt-6 text-[var(--primary-purple)] font-semibold">
                  Step 1 →
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-[var(--primary-white)] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-purple)] to-[var(--deep-purple)] rounded-2xl flex items-center justify-center mb-6">
                  <MapPinPlusInside size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary-gray)] mb-4">
                  Add a New Lock
                </h3>
                <p className="text-[var(--primary-gray)] leading-relaxed">
                  Found a great spot that's not on the map? Add it in seconds to
                  help fellow cyclists.
                </p>
                <div className="mt-6 text-[var(--primary-purple)] font-semibold">
                  Step 2 →
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-[var(--primary-white)] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-gold)] to-[var(--accent-mint)] rounded-2xl flex items-center justify-center mb-6">
                  <Users size={32} className="text-[var(--primary-gray)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary-gray)] mb-4">
                  Grow the Community
                </h3>
                <p className="text-[var(--primary-gray)] leading-relaxed">
                  Every contribution makes our community stronger and our
                  streets safer for everyone.
                </p>
                <div className="mt-6 text-[var(--primary-purple)] font-semibold">
                  Step 3 ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="bg-gradient-to-br from-[var(--primary-gray)] to-[var(--deep-purple)] p-12 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-mint)]/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--primary-gold)]/20 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Building a Better Ride
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join the movement to make biking safer, smarter, and more
                accessible for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="button button--accent flex items-center gap-2 justify-center"
                >
                  <UserRound size={16} />
                  Join the Community
                </Link>
                <Link
                  href="https://github.com/kalevitan/bike-lock-finder/issues"
                  rel="noopener noreferrer"
                  className="button button--outline flex items-center gap-2 justify-center"
                  target="_blank"
                >
                  <MessageCircleWarning size={16} />
                  Suggest a Feature
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
