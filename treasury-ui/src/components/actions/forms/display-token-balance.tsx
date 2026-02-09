import { ERC20ABI } from "@/lib/contracts/abis/erc20-abi";
import { Byte } from "@/lib/models/actions";
import { useMemo } from "react";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import {
  useBalance,
  useConnection,
  useReadContract,
  useReadContracts,
} from "wagmi";

type Props = {
  token: Byte;
};

export const DisplayTokenBalance = ({ token }: Props) => {
  const { address, chain } = useConnection();
  const { data: nativeBalance, isLoading: isNativeBalanceLoading } = useBalance(
    {
      address,
      chainId: chain?.id,
      query: {
        enabled: token == zeroAddress,
      },
    },
  );

  //   Fetch token balance by address if token is not native
  const { data, isLoading: isTokenBalanceLoading } = useReadContracts({
    contracts: [
      {
        abi: ERC20ABI,
        address: token,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        abi: ERC20ABI,
        address: token,
        functionName: "decimals",
      },
      {
        abi: ERC20ABI,
        address: token,
        functionName: "symbol",
      },
    ],
    query: {
      enabled: token != zeroAddress,
    },
  });

  const isLoading = isNativeBalanceLoading || isTokenBalanceLoading;
  const { balance, symbol, decimal } = useMemo(() => {
    const balance = data?.[0].result || 0n;
    const decimal = data?.[1].result || 18;
    const symbol = data?.[2].result || "Token";
    return { balance, symbol, decimal };
  }, [data])

  return (
    <span>
      {nativeBalance
        ? `${Number(formatUnits(nativeBalance.value, nativeBalance.decimals)).toFixed(3)} ${nativeBalance.symbol}`
        : `${Number(formatUnits(balance, decimal)).toFixed(3)} ${symbol}`}
    </span>
  );
};
