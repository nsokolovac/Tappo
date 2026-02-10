// Constants and configuration options for the application

export const SUBSCRIPTION_OPTIONS = [
  {
    id: 'MONTHLY',
    name: 'Mesečni Plan',
    pricePerMonth: 20,
    totalPrice: 20,
    discountLabel: 'Standard',
  },
  {
    id: 'QUARTERLY',
    name: 'Kvartalni Plan',
    pricePerMonth: 18,
    totalPrice: 54,
    discountLabel: 'Ušteda 10%',
  },
  {
    id: 'BIANNUAL',
    name: 'Polugodišnji Plan',
    pricePerMonth: 16,
    totalPrice: 96,
    discountLabel: 'Ušteda 20%',
  },
  {
    id: 'ANNUAL',
    name: 'Godišnji Plan',
    pricePerMonth: 14,
    totalPrice: 168,
    discountLabel: 'Najbolja Vrednost',
  },
];
