"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinkProps } from "@/interfaces/header";

export function NavLink({ href, children, classes }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === href : pathname?.startsWith(href);
  return (
    <Link
      href={href}
      className={`${classes} nav-link${isActive ? " active" : ""}`}
    >
      {children}
    </Link>
  );
}
