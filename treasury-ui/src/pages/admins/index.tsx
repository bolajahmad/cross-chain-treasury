
import React, { useState } from 'react';
import { UserPlus, ShieldAlert, Trash2, Key } from 'lucide-react';

export const AdminControl: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'CONTROLLER' | 'EXECUTOR'>('CONTROLLER');

  const mockUsers = [
    { address: '0x71C...492b', roles: ['ADMIN', 'CONTROLLER'], added: '2024-03-01' },
    { address: '0x321...feda', roles: ['EXECUTOR'], added: '2024-03-15' },
    { address: '0x999...111a', roles: ['CONTROLLER'], added: '2024-04-10' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Key className="w-6 h-6 text-indigo-400" /> Access Management
            </h3>
            <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
              <button 
                onClick={() => setActiveRole('CONTROLLER')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeRole === 'CONTROLLER' ? 'bg-indigo-600' : 'text-gray-500 hover:text-white'}`}
              >
                Controllers
              </button>
              <button 
                onClick={() => setActiveRole('EXECUTOR')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeRole === 'EXECUTOR' ? 'bg-indigo-600' : 'text-gray-500 hover:text-white'}`}
              >
                Executors
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800/50 text-gray-400 font-medium text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Identity</th>
                  <th className="px-6 py-4">Roles</th>
                  <th className="px-6 py-4">Granted At</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockUsers.map((user, i) => (
                  <tr key={i} className="hover:bg-gray-800/40">
                    <td className="px-6 py-4 font-mono text-sm text-indigo-300">{user.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.roles.map(r => (
                          <span key={r} className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-[10px] font-bold text-gray-400">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.added}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" /> Grant Access
              </h4>
              <p className="text-sm text-gray-500 mb-6">Authorize a new contract or EOA to manage automation protocols.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Wallet Address</label>
                  <input type="text" placeholder="0x..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600/50 outline-none font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Primary Role</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none">
                    <option>CONTROLLER_ROLE</option>
                    <option>EXECUTOR_ROLE</option>
                  </select>
                </div>
                <button className="w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4">
                  Confirm Transaction
                </button>
              </div>
           </div>

           <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-3 text-red-400">
                 <ShieldAlert className="w-5 h-5" />
                 <h4 className="font-bold">Caution Area</h4>
              </div>
              <p className="text-xs text-red-300 leading-relaxed mb-4">
                Granting the CONTROLLER_ROLE allows an address to create actions without paying upfront platform fees. Only grant this to verified bridge controllers.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControl;