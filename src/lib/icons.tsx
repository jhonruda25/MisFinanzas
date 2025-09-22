import { Utensils, Briefcase, Bus, Film, HeartPulse, Tag, type LucideProps } from 'lucide-react';

const iconMap = {
  restaurant_icon: Utensils,
  work_icon: Briefcase,
  directions_bus_icon: Bus,
  entertainment_icon: Film,
  health_icon: HeartPulse,
};

type CategoryIconProps = LucideProps & {
  name: string;
};

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const IconComponent = iconMap[name as keyof typeof iconMap] || Tag;
  return <IconComponent {...props} />;
}
