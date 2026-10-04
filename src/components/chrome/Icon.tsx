import type { IconProps } from "@phosphor-icons/react";
import {
  AirplaneTilt,
  Archive,
  ArrowUp,
  Article,
  BookOpen,
  Camera,
  CaretDown,
  CaretRight,
  ChartLineUp,
  ChatsCircle,
  CircleHalf,
  ClockCounterClockwise,
  Coffee,
  CodeSimple,
  Compass,
  FilmStrip,
  FolderSimple,
  GameController,
  GithubLogo,
  Heart,
  House,
  InstagramLogo,
  List,
  MagnifyingGlass,
  MapPin,
  MapTrifold,
  Moon,
  MusicNote,
  MusicNotes,
  Palette,
  PlayCircle,
  RssSimple,
  Sparkle,
  Sun,
  Television,
  UserCircle,
  XLogo,
} from "@phosphor-icons/react";

export type IconName =
  | "home"
  | "archive"
  | "map"
  | "bangumi"
  | "explore"
  | "about"
  | "stats"
  | "travel"
  | "dev"
  | "collection"
  | "studios"
  | "search"
  | "palette"
  | "menu"
  | "chevron-right"
  | "chevron-down"
  | "arrow-up"
  | "sun"
  | "moon"
  | "auto"
  | "rss"
  | "sitemap"
  | "github"
  | "x"
  | "instagram"
  | "qq"
  | "bilibili"
  | "note"
  | "sparkle"
  | "heart"
  | "camera"
  | "coffee"
  | "game"
  | "music"
  | "chat";

const registry: Record<IconName, React.ComponentType<IconProps>> = {
  home: House,
  archive: ClockCounterClockwise,
  map: MapTrifold,
  bangumi: Television,
  explore: Compass,
  about: UserCircle,
  stats: ChartLineUp,
  travel: AirplaneTilt,
  dev: CodeSimple,
  collection: Archive,
  studios: FilmStrip,
  search: MagnifyingGlass,
  palette: Palette,
  menu: List,
  "chevron-right": CaretRight,
  "chevron-down": CaretDown,
  "arrow-up": ArrowUp,
  sun: Sun,
  moon: Moon,
  auto: CircleHalf,
  rss: RssSimple,
  sitemap: MapPin,
  github: GithubLogo,
  x: XLogo,
  instagram: InstagramLogo,
  qq: ChatsCircle,
  bilibili: PlayCircle,
  note: MusicNote,
  sparkle: Sparkle,
  heart: Heart,
  chat: BookOpen,
  camera: Camera,
  coffee: Coffee,
  game: GameController,
  music: MusicNotes,
};

type Props = IconProps & { name: IconName };

export function Icon({ name, weight = "bold", ...rest }: Props) {
  const Component = registry[name] ?? FolderSimple;
  return <Component weight={weight} {...rest} />;
}

export { Article };
