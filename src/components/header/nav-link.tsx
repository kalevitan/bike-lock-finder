'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({ href, children }: NavLinkProps) => {
  console.log('NavLink', { href, children });
  const path = usePathname();
  return (
    <Link href={href} className={path.startsWith(href) ? "active" : undefined}>
      {children}
    </Link>
  );
}

export default NavLink;