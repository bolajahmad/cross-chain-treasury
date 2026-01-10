import { Plus, Vote } from "lucide-react";
import { ProposalFilters } from "./proposals-filter";
import { useState } from "react";
import { ProposalCard } from "./proposal-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { IAction } from "@/lib/models/actions";

export function ProposalListCard() {
  const [query, setQuery] = useState("");
  const { data: actionsData, isLoading} = useQuery({
    queryKey: ["actions-list"],
    queryFn: () => fetch("/api/actions").then((res) => res.json()),
  })
  console.log({ actionsData })
  const actions = (actionsData?.data || []) as IAction[];

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-gray-200/70 dark:bg-white/5 border-none shadow-none"
            >
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : actions.length < 1 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Vote className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Proposals Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
            Be the first to create a governance proposal and shape the future of
            this treasury!
          </p>
          <Button size="lg">
            <Plus className="w-5 h-5" />
            Create First Proposal
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <ProposalFilters />

          {actions.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Vote className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No proposals found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {query
                  ? "Try adjusting your filters to see more results"
                  : "No proposals have been created yet. Be the first to create one!"}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {actions.length}
                  </span>{" "}
                  actions
                  {actions.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.map((action) => (
                  <ProposalCard
                    key={action.id.toString()}
                    proposal={action}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
