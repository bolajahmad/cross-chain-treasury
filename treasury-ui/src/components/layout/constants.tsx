import { ActionStatus, IAction } from "@/lib/models/actions";
import {
  ArrowRightLeft,
  Activity,
  PlusCircle,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  Wallet,
  Zap,
  Lock,
  RefreshCcw,
  Clock,
} from "lucide-react";

export const ICONS = {
  CrossChain: <ArrowRightLeft className="w-5 h-5" />,
  Actions: <Activity className="w-5 h-5" />,
  Create: <PlusCircle className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Admin: <ShieldCheck className="w-5 h-5" />,
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Fast: <Zap className="w-5 h-5 text-yellow-400" />,
  Secure: <Lock className="w-5 h-5 text-blue-400" />,
  Sync: <RefreshCcw className="w-5 h-5 text-green-400" />,
  Time: <Clock className="w-5 h-5 text-purple-400" />,
};

export const ACTION_LABELS: Record<number, string> = {
  0: "Payout",
  1: "Batch Payout",
  2: "Stream Start",
  3: "Stream Stop",
  4: "Pause",
  5: "Resume",
};

export const STATUS_COLORS: Record<IAction["status"], string> = {
  [ActionStatus.PENDING]: "text-gray-400 bg-gray-400/10",
  [ActionStatus.EXECUTED]: "text-green-400 bg-green-400/10",
  [ActionStatus.PAUSED]: "text-orange-400 bg-orange-400/10",
  [ActionStatus.STOPPED]: "text-red-400 bg-red-400/10",
};
