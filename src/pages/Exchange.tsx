import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExchangeForm } from "@/components/exchange/ExchangeForm";
import { ExchangeCard } from "@/components/exchange/ExchangeCard";
import { useExchange } from "@/components/exchange/useExchange";

export default function Exchange() {
  const { items, handleDelete, handleCreate, handleEdit } = useExchange();

  return (
    <div className="min-h-screen flex flex-col w-full bg-muted/20">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Community Exchange
                </h1>
                <p className="text-muted-foreground text-sm">
                  Buy, sell, and trade with your neighbors
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-lift">
                  <Plus className="mr-2 h-4 w-4" />
                  List Item
                </Button>
              </DialogTrigger>
              <ExchangeForm onSubmit={handleCreate} mode="create" />
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
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
  );
}
