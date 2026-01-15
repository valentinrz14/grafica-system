export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUNDLE = 'BUNDLE',
}

export enum PromotionStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PAUSED = 'paused',
}

export interface Promotion {
  id: string;
  name: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  badgeText?: string | null;
  badgeColor?: string | null;
  type: PromotionType;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses?: number | null;
  currentUses: number;
  active: boolean;
  priority: number;
  categoryIds: string[];
  productIds: string[];
  minPurchase?: number | null;
  createdAt: string;
  updatedAt: string;
  status?: PromotionStatus;
  usagePercentage?: number | null;
  _count?: {
    orders: number;
  };
}

export interface CreatePromotionDto {
  name: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  badgeText?: string;
  badgeColor?: string;
  type: PromotionType;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses?: number;
  active?: boolean;
  priority?: number;
  categoryIds?: string[];
  productIds?: string[];
  minPurchase?: number;
}

export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {}

export interface PromotionStatistics {
  total: number;
  active: number;
  scheduled: number;
  expired: number;
  paused: number;
}
