export interface HeaderProps {
  onSearch: (place: google.maps.places.PlaceResult | null) => void;
  onRecenter: () => void;
}

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  classes?: string;
}

export interface SearchWrapperProps extends HeaderProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}
