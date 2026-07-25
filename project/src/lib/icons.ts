import {
  BrickWall,
  Hammer,
  Flame,
  Grid3x3,
  Zap,
  Droplets,
  PaintRoller,
  Wrench,
  Package,
  Layers,
  Construction,
  HardHat,
  Drill,
  Shovel,
  Pickaxe,
  type LucideIcon,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  BrickWall,
  Hammer,
  Flame,
  Grid3x3,
  Zap,
  Droplets,
  PaintRoller,
  Wrench,
  Package,
  Layers,
  Construction,
  HardHat,
  Drill,
  Shovel,
  Pickaxe,
};

export function iconFor(name: string | null | undefined): LucideIcon {
  if (name && map[name]) return map[name];
  return Package;
}

export const iconOptions = Object.keys(map);
