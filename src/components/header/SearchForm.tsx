'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Props {
  onSearch?: (place: google.maps.places.PlaceResult | null) => void;
}

// This is an example of the classic "Place Autocomplete" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
export const SearchForm = ({ onSearch }: Props) => {
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
    <div className="autocomplete-container">
      <input ref={inputRef} className="w-[300px] rounded-lg h-[45px]" placeholder='Search locations...'/>
    </div>
  );
};

export default SearchForm;