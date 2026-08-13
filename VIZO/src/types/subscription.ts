export type PlanType = 'Diamond' | 'Ruby' | 'Sapphire' | 'Emerald';
export type BillingCycle = 'monthly' | 'annual';


export interface SubscriptionPlan {
  id: string;
  name: PlanType;              
  tagline: string;             
  monthlyPrice: number;        
  annualPricePerMonth: number; 
  iconName: 'ruby' | 'diamond' | 'sapphire' | 'emerald';
  features: string[];          
  isActivePlan?: boolean;      
  expiryDate?: string;
}