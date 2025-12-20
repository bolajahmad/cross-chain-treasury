import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link2, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Connector,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
} from "wagmi";
import Image from "next/image";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "../ui/avatar";

interface WalletButtonProps {
  wallet: Connector;
  afterSelectWallet?: () => void;
}

const WalletButton = ({ wallet, afterSelectWallet }: WalletButtonProps) => {
  const { mutate: connect } = useConnect();
  const { connector } = useConnection();
  const disconnect = useDisconnect();

  const doConnectWallet = async () => {
    if (connector) {
      disconnect.mutate({ connector });
    }
    connect({ connector: wallet });
    if (afterSelectWallet) {
      afterSelectWallet();
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
      onClick={doConnectWallet}
    >
      <div className="flex items-center gap-3">
        {wallet.logo ? (
          <Image
            className="rounded-sm"
            src={wallet.logo as string}
            alt={`${wallet.name}`}
            width={32}
            height={32}
          />
        ) : (
          <Avatar>
            <Wallet />
            <AvatarFallback>{wallet.name}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-sm">{wallet.name}</span>
        </div>
      </div>
      <Button
        size="sm"
        className={cn(
          "bg-green-50 dark:bg-green-900/20 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl w-28"
        )}
        onClick={(e) => {
          e.stopPropagation();
          doConnectWallet();
        }}
      >
        Connect
        <Link2 className="w-3 h-3" />
      </Button>
    </div>
  );
};

interface WalletSelectionProps {
  buttonLabel?: string;
  buttonClassName?: string;
}

export function SelectWallet({
  buttonLabel = "Connect Wallet",
  buttonClassName = "",
}: WalletSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const connectors = useConnectors();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="default"
          variant="outline"
          className={`${buttonClassName}`}
        >
          {buttonLabel} <Link2 />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>Select a wallet to connect</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {connectors.map((one) => (
            <WalletButton
              key={one.id}
              wallet={one}
              afterSelectWallet={() => setIsOpen(false)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
