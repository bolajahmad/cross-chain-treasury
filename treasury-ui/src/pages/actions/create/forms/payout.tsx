import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment, useState } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Inputs } from "..";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProposalType } from "@/lib/models/actions";
import { Plus, X } from "lucide-react";

type Props = {
  form: UseFormReturn<Inputs, any, Inputs>;
  proposalType: ProposalType;
};

export const BatchPayoutProposalForm = ({ form, proposalType }: Props) => {
  const recipient = useWatch({
    control: form.control,
    name: "recipient",
  });
  const amount = useWatch({
    control: form.control,
    name: "amount",
  });
  const recipients =
    useWatch({
      control: form.control,
      name: "recipients",
    }) || [];
  const amounts =
    useWatch({
      control: form.control,
      name: "amounts",
    }) || [];

  console.log({ recipients, amounts });

  const addRecipientToList = (recipient: string, amount: string) => {
    if (proposalType !== ProposalType.BATCH_PAYOUT) return;
    if (!!recipient && !!amount) {
      const index = recipients.findIndex((r) => r === recipient);
      if (index >= 0) {
        // Update existing recipient amount
        const updatedAmounts = [...amounts];
        updatedAmounts[index] = amount;
        form.setValue("amounts", updatedAmounts, {
          shouldDirty: true,
        });
      } else {
        // Add new recipient and amount
        form.setValue("recipients", [...recipients, recipient], {
          shouldDirty: true,
        });
        form.setValue("amounts", [...amounts, amount], {
          shouldDirty: true,
        });
      }
    }
  };

  return (
    <Fragment>
      <div>
        <div className="space-y-2 flex-1 w-full">
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Recipient&apos; Address{" "}
                  <span className="text-xm text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Enter recipient address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex items-start justify-evenly gap-4 w-full mt-6">
        <div className="space-y-2 flex-1 w-full">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount to send <span className="text-xm text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" required placeholder="00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2 flex-1 w-full">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposal Preferred Token</FormLabel>

                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose preferred token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["MNEE", "DOT"].map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {proposalType == ProposalType.BATCH_PAYOUT && (
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => addRecipientToList(recipient, amount)}
            >
              <Plus />
              Add
            </Button>
          </div>
        )}
      </div>

      {proposalType == ProposalType.BATCH_PAYOUT && !!recipients.length && (
        <ScrollArea className="h-fit max-h-48 w-full rounded-md border mt-6">
          <div>
            <ul className="space-y-2 p-4 text-sm">
              <li>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-evenly gap-3 font-semibold flex-1 w-full">
                    <span className="inline-block w-full flex-1">Receiver</span>
                    <span className="inline-block w-full flex-1">Amount</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" type="button">
                      Clear
                    </Button>
                  </div>
                </div>
              </li>
              {recipients
                .map((rec, i) => [rec, amounts[i]])
                .map(([rec, amt]) => (
                  <li key={rec} className="text-xs font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 w-full flex items-center justify-evenly gap-3">
                        <span className="inline-block w-full flex-1">
                          {rec}
                        </span>
                        <span className="inline-block w-full flex-1">
                          {amt}
                        </span>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" type="button">
                          <X />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </ScrollArea>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full mt-6"
        //   disabled={createProposalMutation.isPending}
      >
        {true ? "Creating Proposal..." : "Submit Proposal"}
      </Button>
    </Fragment>
  );
};
