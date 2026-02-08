import React, { useState } from "react";
import { Info, AlertCircle, ArrowDown } from "lucide-react";
import { ActionType, ActionTypes } from "@/lib/models/actions";
import { useChains } from "wagmi";
import { ACTION_LABELS } from "@/components/layout/constants";

export default function CreateAction() {
  const chains = useChains();
  const [route, setRoute] = useState<"local" | "cross">("local");
  const [actionType, setActionType] = useState<ActionType>(ActionType.PAYOUT);
  const [token, setToken] = useState("0x...");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sourceChain, setSourceChain] = useState(chains[1]?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Creating action... Checking balance and allowance.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-indigo-600/10 border border-indigo-600/20 p-6 rounded-2xl flex items-start gap-4">
        <Info className="w-6 h-6 text-indigo-400 mt-1 shrink-0" />
        <p className="text-sm text-indigo-200 leading-relaxed">
          <strong>Local Actions</strong> are executed directly on the same chain
          where funds are locked.{" "}
          <strong>Cross-Chain Actions</strong> lock funds on your chosen source
          chain and trigger the logic on the destination (Base) via Hyperbridge.
        </p>
      </div>

      <div className="flex bg-gray-900 p-1 rounded-2xl border border-gray-800">
        <button
          onClick={() => setRoute("local")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${route === "local" ? "bg-indigo-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
        >
          Local Action
        </button>
        <button
          onClick={() => setRoute("cross")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${route === "cross" ? "bg-indigo-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
        >
          Cross-Chain Route
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="p-8 space-y-8">
          {/* Action Choice */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Select Action Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(ActionTypes).map(([val, { id, label }]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setActionType(id)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${actionType === id ? "border-indigo-600 bg-indigo-600/10 text-indigo-400" : "border-gray-800 bg-gray-800/50 text-gray-500 hover:border-gray-700"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {route === "cross" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Source Chain
                  </label>
                  <select
                    value={sourceChain}
                    onChange={(e) => console.log({ value: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none"
                  >
                    {chains.slice(1).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Token Address (ERC20)
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-indigo-600/50 outline-none"
                />
                <p className="text-[10px] text-gray-500 italic">
                  Leave empty for native gas token.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                    USDC
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-indigo-600/50 outline-none"
                />
              </div>
            </div>
          </div>

          {route === "cross" && (
            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />
              <p className="text-xs text-orange-200">
                A bridging fee of approx <strong>0.005 ETH</strong> will be
                charged to relay this message via Hyperbridge.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 p-6 border-t border-gray-800 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Est. Gas
            </p>
            <p className="text-sm font-medium text-gray-200">0.00045 ETH</p>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-4 bg-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
          >
            Create {route === "cross" ? "Cross-Chain" : "Local"} Action{" "}
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
