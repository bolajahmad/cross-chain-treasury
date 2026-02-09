/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ActionType,
  ActionTypes,
  CreateActionInput,
} from "@/lib/models/actions";
import { AlertCircle, ArrowDown } from "lucide-react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import {
  useChains,
} from "wagmi";
import { BatchPayoutProposalForm } from "./payout";
import { StreamStartActionForm } from "./stream-start-proposal";
import { SelectExistingStreamAction } from "./selec-stream-id";
import { Form } from "@/components/ui/form";
import { parseUnits, zeroAddress } from "viem";
import { DisplayTokenBalance } from "./display-token-balance";

type Props = {
  isLocal?: boolean;
};

export const CreateActionFormLayout = ({ isLocal = true }: Props) => {
  const form = useForm<CreateActionInput>({
    defaultValues: {
      title: "",
      description: "",
      type: ActionType.PAYOUT,
      amount: "",
      recipient: "",
      token: zeroAddress,
    },
    shouldUnregister: true,
  });
  const actionType = useWatch({
    control: form.control,
    name: "type",
  });
  const chains = useChains();

  return (
    <Form {...form}>
      <div className="p-8 space-y-8">
        {/* Action Choice */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-400 tracking-widest">
            Select Action Type
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(ActionTypes).map(([val, { id, label }]) => (
              <button
                key={val}
                type="button"
                onClick={() =>
                  form.setValue("type", id, {
                    shouldDirty: true,
                  })
                }
                className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${actionType === id ? "border-indigo-600 bg-indigo-600/10 text-indigo-400" : "border-gray-800 bg-gray-800/50 text-gray-500 hover:border-gray-700"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Display the inputs for the Metadata (title & description & token) */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Proposal Title{" "}
                      <span className="text-xm text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter proposal title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2 flex-1">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Token Address (ERC20){" "}
                      <span className="text-xm text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter token address (leave empty for native)"
                        {...field}
                      />
                    </FormControl>
                    <div>
                      <span>
                        Balance:{" "}
                        <DisplayTokenBalance
                          token={field.value as `0x${string}`}
                        />
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Proposal Description{" "}
                    <span className="text-xm text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      rows={4}
                      required
                      placeholder="Describe your proposal in detail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Left Column */}
          {isLocal ? null : (
            <div className="space-y-6">
              <div className="space-y-2 flex-1 w-full">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Proposal Type{" "}
                        <span className="text-xm text-red-400">*</span>
                      </FormLabel>

                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose source chain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chains.map(({ id, name }) => (
                            <SelectItem key={id} value={`${id}`}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Action Type dependent Form fields */}
          <div>
            {/* BATCH_PAYOUT_FORM */}
            {!actionType ||
              ([ActionType.BATCH_PAYOUT, ActionType.PAYOUT].includes(
                actionType,
              ) && (
                <BatchPayoutProposalForm actionType={actionType} form={form} />
              ))}

            {actionType == ActionType.STREAM_START && (
              <StreamStartActionForm form={form} isSubmitting={false} />
            )}

            {[
              ActionType.STREAM_STOP,
              ActionType.PAUSE,
              ActionType.RESUME,
            ].includes(actionType) && (
              <SelectExistingStreamAction form={form} isSubmitting={false} />
            )}
          </div>
        </div>

        {isLocal ? null : (
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
          Create {isLocal ? "Local" : "Cross-Chain"} Action{" "}
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </Form>
  );
};
