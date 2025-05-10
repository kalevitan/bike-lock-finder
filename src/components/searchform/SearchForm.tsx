'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Props {
  onSearch?: (place: google.maps.places.PlaceResult | null) => void;
  classes?: string;
  shouldFocus?: boolean;
}

export const SearchForm = ({ onSearch, classes, shouldFocus }: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };

    setPlaceAutocomplete(new placesLibrary.Autocomplete(inputRef.current, options));
  }, [placesLibrary]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onSearch?.(placeAutocomplete.getPlace());
    });
  }, [onSearch, placeAutocomplete]);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`autocomplete-container ${classes}`}
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        name="search"
        className="w-full rounded-[4px] h-[45px] focus:outline-none"
        placeholder='Search locations...'
      />
    </div>
  );
};

export default SearchForm;