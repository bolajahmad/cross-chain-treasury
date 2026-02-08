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
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Inputs } from "../../../pages/create/oldpage";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ActionType } from "@/lib/models/actions";
import { CalendarIcon, Plus, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  form: UseFormReturn<Inputs, any, Inputs>;
  isSubmitting?: boolean;
};

export const StreamStartActionForm = ({ form, isSubmitting }: Props) => {
  // Local state for human-friendly duration input
  const [durationValue, setDurationValue] = useState("1");
  const [durationUnit, setDurationUnit] = useState("days");

  // Sync duration (cliff) to seconds
  useEffect(() => {
    const val = parseFloat(durationValue) || 0;
    let seconds = 0;
    switch (durationUnit) {
      case "seconds":
        seconds = val;
        break;
      case "minutes":
        seconds = val * 60;
        break;
      case "hours":
        seconds = val * 3600;
        break;
      case "days":
        seconds = val * 86400;
        break;
      case "weeks":
        seconds = val * 604800;
        break;
    }
    form.setValue("cliff", Math.floor(seconds).toString());
  }, [durationValue, durationUnit, form]);

  return (
    <Fragment>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Core Identity */}
          <div className="space-y-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Recipient&apos;s Address{" "}
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

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Total Stream Amount{" "}
                      <span className="text-xm text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        required
                        placeholder="00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="relative">
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
            </div>
          </div>

          {/* Right Column: Temporal Logistics */}
          <div className="space-y-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild className="w-full">
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("MMM DD, YY")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? new Date(parseInt(field.value) * 1000)
                              : undefined
                          }
                          
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-end gap-3 justify-between w-full">
                <div className="w-full flex-1">
                  <FormItem>
                    <FormLabel>
                      Cliff Frequency (delay between each withdrawal){" "}
                      <span className="text-xm text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        required
                        placeholder="00"
                        value={durationValue}
                        onChange={({ target }) =>
                          setDurationValue(target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
                <div className="flex gap-2">
                  <Select
                    defaultValue={durationUnit}
                    onValueChange={(unit) => setDurationUnit(unit)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose preferred token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["seconds", "minutes", "hours", "days", "weeks"].map(
                        (token) => (
                          <SelectItem key={token} value={token}>
                            {token}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 italic">
                Recipient can withdraw vested tokens every {durationValue}{" "}
                {durationUnit}.
              </p>
            </div>
          </div>
        </div>

        {/* Logic Visualization Section */}
        {/* <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#222] flex justify-between items-center bg-[#151515]">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Encoded Record Metadata
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase">
              ABI v2 Decoder Ready
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-mono">
                _recipient (address)
              </p>
              <p className="text-xs text-blue-300 font-mono truncate">
                {form.getValues("recipient") || "None"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-mono">
                _amount (uint256)
              </p>
              <p className="text-xs text-blue-300 font-mono">
                {form.getValues("amount") || "0"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-mono">
                _startTime (uint64)
              </p>
              <p className="text-xs text-blue-300 font-mono">
                {data.startTime || "0"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-mono">
                _cliff (uint64)
              </p>
              <p className="text-xs text-blue-300 font-mono">
                {data.cliff || "0"}
              </p>
            </div>
          </div>
        </div> */}
      </div>

      <div>
        <Button
          type="submit"
          size="lg"
          className="w-full mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Proposal..." : "Submit Proposal"}
        </Button>
      </div>
    </Fragment>
  );
};
