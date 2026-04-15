// Issue #148: Skeleton loader for the exam-mode results summary.

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ExamResultsSkeleton() {
  return (
    <div className="space-y-4" dir="rtl">
      <Card>
        <CardContent className="p-6 space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-16 w-32 mx-auto rounded-full" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <div className="flex justify-center gap-3 pt-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
