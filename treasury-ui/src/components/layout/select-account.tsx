import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOutIcon } from "lucide-react";
import { useBalance, useConnection, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/helper";
import { formatUnits } from "viem";

function ConnectedWallet() {
  const { connector } = useConnection();

  if (!connector) return null;

  return (
    <div className="flex items-center gap-2 justify-center pb-1">
      <span className="font-semibold text-sm">{connector.name}</span>
    </div>
  );
}

export function SelectAccount() {
  const { addresses, address, connector } = useConnection();
  const disconnect = useDisconnect();
  const balance = useBalance({
    address: address,
  });

  if (!addresses || addresses.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={address}
        onValueChange={(selectedAddress) => {
          if (selectedAddress === 'logout') {
            disconnect.mutate({ connector});
          }
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-muted-foreground hidden sm:inline">
                ({shortenAddress(address)})
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-80">
          <div className="p-2">
            <ConnectedWallet />
          </div>
          <SelectSeparator />
          {addresses?.map((addr) => (
            <SelectItem
              key={addr}
              value={addr}
              className="*:[span]:first:hidden *:[span]:last:block *:[span]:last:w-full data-[state=checked]:bg-green-200/30 pr-2"
            >
              <div className="flex items-start w-full gap-3 py-1">
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between items-center gap-2 w-full">
                    {/* <span className='font-medium'>{one.name}</span> */}
                    <span className="text-xs text-muted-foreground">
                      {shortenAddress(addr)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Balance:{" "}
                    {formatUnits(
                      BigInt(balance.data?.value || 0),
                      balance.data?.decimals ?? 10
                    )}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
      <SelectSeparator />
      <SelectItem key="logout" value="logout" className="py-2">
        <span className="flex items-center gap-2">
          <LogOutIcon className="w-4 h-4" />
          <span>Disconnect</span>
        </span>
      </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
