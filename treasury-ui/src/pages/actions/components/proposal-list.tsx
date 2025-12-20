import { Vote } from "lucide-react";
import { ProposalFilters } from "./proposals-filter";
import { useState } from "react";
import { ProposalCard } from "./proposal-card";

export function ProposalListCard() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proposals = [] as any[];
    const [query, setQuery] = useState("")

  return (
    <div className="space-y-6">
      <ProposalFilters />

      {proposals.length === 0 ? (
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
                {proposals.length}
              </span>{" "}
              proposal
              {proposals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id.toString()}
                proposal={proposal}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
