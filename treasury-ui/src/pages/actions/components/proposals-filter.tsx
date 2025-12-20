import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Search } from "lucide-react";
import { useState } from "react";

export function ProposalFilters() {
    const [query, setQuery] = useState("");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className='flex items-center gap-2'>
          <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
          <Select>
            <SelectTrigger className='flex-1'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest First</SelectItem>
              <SelectItem value="Oldest">Oldest First</SelectItem>
              <SelectItem value="MostVotes">Most Votes</SelectItem>
              <SelectItem value="EndingSoon">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
