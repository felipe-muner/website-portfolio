// Yoga 6 · Stillwater — what the breath section tells the 3D singing bowl,
// kept apart from the (lazily loaded) scene so the page can share it cheaply.

export interface BowlSignal {
  /** Bumped on every strike. */
  strikes: number;
  /** The stick is going round the rim. */
  singing: boolean;
}

/** The mallet takes this long to reach the rim; the sound waits for it. */
export const SWING = 0.09;
