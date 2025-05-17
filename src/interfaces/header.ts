export interface HeaderProps {
  onSearch?: (query: google.maps.places.PlaceResult | null) => void;
  onRecenter?: () => void;
  searchInput?: string;
  setSearchInput?: (input: string) => void;
}

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  classes?: string;
}