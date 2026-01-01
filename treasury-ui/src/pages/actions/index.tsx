import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DisplayProposalStatistics from "./components/proposal-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { Plus, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposerRegistrationCard } from "./components/proposer-registration-card";
import { ProposalListCard } from "./components/proposal-list";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function ActionsPage() {
  const { data } = useQuery({
    queryKey: ["actions-statistics"],
    queryFn: () => fetch("/api/treasury").then((res) => res.json()),
  });
  console.log({ data });

  const actions = [] as any[];

  return (
    <div className="h-full mx-auto px-4 pb-16 max-w-7xl">
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
              <BreadcrumbPage>Proposals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-10">
          {/* The actual content of the page */}
          <div>
            {/* The page header and title text */}
            <div>
              <div className="py-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-4xl font-bold">Treasury Actions</h1>

                  <Link href="/actions/create">
                    <Button
                      size="lg"
                      variant="secondary"
                    >
                      <Plus />
                      Create Proposal
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">
                  Review and manage all recent treasury actions
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="mt-6 lg:col-span-2">
              {/* Start with some stats about the treasury */}
              {false ? (
                <Card className="bg-gray-200/70 dark:bg-white/5 border-none shadow-none">
                  <CardHeader>
                    <Skeleton className="h-8 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-48 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ) : true ? (
                <DisplayProposalStatistics />
              ) : null}
            </div>

            <div className="grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                {false ? (
                  <Card className="bg-gray-200/70 dark:bg-white/5 border-none shadow-none w-full">
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <ProposerRegistrationCard />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div>
          <Separator className="my-4" />

          <Card className="bg-gray-200/70 dark:bg-white/5 border-none shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-medium flex items-center gap-2">
                  <Vote className="w-6 h-6" />
                  All Proposals
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Browse and vote on governance proposals
              </p>
            </CardHeader>
            <CardContent>
              {false ? (
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
              ) : actions && actions.length > 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Vote className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No Proposals Yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                    Be the first to create a governance proposal and shape the
                    future of this treasury!
                  </p>
                  <Button size="lg">
                    <Plus className="w-5 h-5" />
                    Create First Proposal
                  </Button>
                </div>
              ) : (
                <ProposalListCard />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
