'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposal: any;
  onViewDetails?: (proposalId: bigint) => void;
  onVote?: (proposalId: bigint) => void;
  userHasVoted?: boolean;
}

export function ProposalCard({ proposal, onViewDetails, onVote, userHasVoted }: Props) {
  const isActive = proposal.status === 'Active';
  const timeRemaining = 200;

  const statusColors = {
    Active: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Passed: 'bg-green-500/10 text-green-700 dark:text-green-400',
    Rejected: 'bg-red-500/10 text-red-700 dark:text-red-400',
    Executed: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  };

  return (
    <Card className='bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-primary/50 transition-all duration-200 group'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors'>
              {proposal.title}
            </CardTitle>
            <div className='flex items-center gap-2 mt-2 flex-wrap'>
              <Badge variant='outline' className='text-xs'>
                {proposal.proposalType}
              </Badge>
              <Badge className={cn('text-xs', statusColors[proposal.status as keyof typeof statusColors])}>{proposal.status}</Badge>
              {userHasVoted && (
                <Badge variant='secondary' className='text-xs'>
                  <Vote className='w-3 h-3 mr-1' />
                  You Voted
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>{proposal.description}</p>

        <div className='flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Clock className='w-4 h-4' />
            <span className='font-medium'>{timeRemaining}</span>
          </div>
          <div className='text-muted-foreground'>
            <span className='font-bold text-foreground'>{proposal.totalVotes.toString()}</span> votes
          </div>
        </div>

        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={() => onViewDetails?.(proposal.id)} className='flex-1'>
            <Eye className='w-4 h-4' />
            Details
          </Button>
          {isActive && onVote && (
            <Button
              size='sm'
              onClick={() => onVote(proposal.id)}
              disabled={userHasVoted}
              className='flex-1'>
              <Vote className='w-4 h-4' />
              {userHasVoted ? 'Voted' : 'Vote Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}