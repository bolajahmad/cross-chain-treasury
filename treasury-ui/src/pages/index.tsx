import { Cpu, ExternalLink, Globe, TrendingUp } from "lucide-react";
import { ICONS } from "@/components/layout/constants";

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-indigo-500/50 transition-all group">
    <div className="mb-4 p-3 bg-gray-800 rounded-xl inline-block group-hover:bg-indigo-600/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default function ActionsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold mb-6 uppercase tracking-widest">
            Cross-Chain Revolution
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Automate Finance Across the{" "}
            <span className="text-indigo-400">Multichain</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            HyperFlow enables decentralized finance automation. Lock your assets
            on Ethereum, Arbitrum, or Polygon and orchestrate complex streams
            and payouts on Base instantly.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors flex items-center gap-2">
              Documentation <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"></div>
      </section>

      {/* Pitch / Problem Solver */}
      <section>
        <h3 className="text-2xl font-bold mb-8 text-center">Why HyperFlow?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={ICONS.Secure}
            title="Non-Custodial Escrow"
            desc="Funds are locked in transparent smart contracts on the source chain until conditions are met on the destination."
          />
          <FeatureCard
            icon={ICONS.Fast}
            title="High-Speed Bridging"
            desc="Powered by Hyperbridge ISMP, ensuring low-latency execution and secure cross-chain messaging."
          />
          <FeatureCard
            icon={ICONS.Sync}
            title="Unified Liquidity"
            desc="Spend assets from any network to fulfill obligations on your primary operational chain without manual bridging."
          />
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="grid md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Value Locked",
            value: "$12.4M",
            icon: <TrendingUp className="text-green-400" />,
          },
          {
            label: "Chains Supported",
            value: "12+",
            icon: <Globe className="text-blue-400" />,
          },
          {
            label: "Actions Executed",
            value: "45.2k",
            icon: <Cpu className="text-purple-400" />,
          },
          {
            label: "Avg Execution Time",
            value: "< 2m",
            icon: <ICONS.Time.type className="text-yellow-400" />,
          },
        ].map((stat, i) => (
          <div
            key={i + stat.label}
            className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl flex items-center gap-4"
          >
            <div className="p-3 bg-gray-800 rounded-xl">{stat.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
