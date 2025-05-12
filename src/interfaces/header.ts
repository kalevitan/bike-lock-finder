export interface HeaderProps {
  onSearch?: (query: google.maps.places.PlaceResult | null) => void;
  onRecenter?: () => void;
}

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  classes?: string;
}