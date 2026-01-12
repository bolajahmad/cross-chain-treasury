import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IActionsStatistics } from "@/lib/models/actions";
import { ChartColumn, CheckCheck, Play } from "lucide-react";


export default function DisplayProposalStatistics() {
    const stats = {
        maxActions: 4,
        reserves: 10000,
        totalActions: 0,
        totalDisbursed: 0,
        executedActions: 0
    } as IActionsStatistics;

    return (
        <Card className='bg-gray-200/70 dark:bg-white/5 border-none shadow-none'>
      <CardHeader>
        <CardTitle className='text-2xl font-medium flex items-center gap-2'>
          <ChartColumn className='w-6 h-6' />
          Treasury Statistics
        </CardTitle>
        <p className='text-sm text-muted-foreground'>Overview of all treasury statistics</p>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='bg-white/40 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4'>
            <p className='text-sm text-muted-foreground'>Maximum Actions</p>
            <p className='text-3xl font-bold mt-1'>{stats.maxActions.toString()}</p>
          </div>

          <div className='bg-blue-500/10 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4'>
            <p className='text-sm text-blue-700 dark:text-blue-400'>Total Reserves</p>
            <p className='text-3xl font-bold mt-1 text-blue-700 dark:text-blue-400'>{stats.reserves.toString()}</p>
          </div>

          <div className='bg-green-500/10 border border-green-200 dark:border-green-900/50 rounded-lg p-4'>
            <p className='text-sm text-green-700 dark:text-green-400 flex items-center gap-1'>
              <CheckCheck className='w-4 h-4' />
              Total Disbursed
            </p>
            <p className='text-3xl font-bold mt-1 text-green-700 dark:text-green-400'>{stats.totalDisbursed.toString()}</p>
          </div>

          <div className='bg-purple-500/10 border border-purple-200 dark:border-purple-900/50 rounded-lg p-4'>
            <p className='text-sm text-purple-700 dark:text-purple-400 flex items-center gap-1'>
              <Play className='w-4 h-4' />
              Executed Actions
            </p>
            <p className='text-3xl font-bold mt-1 text-purple-700 dark:text-purple-400'>{stats.executedActions.toString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    )
}