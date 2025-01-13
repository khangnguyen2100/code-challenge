import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Currency } from '../../types/SwapToken';

type Props = {
  swapFromCurrency: Currency;
  swapToCurrency: Currency;
  swapAmount: number | string;
  exchangeBalance: number;
};

const CurrencyDetails = ({ logo, amount, currency }: { logo: string; amount: number | string; currency: string }) => (
  <div className="flex gap-x-2">
    <div className="flex">
      <img
        loading="lazy"
        src={logo}
        alt={currency}
        className="w-6 h-6 mr-2"
      />
      <span className="text-[#3f2871] text-lg font-bold">{amount}</span>
    </div>
    <div className="text-[#3f2871] text-lg font-bold">{currency}</div>
  </div>
);

export default function ConfirmSwapModal({
  swapFromCurrency,
  swapToCurrency,
  swapAmount,
  exchangeBalance,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      {/* Swap From Currency */}
      <CurrencyDetails
        logo={swapFromCurrency.logo}
        amount={swapAmount}
        currency={swapFromCurrency.currency}
      />

      {/* Swap Icon */}
      <div className="flex justify-center text-left py-3">
        <ArrowsRightLeftIcon className="h-6 w-6 text-gray-500" />
      </div>

      {/* Swap To Currency */}
      <CurrencyDetails
        logo={swapToCurrency.logo}
        amount={exchangeBalance}
        currency={swapToCurrency.currency}
      />
    </div>
  );
}
