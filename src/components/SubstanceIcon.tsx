import { Wine, Cigarette, Pill, Leaf, Zap, Tablets, Sprout, Heart, LucideProps } from 'lucide-react';
import { FC } from 'react';

const iconMap: Record<string, FC<LucideProps>> = {
  alcohol: Wine,
  tobacco: Cigarette,
  opioids: Pill,
  cannabis: Leaf,
  stimulants: Zap,
  benzodiazepines: Tablets,
  kratom: Sprout,
  mdma: Heart,
};

interface Props extends LucideProps {
  slug: string;
}

const SubstanceIcon = ({ slug, ...props }: Props) => {
  const Icon = iconMap[slug] || Leaf;
  return <Icon {...props} />;
};

export default SubstanceIcon;
