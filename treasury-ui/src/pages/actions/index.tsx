import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  ArrowRight,
  Activity,
} from "lucide-react";
import { ActionStatus, DUMMY_ACTIONS, IAction } from "@/lib/models/actions";
import { STATUS_COLORS } from "@/components/layout/constants";

export default function Actions() {
  const [selectedAction, setSelectedAction] = useState<IAction | null>(
    null,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Table Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID or token..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto bg-gray-900 border border-gray-800 rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800/50 text-gray-400 font-medium border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Action Type</th>
                <th className="px-6 py-4">ID / Creator</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {DUMMY_ACTIONS.map((action) => (
                <tr
                  key={action.id}
                  className={`hover:bg-gray-800/40 cursor-pointer transition-colors ${selectedAction?.id === action.id ? "bg-indigo-600/5" : ""}`}
                  onClick={() => setSelectedAction(action)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-indigo-400" />
                      </div>
                      <span className="font-semibold text-gray-200">
                        {action.actionType.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-indigo-300 mb-1">
                      {action.id}
                    </p>
                    <p className="text-xs text-gray-500">By {action.creator}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-200">{action.totalAmount}</p>
                    <p className="text-xs text-gray-500 uppercase">
                      {action.token.split(" ")[0]}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[action.status]}`}
                    >
                      {ActionStatus[action.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-5 h-5 text-gray-600 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Sidebar */}
      <div className="space-y-6">
        {selectedAction ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Action Details</h3>
              <button className="text-gray-500 hover:text-white">
                <MoreHorizontal />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-xl">
                <p className="text-xs text-indigo-400 font-bold uppercase mb-1">
                  Configuration Data
                </p>
                <p className="text-sm font-mono break-all text-indigo-200">
                  {selectedAction.params}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Creator
                  </p>
                  <p className="text-sm font-medium">
                    {selectedAction.creator.slice(0, 10)}...
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Token Address
                  </p>
                  <p className="text-sm font-medium">
                    {selectedAction.token.split(" ")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Executed At
                  </p>
                  <p className="text-sm">
                    {selectedAction.timestamp == "0"
                      ? "Not yet executed"
                      : new Date(selectedAction.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-800 space-y-3">
                <button className="w-full py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  Execute Now
                </button>
                <button className="w-full py-3 border border-red-500/30 text-red-400 bg-red-500/5 rounded-xl font-bold hover:bg-red-500/10 transition-colors">
                  Cancel Action
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-100 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-gray-700" />
            </div>
            <p className="text-gray-500 font-medium">
              Select an action to view detailed metrics and execution controls.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
