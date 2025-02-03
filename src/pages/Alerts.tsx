import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertForm } from "@/components/alerts/AlertForm";
import { AlertList } from "@/components/alerts/AlertList";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarContent } from "@/components/ui/sidebar";

export default function Alerts() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const handleAlertCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        {isMobile && <SidebarContent />}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6">
              Community Alerts
            </h1>
            <div className="space-y-6">
              <AlertForm onSuccess={handleAlertCreated} />
              <AlertList />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
