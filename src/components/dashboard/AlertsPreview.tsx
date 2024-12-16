import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AlertsPreview() {
  const { data: alerts } = useQuery({
    queryKey: ["alerts-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
        <Bell className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts?.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg p-3 ${
                alert.urgency === "high"
                  ? "bg-red-100"
                  : alert.urgency === "medium"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
              }`}
            >
              <h3 className="font-semibold">{alert.title}</h3>
              <p className="text-sm text-gray-600">{alert.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}