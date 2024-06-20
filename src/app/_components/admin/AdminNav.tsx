"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Home, LineChart, Package } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function AdminNav() {
  return (
    <TooltipProvider>
      <aside className="fixed left-0 w-14 flex-col bg-transparent sm:flex">
        <nav className="flex flex-col items-center gap-10 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/admin"
                className="flex h-9 w-9 items-center justify-center rounded-lg  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-7 w-7" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/admin/occupancy-report"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Package className="h-7 w-7" />
                <span className="sr-only">Occupancy Report</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Occupancy Report</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/admin/revenue-report"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LineChart className="h-7 w-7" />
                <span className="sr-only">Revenue Report</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Revenue Report</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
