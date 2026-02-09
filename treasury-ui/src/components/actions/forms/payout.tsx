/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Inputs } from "../../../pages/create/oldpage";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ActionType } from "@/lib/models/actions";
import { Plus, X } from "lucide-react";

type Props = {
  form: UseFormReturn<Inputs, any, Inputs>;
  actionType: ActionType;
};

export const BatchPayoutProposalForm = ({ form, actionType }: Props) => {
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

  const addRecipientToList = (recipient: string, amount: string) => {
    if (actionType !== ActionType.BATCH_PAYOUT) return;
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
  const removeRecipients = (rec: string) => {
    if (rec == "all") {
      form.setValue("recipients", [], { shouldDirty: true });
      form.setValue("amounts", [], { shouldDirty: true });
    } else {
      const index = recipients.indexOf(rec);
      if (index >= 0) {
        const updatedRecipients = [...recipients];
        const updatedAmounts = [...amounts];
        updatedRecipients.splice(index, 1);
        updatedAmounts.splice(index, 1);
        form.setValue("recipients", updatedRecipients, { shouldDirty: true });
        form.setValue("amounts", updatedAmounts, { shouldDirty: true });
      }
    }
  } 

  return (
    <Fragment>
      <div className="flex items-end justify-evenly gap-4 w-full mt-6">
        <div className="space-y-2 flex-1 w-full">
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Recipient&apos;s Address{" "}
                  <span className="text-xm text-red-400">*</span>
                </FormLabel>
                <FormMessage />
                <FormControl>
                  <Input
                    required
                    placeholder="Enter recipient address"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2 flex-1 w-full">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount to send <span className="text-xm text-red-400">*</span>
                </FormLabel>
                <FormMessage />
                <FormControl>
                  <Input type="number" required placeholder="00" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {actionType == ActionType.BATCH_PAYOUT && (
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

      {actionType == ActionType.BATCH_PAYOUT && !!recipients.length && (
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
                    <Button onClick={() => removeRecipients("all")} variant="outline" size="sm" type="button">
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
                        <Button onClick={() => removeRecipients(rec)} variant="ghost" size="sm" type="button">
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
    </Fragment>
  );
};
