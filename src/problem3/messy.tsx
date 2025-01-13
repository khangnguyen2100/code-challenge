interface WalletBalance {
  currency: string;
  amount: number;
  // add blockchain Prop
  blockchain: Blockchain;
}

// using extends to avoid duplicate
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// defind type for blockchain
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

// using Record<Blockchain, number> instead of switch case
const blockchainPriority: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances: WalletBalance[] = useWalletBalances();
  const prices = usePrices();

  // should define type for blockchain
  const getPriority = (blockchain: Blockchain): number =>
    blockchainPriority[blockchain] ?? -99;

  // combine sortedBalances and formattedBalances into one
  const sortedAndFormattedBalances = useMemo(() => {
    return balances
      // using && instead of nested if
      .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain))
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
      } as FormattedWalletBalance))
  // remove prices dependency because it does not affect the sorting or filtering logic.
  }, [balances]);

  const rows = sortedAndFormattedBalances.map((balance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        // use balance.currency for key instead of index, 
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
