'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Props {
  onSearch?: (place: google.maps.places.PlaceResult | null) => void;
  classes?: string;
}

export const SearchForm = ({ onSearch, classes }: Props) => {
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

  return (
    <div className={`autocomplete-container ${classes}`}>
      <input ref={inputRef} name="search" className="w-full rounded-[4px] h-[45px]" placeholder='Search locations...'/>
    </div>
  );
};

export default SearchForm;