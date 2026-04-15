import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertForm } from "@/components/alerts/AlertForm";
import { AlertList } from "@/components/alerts/AlertList";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

export default function Alerts() {
  const queryClient = useQueryClient();

  const handleAlertCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-muted/20">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Bell className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Community Alerts
                </h1>
                <p className="text-muted-foreground text-sm">
                  Stay informed about neighborhood updates
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <AlertForm onSuccess={handleAlertCreated} />
            </Dialog>
          </div>

          <div className="space-y-6 animate-scale-in">
            <Card className="p-6">
              <AlertList />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}