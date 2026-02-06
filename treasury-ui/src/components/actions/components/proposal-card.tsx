"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Vote } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ActionStatus,
  Byte,
  IAction,
  ProposalType,
} from "@/lib/models/actions";
import {
  decodeBatchPayoutActionParameters,
  decodePayoutActionParameters,
  decodeStreamStartActionParameters,
} from "@/lib/abi-codec";
import { fetchIpfsJson } from "@/lib/queries/fetch-ipfs-data";
import { hexToString } from "viem";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { ACTIONS_CONTRACT_ADDRESS } from "@/lib/contracts";
import { ActionsContractABI } from "@/lib/contracts/abis/actions-contract-abi";
import { useQuery } from "@tanstack/react-query";
import { TContractData } from "@/lib/models/contracts";

interface Props {
  proposal: IAction;
  onViewDetails?: (proposalId: Byte) => void;
  onVote?: (proposalId: Byte) => void;
  userHasVoted?: boolean;
}

export function ProposalCard({ proposal, onViewDetails }: Props) {
  const { data: contractsInfo } = useQuery({
    queryKey: ["contract-information"],
    queryFn: () =>
      fetch("/api/contracts").then(
        (res) => res.json() as Promise<TContractData[]>,
      ),
  });
  const actionContract = contractsInfo?.find(({ id }) => id == "actions");
  const { mutate: writeExecute, isPending } = useWriteContract({
    mutation: {
      onError: (error) => console.log({ error }),
      onSuccess: (data) => console.log({ data }),
    },
  });
  const [actionInfo, setActionInfo] = useState<unknown>(null);
  const isActive = proposal.status === ActionStatus.PENDING;
  const timeRemaining = 200;

  const statusColors = {
    [ActionStatus.PENDING]: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    [ActionStatus.EXECUTED]:
      "bg-green-500/10 text-green-700 dark:text-green-400",
    [ActionStatus.STOPPED]: "bg-red-500/10 text-red-700 dark:text-red-400",
    [ActionStatus.PAUSED]:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  };

  useEffect(() => {
    let isMounted = true;

    const getActionInfo = async () => {
      switch (proposal.actionType.id) {
        case ProposalType.PAYOUT: {
          const { metadata, amount, recipient, token } =
            decodePayoutActionParameters(proposal.params);
          // decode metadata

          const info = await fetchIpfsJson(hexToString(metadata));
          if (isMounted) setActionInfo({ amount, recipient, token, info });
          break;
        }
        case ProposalType.BATCH_PAYOUT: {
          // handle batch payout decoding
          const data = decodeBatchPayoutActionParameters(proposal.params);
          if (data) {
            const info = await fetchIpfsJson(hexToString(data.metadata));
            if (isMounted)
              setActionInfo({
                amount: data.amount,
                recipient: data.recipient,
                token: data.token,
                info,
              });
          }

          break;
        }
        case ProposalType.STREAM_START: {
          // handle stream start decoding
          const data = decodeStreamStartActionParameters(proposal.params);
          if (data) {
            const { amount, cliff, startTime, metadata, recipient, token } =
              data;
            const info = await fetchIpfsJson(hexToString(metadata));
            if (isMounted)
              setActionInfo({
                amount,
                cliff,
                startTime,
                recipient,
                token,
                info,
              });
          }
          break;
        }
        default: {
          const actionId = proposal.params;
          if (isMounted) setActionInfo({ actionId });
          break;
        }
      }
    };

    getActionInfo();

    return () => {
      isMounted = false;
    };
  }, [proposal.actionType.id, proposal.params]);

  const executeAction = () => {
    if (actionContract)
      writeExecute({
        address: actionContract.address,
        abi: JSON.parse(actionContract?.abi),
        functionName: "executeAction",
        args: [proposal.actionId],
      });
  };

  return (
    <Card className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-primary/50 transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {actionInfo?.info?.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {proposal.actionType.label}
              </Badge>
              <Badge className={cn("text-xs", statusColors[proposal.status])}>
                {proposal.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {actionInfo?.info?.description}
        </p>

        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{timeRemaining}</span>
          </div>
          <div className="text-muted-foreground">
            <span className="font-bold text-foreground">{5}</span> votes
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(proposal.actionId)}
            className="flex-1"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
          <Button
            size="sm"
            onClick={() => executeAction()}
            disabled={isPending || !actionContract}
            className="flex-1"
          >
            <Vote className="w-4 h-4" />
            {isPending ? "executing..." : "Execute Action"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
