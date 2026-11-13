import React from 'react';
import {
  Calculator,
  Target,
  TrendingUp,
  Layers,
  CheckSquare,
  Compass,
  Milestone,
  Award,
  BookOpen,
  Scale,
  GraduationCap,
  CheckCircle2,
  Coins,
  GitCompare,
  Sparkles,
  Clock,
  Brain,
  Laptop,
  Wallet,
  Radio,
  LucideProps,
} from 'lucide-react';

interface ToolIconProps extends LucideProps {
  name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Target':
      return <Target {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'CheckSquare':
      return <CheckSquare {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Milestone':
      return <Milestone {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Scale':
      return <Scale {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'GitCompare':
      return <GitCompare {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Brain':
      return <Brain {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'Radar':
      return <Radio {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};
