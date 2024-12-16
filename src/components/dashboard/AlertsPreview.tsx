import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AlertsPreview() {
  const alerts = [
    { id: 1, type: "urgent", message: "Community meeting tonight at 7 PM" },
    { id: 2, type: "info", message: "New neighborhood watch schedule posted" },
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
        <Bell className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg p-3 ${
                alert.type === "urgent" ? "bg-accent/10" : "bg-secondary/10"
              }`}
            >
              <p className="text-sm">{alert.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}