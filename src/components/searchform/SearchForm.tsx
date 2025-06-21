"use client";

import React, { useRef, useEffect, useState, memo } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Search, X } from "lucide-react";

interface Props {
  onSearch?: (place: google.maps.places.PlaceResult | null) => void;
  onRecenter?: () => void;
  classes?: string;
  shouldFocus?: boolean;
  searchInput?: string;
  setSearchInput?: (input: string) => void;
}

const SearchForm = memo(function SearchForm({
  onSearch,
  onRecenter,
  searchInput,
  setSearchInput,
  classes,
  shouldFocus,
}: Props) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  useEffect(() => {
    if (placesLibrary) {
      setIsLibraryLoaded(true);
    }
  }, [placesLibrary]);

  useEffect(() => {
    if (!isLibraryLoaded || !placesLibrary || !inputRef.current) {
      return;
    }

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(35.4, -82.7),
      new google.maps.LatLng(35.7, -82.4)
    );

    const options = {
      fields: ["geometry", "name", "formatted_address"],
      bounds,
      strictBounds: true,
      types: ["establishment"],
    };

    try {
      const autocomplete = new placesLibrary.Autocomplete(
        inputRef.current,
        options
      );
      setPlaceAutocomplete(autocomplete);
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  }, [placesLibrary, isLibraryLoaded]);

  useEffect(() => {
    if (!placeAutocomplete) {
      return;
    }

    const listener = placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      if (place && place.geometry) {
        onSearch?.(place);
      }
    });

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [onSearch, placeAutocomplete]);

  useEffect(() => {
    if (searchInput === "" && placeAutocomplete) {
      placeAutocomplete.set("place", null);
    }
  }, [searchInput, placeAutocomplete]);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchInput?.("");
    if (placeAutocomplete) {
      placeAutocomplete.set("place", null);
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(35.4, -82.7),
        new google.maps.LatLng(35.7, -82.4)
      );
      placeAutocomplete.setBounds(bounds);
    }
  };

  return (
    <div
      className={`autocomplete-container relative ${classes}`}
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        name="search"
        value={searchInput}
        onChange={(e) => setSearchInput?.(e.target.value)}
        className="w-full rounded-xl h-[44px] px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-[var(--primary-gray)] placeholder:text-[var(--primary-gray)]/60"
        placeholder="Search locations..."
      />
      {searchInput ? (
        <X
          className="absolute right-[.625rem] top-[.625rem] cursor-pointer text-[var(--primary-gray)] md:text-[var(--primary-white)]"
          onClick={clearSearch}
        />
      ) : (
        <Search className="w-6 h-6 absolute right-2 top-1/2 -translate-y-1/2 text-[var(--primary-gray)] md:text-[var(--primary-white)]" />
      )}
    </div>
  );
});

export default SearchForm;
