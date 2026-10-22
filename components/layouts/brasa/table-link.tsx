"use client";

import { chooseTable } from "./events";

/** A link to the booking form that also picks `table` on the way. */
export function TableLink({
  table,
  className,
  children,
}: {
  table: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href="#book" onClick={() => chooseTable(table)} className={className}>
      {children}
    </a>
  );
}
