import React, { useState } from "react";
import { Info, AlertCircle, ArrowDown } from "lucide-react";
import {
  ActionType,
  ActionTypes,
  CreateActionInput,
} from "@/lib/models/actions";
import { useChains } from "wagmi";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { ACTION_LABELS } from "@/components/layout/constants";
import { CreateActionFormLayout } from "@/components/actions/forms/form-layout";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";

const ActionsCreateRoute = [
  { id: "local", label: "Local Action" },
  { id: "cross", label: "Cross-Chain Route" },
];

export default function CreateAction() {
  const chains = useChains();
  const [route, setRoute] = useState<"local" | "cross">("local");
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
          where funds are locked. <br />
          <strong>Cross-Chain Actions</strong> lock funds on your chosen source
          chain and trigger the logic on the destination (Base) via Hyperbridge.
        </p>
      </div>

        <TabGroup defaultValue="local" className="w-full">
          <TabList className="flex bg-gray-900 p-1 rounded-2xl border border-gray-800 w-full">
            {ActionsCreateRoute.map(({ id, label }) => (
              <Tab
                key={id}
                value={id}
                onClick={() => setRoute(id as typeof route)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${route === id ? "bg-indigo-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
              >
                {label}
              </Tab>
            ))}
          </TabList>

          <TabPanels
            as="form"
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl"
          >
            <TabPanel>
              <div>
                <CreateActionFormLayout />
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <CreateActionFormLayout
                  isLocal={false}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
    </div>
  );
}
