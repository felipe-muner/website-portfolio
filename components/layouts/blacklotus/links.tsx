"use client";

import { chooseArtist, chooseFlash, tryOnArm } from "./events";

interface LinkProps {
  className?: string;
  children: React.ReactNode;
}

/** A link up to the forearm that also puts `designId` on it. */
export function TryOnLink({ designId, className, children }: LinkProps & { designId: string }) {
  return (
    <a href="#arm" onClick={() => tryOnArm(designId)} className={className}>
      {children}
    </a>
  );
}

/** A link to the booking form that preselects `designId` as the flash. */
export function BookFlashLink({ designId, className, children }: LinkProps & { designId: string }) {
  return (
    <a href="#book" onClick={() => chooseFlash(designId)} className={className}>
      {children}
    </a>
  );
}

/** A link to the booking form that preselects an artist. */
export function BookArtistLink({ artist, className, children }: LinkProps & { artist: string }) {
  return (
    <a href="#book" onClick={() => chooseArtist(artist)} className={className}>
      {children}
    </a>
  );
}
