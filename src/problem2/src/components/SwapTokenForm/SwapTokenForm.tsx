import { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import { CURRENCIES, USER_WALLET } from '../../mocks/swap-form-data';
import type { Currency, UserBalance } from '../../types/SwapToken';
import confirmSwap from './ConfirmSwapModal';
import SelectTokenInput from './ListBox';
import clsx from 'clsx';
import { Input } from '@headlessui/react';

const defaultCurrency: Currency = {
  currency: '',
  exchangeRate: 0,
  date: '',
  logo: '',
};

const SwapTokenForm = () => {
  const [tokenLists, setTokenLists] = useState<Currency[]>([]);
  const [userBalance, setUserBalance] = useState<UserBalance[]>([]);
  const [swapAmount, setSwapAmount] = useState<number | undefined>();
  const [swapFrom, setSwapFrom] = useState<Currency>(defaultCurrency);
  const [swapTo, setSwapTo] = useState<Currency>(defaultCurrency);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initGetUserInfo = async () => {
    try {
      const userInfoResponse = USER_WALLET;
      if (userInfoResponse) setUserBalance(userInfoResponse);
    } catch (error) {
      console.error('Failed to fetch user info', error);
    }
  };

  const initTokenInfo = async () => {
    try {
      const tokenInfoResponse = CURRENCIES;
      if (tokenInfoResponse) {
        setTokenLists(tokenInfoResponse);
        setSwapFrom(tokenInfoResponse[0]);
        setSwapTo(tokenInfoResponse[1]);
      }
    } catch (error) {
      console.error('Failed to fetch token info', error);
    }
  };
  const handleUpdateUserCurrencyAmount = () => {
    if (!swapAmount) return;
    const updatedUserBalance = userBalance.map(token => {
      if (token.currency === swapFrom.currency) {
        return {
          ...token,
          amount: token.amount - swapAmount,
        };
      }
      if (token.currency === swapTo.currency) {
        return {
          ...token,
          amount: token.amount + exchangeBalance,
        };
      }
      return token;
    });
    setUserBalance(updatedUserBalance);
  };
  const handleSubmit = () => {
    if (!swapAmount) return;
    setIsLoading(true);

    const modalContent = ReactDOMServer.renderToString(
      confirmSwap({
        swapFromCurrency: swapFrom,
        swapToCurrency: swapTo,
        swapAmount: swapAmount,
        exchangeBalance: exchangeBalance,
      }),
    );

    Swal.fire({
      title: 'Confirm swap',
      html: modalContent,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm and swap',
    }).then(result => {
      if (result.isConfirmed) {
        handleUpdateUserCurrencyAmount();
        Swal.fire(
          'Transaction Submitted!',
          'Your transaction has been successful.',
          'success',
        );
        setSwapAmount(0);
      }
      setIsLoading(false);
    });
  };

  const handleChangeToken = (newValue: Currency, type: 'from' | 'to') => {
    setSwapAmount(0);
    if (type === 'from') {
      // switch swapFrom and swapTo if the same currency is selected
      if (newValue.currency === swapTo?.currency) {
        setSwapTo(swapFrom);
      }
      setSwapFrom(newValue);
    } else {
      // switch swapFrom and swapTo if the same currency is selected
      if (newValue.currency === swapFrom?.currency) {
        setSwapFrom(swapTo);
      }
      setSwapTo(newValue);
    }
  };

  const handleSetMaxValue = () => {
    setSwapAmount(currentUserBalance);
  };

  const exchangeBalance = useMemo(() => {
    if (!swapAmount) return 0;
    const convertedValue =
      (swapAmount * swapFrom.exchangeRate) / swapTo.exchangeRate;
    return parseFloat(convertedValue.toFixed(2));
  }, [swapAmount, swapFrom, swapTo]);

  const currentUserBalance = useMemo(() => {
    if (!userBalance) return 0;
    return (
      userBalance?.find(token => token?.currency === swapFrom.currency)
        ?.amount ?? 0
    );
  }, [userBalance, swapFrom]);

  const isAmountInvalid =
    swapAmount !== undefined && swapAmount > currentUserBalance;

  useEffect(() => {
    initGetUserInfo();
    initTokenInfo();
  }, []);

  return (
    <div>
      <div className='mx-auto max-w-2xl text-center'>
        <h1 className='text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
          Swap Token
        </h1>
        <p className='mt-2 text-lg text-gray-600'>
          Swap your token with other tokens effortlessly.
        </p>
      </div>
      <form className='mx-auto mt-16 max-w-xl sm:mt-20'>
        {tokenLists.length > 0 && (
          <div className='grid gap-y-6'>
            <div>
              <SelectTokenInput
                label='Swap From'
                options={tokenLists}
                defaultValue={swapFrom}
                value={swapFrom}
                onChange={newValue => handleChangeToken(newValue, 'from')}
                placeholder='Select'
              />
              <p className='mt-2 text-sm text-gray-600'>
                Your balance:
                <span className='font-semibold'>
                  {' '}
                  {currentUserBalance} {swapFrom?.currency}
                </span>
              </p>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-900'>
                Amount
              </label>
              <div className='flex items-center gap-x-2 mt-2'>
                <div className='flex flex-col w-full relative'>
                  <Input
                    type='number'
                    value={swapAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = parseFloat(e.target.value);
                      if (value > currentUserBalance) {
                        setSwapAmount(currentUserBalance);
                      } else {
                        setSwapAmount(value);
                      }
                    }}
                    className={clsx(
                      'block w-full rounded-md border border-indigo-200 px-4 py-2',
                      swapAmount !== undefined &&
                        swapAmount > currentUserBalance
                        ? 'border-red-500'
                        : 'border-gray-300',
                    )}
                    placeholder='0,00'
                  />
                  {/* validate when user type over current amount */}
                  {isAmountInvalid && (
                    <span className='text-sm text-red-500 absolute -bottom-6 transition-sm'>
                      Amount exceeds your balance
                    </span>
                  )}
                </div>

                <button
                  type='button'
                  onClick={handleSetMaxValue}
                  className='text-sm font-semibold text-indigo-600 hover:underline'
                >
                  Max
                </button>
              </div>
            </div>

            <div>
              <SelectTokenInput
                label='Swap To'
                options={tokenLists}
                defaultValue={swapTo}
                value={swapTo}
                onChange={newValue => handleChangeToken(newValue, 'to')}
                placeholder='Select'
              />
              <p className='mt-2 text-sm text-gray-500'>
                You get ≈ {exchangeBalance} {swapTo?.currency}
              </p>
            </div>
          </div>
        )}

        <button
          type='button'
          onClick={handleSubmit}
          disabled={
            !swapAmount ||
            isAmountInvalid ||
            isLoading ||
            currentUserBalance === 0
          }
          className={clsx(
            'mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200',
            isLoading && 'opacity-50',
            (!swapAmount ||
              isAmountInvalid ||
              isLoading ||
              currentUserBalance === 0) &&
              'cursor-not-allowed !bg-indigo-200 hover:!bg-indigo-200',
          )}
        >
          {isLoading ? 'Processing...' : 'Swap Token'}
        </button>
      </form>
    </div>
  );
};

export default SwapTokenForm;
