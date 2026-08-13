import { SubscriptionPlan } from '../types/subscription';

export const subscriptionService = {
  getSubscriptionPlans: async (): Promise<{
    activePlan: SubscriptionPlan;
    allPlans: SubscriptionPlan[];
  }> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 600);
    });

    const activePlan: SubscriptionPlan = {
      id: 'plan_ruby',
      name: 'Ruby',
      tagline: 'Advanced tools for growing agents',
      monthlyPrice: 49,
      annualPricePerMonth: 39,
      iconName: 'ruby',
      isActivePlan: true,
      expiryDate: '12/12/26',
      features: [
        'Unlimited active clients',
        'Advanced messaging & notifications',
        'Priority listing placement',
        'Analytics dashboard',
        'Document management',
        'Priority support',
        'Custom branding',
      ],
    };

    const allPlans: SubscriptionPlan[] = [
      {
        id: 'plan_diamond',
        name: 'Diamond',
        tagline: 'Essential features for getting started',
        monthlyPrice: 19,
        annualPricePerMonth: 15,
        iconName: 'diamond',
        features: [
          'Up to 5 active clients',
          'Basic messaging',
          'Property listings',
          'Profile page',
          'Email support',
        ],
      },
      activePlan,
      {
        id: 'plan_sapphire',
        name: 'Sapphire',
        tagline: 'For professional agents & teams',
        monthlyPrice: 99,
        annualPricePerMonth: 79,
        iconName: 'sapphire',
        features: [
          'Everything in Professional',
          'Featured agent badge',
          'Lead generation tools',
          'Virtual tour integration',
          'API access',
          '24/7 dedicated support',
          'Marketing materials',
          'Team collaboration (up to 3 members)',
        ],
      },
      {
        id: 'plan_emerald',
        name: 'Emerald',
        tagline: 'Enterprise-grade for large teams',
        monthlyPrice: 199,
        annualPricePerMonth: 159,
        iconName: 'emerald',
        features: [
          'Everything in Professional',
          'Featured agent badge',
          'Lead generation tools',
          'Virtual tour integration',
          'API access',
          '24/7 dedicated support',
          'Marketing materials',
          'Team collaboration (up to 3 members)',
        ],
      },
    ];

    return { activePlan, allPlans };
  },

  requestPlanActivation: async (planId: string): Promise<boolean> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
    return true;
  },
};
