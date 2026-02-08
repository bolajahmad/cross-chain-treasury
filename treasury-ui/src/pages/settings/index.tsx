
import React from 'react';
import { Settings, Save, Link2, Box } from 'lucide-react';

const ConfigItem = ({ label, value, type = 'text', desc }: { label: string, value: string, type?: string, desc: string }) => (
  <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-200 uppercase tracking-wide">{label}</label>
        <p className="text-xs text-gray-500 max-w-md">{desc}</p>
      </div>
      <button className="text-indigo-400 hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-600/10 transition-colors">
        <Save className="w-5 h-5" />
      </button>
    </div>
    <input 
      type={type} 
      defaultValue={value} 
      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none font-mono"
    />
  </div>
);

export const ContractSettings: React.FC = () => {
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Box className="w-6 h-6 text-indigo-400" /> Actions Contract Specs
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
           <ConfigItem 
            label="Max Actions Supported" 
            value="10" 
            type="number" 
            desc="The maximum number of distinct action types defined in the ActionType enum."
           />
           <ConfigItem 
            label="Treasury Address" 
            value="0xBaseTreasury...1234" 
            desc="The address designated to hold locked cross-chain liquidity."
           />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Link2 className="w-6 h-6 text-indigo-400" /> Bridge Controller Config
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
           <ConfigItem 
            label="Source App (TokenReceiver)" 
            value="0xReceiver...abcd" 
            desc="The ABI-encoded identifier of the TokenReceiver on the source chain."
           />
           <ConfigItem 
            label="Hyperbridge Host" 
            value="0xHostContract...999" 
            desc="ISMP Host address for relaying messages via Hyperbridge."
           />
           <ConfigItem 
            label="Network ID (Destination)" 
            value="84532" 
            type="number" 
            desc="The numeric chain ID for the destination network (Base Sepolia)."
           />
           <ConfigItem 
            label="Fee Token (USDC/ETH)" 
            value="0x833...92a1" 
            desc="Token address used for cross-chain relay fees."
           />
        </div>
      </section>

      <div className="p-8 border-t border-gray-800 flex justify-end gap-4">
         <button className="px-6 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors">
           Reset All Changes
         </button>
         <button className="px-10 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all">
           Apply Globally
         </button>
      </div>
    </div>
  );
};

export default ContractSettings;