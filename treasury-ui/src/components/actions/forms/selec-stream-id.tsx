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
import { Inputs } from "../../../pages/actions/create";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ActionStatus, IAction, ProposalType } from "@/lib/models/actions";
import { Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

type Props = {
  form: UseFormReturn<Inputs, any, Inputs>;
  isSubmitting?: boolean;
};

export const SelectExistingStreamAction = ({ form, isSubmitting }: Props) => {
  const { data: actionsData, isLoading } = useQuery({
    queryKey: ["actions-list"],
    queryFn: () => fetch("/api/actions").then((res) => res.json()),
  });
  console.log({ actionsData });
  const actions = (actionsData?.data || []) as IAction[];

  return (
    <Fragment>
      <div className="flex items-start justify-evenly gap-4 w-full mt-6">
        <div className="space-y-2 flex-1 w-full">
          <FormField
            control={form.control}
            name="id"
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
                    {actions.map(
                      ({ actionId, metadata, status }) => (
                        <SelectItem key={actionId} value={actionId}>
                          <div className="flex flex-col w-full gap-1 py-1 group-hover:cursor-pointer">
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="font-semibold text-zinc-100 text-sm truncate">
                                {metadata.title}
                              </span>
                              <Badge
                                variant={
                                  status === ActionStatus.PENDING
                                    ? "default"
                                    : status === ActionStatus.EXECUTED
                                    ? "secondary"
                                    : status === ActionStatus.STOPPED
                                    ? "destructive"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {status}
                              </Badge>
                            </div>
                            <p className="text-xs text-zinc-400 truncate w-full leading-relaxed">
                              {metadata.description}
                            </p>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full mt-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Proposal..." : "Submit Proposal"}
      </Button>
    </Fragment>
  );
};
