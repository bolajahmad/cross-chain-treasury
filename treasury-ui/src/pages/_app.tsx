import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getConfig } from "@/lib/wallet/wagmi-config";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <WagmiProvider config={getConfig()}>
        <QueryClientProvider client={queryClient}>
          <div className="minh-screen flex flex-col">
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
