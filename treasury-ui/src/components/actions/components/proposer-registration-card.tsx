import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck, Info, Users } from "lucide-react";

type Props = {
  isRegistered?: boolean;
  totalVoters?: number;
};

export function ProposerRegistrationCard({
  isRegistered = false,
  totalVoters = 0,
}: Props) {
  return (
    <Card className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium">
            Proposer Registration
          </CardTitle>
          {isRegistered && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50">
              <CheckCheck className="w-3 h-3" />
              Registered
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Registered Proposers
              </p>
              <p className="text-3xl font-bold">{totalVoters.toString()}</p>
            </div>
          </div>
        </div>

        {!isRegistered && (
          <>
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-400">
                Register as a proposer to submit proposals.
                Registration is required only once and is permanent.
              </AlertDescription>
            </Alert>

            <Button size="lg" className="w-full">
              <Users className="w-4 h-4" />
              Register as Proposer
            </Button>
          </>
        )}

        {isRegistered && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10">
            <CheckCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-900 dark:text-green-400">
              ✓ You are registered and can submit proposals.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
