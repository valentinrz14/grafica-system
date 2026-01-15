import { type VariantProps } from 'class-variance-authority';
import { cardVariants } from './Card.component';

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}
