import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExchangeForm } from "@/components/exchange/ExchangeForm";
import { ExchangeCard } from "@/components/exchange/ExchangeCard";
import { useExchange } from "@/components/exchange/useExchange";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarContent } from "@/components/ui/sidebar";

export default function Exchange() {
  const { items, handleDelete, handleCreate, handleEdit } = useExchange();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        {isMobile && <SidebarContent />}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary">Community Exchange</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> List Item
                  </Button>
                </DialogTrigger>
                <ExchangeForm onSubmit={handleCreate} mode="create" />
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items?.map((item) => (
                <ExchangeCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
