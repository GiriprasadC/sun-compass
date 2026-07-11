export type NavLink = { label: string; path: "/" | "/services" | "/contact" };

export const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Contact Us", path: "/contact" },
];
