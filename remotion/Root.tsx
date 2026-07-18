import React from "react";
import { Composition } from "remotion";
import { Showreel, SHOWREEL_DURATION } from "./Showreel";
import { RailClip, RAIL_DURATION, RAIL_FPS } from "./RailClip";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showreel"
        component={Showreel}
        durationInFrames={SHOWREEL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ShowreelVertical"
        component={Showreel}
        durationInFrames={SHOWREEL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RailClip"
        component={RailClip}
        durationInFrames={RAIL_DURATION}
        fps={RAIL_FPS}
        width={1200}
        height={790}
        defaultProps={{
          slug: "gym-v1",
          srcWidth: 1440,
          srcHeight: 5200,
          label: "Forge",
        }}
      />
    </>
  );
};
