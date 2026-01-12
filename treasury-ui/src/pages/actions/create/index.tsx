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
import { useForm, useWatch } from "react-hook-form";
import { BatchPayoutProposalForm } from "../../../components/actions/forms/payout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateTreasuryActions } from "@/lib/hooks/use-execute-treasury-action";
import { parseUnits } from "viem";
import { StreamStartActionForm } from "../../../components/actions/forms/stream-start-proposal";
import { SelectExistingStreamAction } from "../../../components/actions/forms/selec-stream-id";

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
      type: ProposalType.STREAM_START;
      recipient: string;
      amount: string;
      startTime: string;
      cliff: string;
      token: string;
    }
  | {
      type: ProposalType.STREAM_STOP | ProposalType.PAUSE | ProposalType.RESUME;
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
  const {
    createPayoutAction,
    createBatchPayoutAction,
    createStreamPauseResumeStopAction,
    createStreamStartAction,
    isSubmitting,
  } = useCreateTreasuryActions();

  const onSubmit = async (values: Inputs) => {
    console.log("Form Values:", values);
    switch (values.type) {
      case ProposalType.PAYOUT: {
        // Create PAYOUT action on smart contract
        await createPayoutAction(
          {
            title: values.title,
            description: values.description,
            type: values.type,
          },
          {
            recipient: values.recipient as `0x${string}`,
            amount: parseUnits(values.amount, 18),
            token: values.recipient as `0x${string}`,
          }
        );
        break;
      }
      case ProposalType.BATCH_PAYOUT: {
        await createBatchPayoutAction(
          {
            title: values.title,
            description: values.description,
            type: values.type,
          },
          {
            recipients: values.recipients as `0x${string}`[],
            amounts: values.amounts.map((amount) => parseUnits(amount, 18)),
            token: values.token as `0x${string}`,
          }
        );
        break;
      }
      case ProposalType.STREAM_START: {
        await createStreamStartAction(
          {
            title: values.title,
            description: values.description,
            type: values.type,
          },
          {
            amount: values.amount,
            recipient: values.recipient as `0x${string}`,
            token: values.token as `0x${string}`,
            startTime: values.startTime,
            cliff: values.cliff,
          }
        );
        break;
      }
      case ProposalType.STREAM_STOP:
      case ProposalType.PAUSE:
      case ProposalType.RESUME: {
        await createStreamPauseResumeStopAction(
          {
            title: values.title,
            description: values.description,
            type: values.type,
          },
          values.id as `0x${string}`,
          proposalType
        );
        break;
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
                          isSubmitting={isSubmitting}
                        />
                      ))}

                    {proposalType == ProposalType.STREAM_START && (
                      <StreamStartActionForm
                        form={form}
                        isSubmitting={isSubmitting}
                      />
                    )}

                    {[
                      ProposalType.STREAM_STOP,
                      ProposalType.PAUSE,
                      ProposalType.RESUME,
                    ].includes(proposalType) && (
                      <SelectExistingStreamAction
                        form={form}
                        isSubmitting={isSubmitting}
                      />
                    )}
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
