import type { ImageSourcePropType } from 'react-native';

const BevoPayIcon = require('../assets/payment-icons/bp_payment.webp');
const CreditDebitIcon = require('../assets/payment-icons/c-d_payment.webp');
const CashIcon = require('../assets/payment-icons/c_payment.webp');
const DineInDollarsIcon = require('../assets/payment-icons/did_payment.webp');

export type PaymentMethod = 'Bevo Pay' | 'Cash' | 'Credit/Debit' | 'Dine In Dollars';

const PAYMENT_INFO_ICONS: Record<PaymentMethod, ImageSourcePropType> = {
  'Bevo Pay': BevoPayIcon,
  Cash: CashIcon,
  'Credit/Debit': CreditDebitIcon,
  'Dine In Dollars': DineInDollarsIcon,
};

export { PAYMENT_INFO_ICONS };
