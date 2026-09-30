import type { ComponentType, CSSProperties } from "react";

export type AwesomeComponentHeight = number | string;
export type AwesomeTimeValue = Date | string | number;

export interface AwesomeBaseProps {
  height?: AwesomeComponentHeight;
  className?: string;
  style?: CSSProperties;
}

export interface AwesomePausableProps extends AwesomeBaseProps {
  /** Freezes the animation. Effects also pause on their own while off-screen. */
  paused?: boolean;
}

export interface FireworksProps extends AwesomeBaseProps {
  particles?: number;
  autoLaunch?: boolean;
  interactive?: boolean;
  burstSize?: number;
  speed?: number;
  paused?: boolean;
}

export interface SlideClockProps extends AwesomeBaseProps {
  use24HourClock?: boolean;
  showSeconds?: boolean;
  value?: AwesomeTimeValue;
}

export interface RandomWordsProps extends AwesomeBaseProps {
  words?: string[];
  duration?: number;
  suffix?: string;
  paused?: boolean;
}

export interface RacingLinesProps extends AwesomePausableProps {
  rows?: number;
  cols?: number;
}

export interface CampfireProps extends AwesomeBaseProps {
  intensity?: number;
  sparks?: boolean;
  logs?: boolean;
  paused?: boolean;
}

export interface DigitalClock3DProps extends AwesomeBaseProps {
  use24HourClock?: boolean;
  showSeconds?: boolean;
  value?: AwesomeTimeValue;
  interactive?: boolean;
  showNetwork?: boolean;
}

export type LinesBeLiningProps = AwesomePausableProps;
export type ParticleAttractionProps = AwesomePausableProps;
export type RainbowSimpleMotionParticlesProps = AwesomePausableProps;
export type RainbowTransferProps = AwesomePausableProps;
export type RainbowLinesOfStraightnessProps = AwesomePausableProps;
export type RainbowGridProps = AwesomePausableProps;
export type GravityParticlesProps = AwesomePausableProps;
export type RainbowShinyCometsProps = AwesomePausableProps;
export type StarfieldProps = AwesomePausableProps;
export type ColorRainLinesProps = AwesomePausableProps;
export interface RainScreenProps extends AwesomeBaseProps {
  density?: number;
  speed?: number;
  interactive?: boolean;
  showCity?: boolean;
  paused?: boolean;
}

export interface ChillLionProps extends AwesomePausableProps {
  showInstructions?: boolean;
}

export const ColorRainLines: ComponentType<ColorRainLinesProps>;
export const Fireworks: ComponentType<FireworksProps>;
export const GravityParticles: ComponentType<GravityParticlesProps>;
export const LinesBeLining: ComponentType<LinesBeLiningProps>;
export const ParticleAttraction: ComponentType<ParticleAttractionProps>;
export const RainScreen: ComponentType<RainScreenProps>;
export const RainbowGrid: ComponentType<RainbowGridProps>;
export const RainbowLinesOfStraightness: ComponentType<RainbowLinesOfStraightnessProps>;
export const RainbowShinyComets: ComponentType<RainbowShinyCometsProps>;
export const RainbowSimpleMotionParticles: ComponentType<RainbowSimpleMotionParticlesProps>;
export const RainbowTransfer: ComponentType<RainbowTransferProps>;
export const Starfield: ComponentType<StarfieldProps>;
export const Campfire: ComponentType<CampfireProps>;
export const DigitalClock3D: ComponentType<DigitalClock3DProps>;
export const SlideClock: ComponentType<SlideClockProps>;
export const RandomWords: ComponentType<RandomWordsProps>;
export const ChillLion: ComponentType<ChillLionProps>;
export const RacingLines: ComponentType<RacingLinesProps>;

export const HavaiFisek: ComponentType<FireworksProps>;
export const KampAtesi: ComponentType<CampfireProps>;
export const KapsamliDonerSaat: ComponentType<SlideClockProps>;
export const DigitalSaat3D: ComponentType<DigitalClock3DProps>;
export const YercekimliParcaciklar: ComponentType<GravityParticlesProps>;
export const RenkliAkanCizgiler: ComponentType<ColorRainLinesProps>;
export const YagmurEkrani: ComponentType<RainScreenProps>;
export const SidenumChoserRainbowGrid: ComponentType<RainbowGridProps>;
export const ChillTheLion: ComponentType<ChillLionProps>;

export const COMPONENT_ROOT_CLASS: string;
export const componentStyles: string;
export function ensureComponentStyles(): void;

export interface ShowcaseItem {
  slug: string;
  title: string;
  original: string;
  exportName: string;
  type: string;
  description?: string;
  hint?: string;
  Component: ComponentType<any>;
}

export const showcaseItems: ShowcaseItem[];
