import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { useConnection } from "wagmi";
import { SelectWallet } from "./select-wallet";
import { SelectAccount } from "./select-account";

export function Navbar() {
  const { addresses } = useConnection();

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl px-4 mx-auto flex justify-between items-center gap-4 h-16">
        <Link href="/" className="w-24">
          <Avatar>
            <AvatarFallback>XDAO</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/governance"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Governance
          </Link>
          {addresses && addresses.length > 0 ? (
            <SelectAccount />
          ) : (
            <SelectWallet />
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
