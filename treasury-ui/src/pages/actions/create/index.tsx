import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProposalType, ProposalTypes } from "@/lib/models/actions";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { BatchPayoutProposalForm } from "./forms/payout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useWriteContract } from "wagmi";
import { TreasuryContractABI } from "@/lib/contracts/abis/treasury-contract-abi";
import { TREASURY_CONTRACT_ADDRESS } from "@/lib/contracts";
import { useCreateTreasuryActions } from "@/lib/hooks/use-execute-treasury-action";

export type Inputs = {
  title: string;
  description: string;
} & (
  | {
      type: ProposalType.PAYOUT;
      recipient: string;
      amount: string;
      token: string;
    }
  | {
      type: ProposalType.BATCH_PAYOUT;
      recipient: string;
      amount: string;
      recipients: string[];
      amounts: string[];
      token: string;
    }
  | {
      type: Exclude<ProposalType, ProposalType.PAYOUT>;
      id: string;
    }
);

export default function CreateActionsPage() {
  const form = useForm<Inputs>({
    defaultValues: {
      title: "",
      description: "",
      type: ProposalType.PAYOUT,
      amount: "",
      recipient: "",
      token: "MNEE",
    },
    shouldUnregister: true,
  });
  const proposalType = useWatch({
    control: form.control,
    name: "type",
  });
  const { createPayoutAction } = useCreateTreasuryActions();

  const onSubmit = async (values: Inputs) => {
    console.log("Form Values:", values);
    switch (values.type) {
      case ProposalType.PAYOUT: {
        // Create PAYOUT action on smart contract
        await createPayoutAction({
          title: values.title,
          description: values.description,
          type: values.type
        }, {
          recipient: values.recipient as `0x${string}`,
          amount: BigInt(values.amount),
          token: values.recipient as `0x${string}`,
        })
      }
    }
  };

  return (
    <div className="h-full mx-auto px-4 pb-16 max-w-4xl 2xl:max-w-7xl w-full">
      {/* Display a list of treasury statistics
       ** Displays information like total actions, total funds, all possible actions, e.t.c.
       */}
      <div className="p-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/actions">Actions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Action</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-10 w-full">
        <div>
          <div>
            <div className="py-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold">Create Treasury Action</h1>

                <Link href="/actions">
                  <Button size="lg" variant="secondary">
                    <Plus />
                    View Proposals
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground">
                Create new treasury actions
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Card className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-medium">
                Create New Proposal
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Submit a new governance proposal for community voting. All
                fields marked with * are required.
              </p>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit((values) => onSubmit(values))}
                >
                  <div>
                    <div className="flex items-start justify-evenly gap-4">
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
                                    <SelectValue placeholder="Choose Proposal Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ProposalTypes.map(({ id, label }) => (
                                    <SelectItem key={id} value={id}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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
                              <Input
                                placeholder="Enter proposal title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
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

                  <div>
                    {/* BATCH_PAYOUT_FORM */}
                    {!proposalType ||
                      ([
                        ProposalType.BATCH_PAYOUT,
                        ProposalType.PAYOUT,
                      ].includes(proposalType) && (
                        <BatchPayoutProposalForm
                          proposalType={proposalType}
                          form={form}
                        />
                      ))}

                    {/* <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Voting Options * (1-10)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      disabled={votingOptions.length >= 10}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provide clear voting options for your proposal. Voters will
                    choose one option.
                  </p>
                  <div className="space-y-2">
                    {votingOptions.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1 relative">
                          <Input
                            value={option}
                            onChange={(e) =>
                              updateOption(index, e.target.value)
                            }
                            placeholder={`Option ${
                              index + 1
                            } (e.g., "Approve", "Reject")`}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOption(index)}
                          disabled={votingOptions.length <= 1}
                          className="shrink-0"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div> */}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
