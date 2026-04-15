import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExchangeForm } from "./ExchangeForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

interface ExchangeCardProps {
  item: any;
  onDelete: (itemId: string) => void;
  onEdit: (itemId: string, values: any) => void;
}

export function ExchangeCard({ item, onDelete, onEdit }: ExchangeCardProps) {
  const { user } = useAuth();

  return (
    <Card className="group overflow-hidden hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1 animate-scale-in">
      {item.image_urls?.[0] && (
        <div className="relative overflow-hidden">
          <img
            src={item.image_urls[0]}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="soft" className="backdrop-blur-sm">
              {item.category}
            </Badge>
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
          </div>
          {user && item.created_by === user.id && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <ExchangeForm
                  mode="edit"
                  defaultValues={item}
                  onSubmit={(values) => onEdit(item.id, values)}
                />
              </Dialog>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {item.description}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-border/40">
          <span className="text-lg font-bold text-foreground flex items-center gap-1">
            {item.price ? (
              <>
                <span className="text-primary">${item.price}</span>
              </>
            ) : (
              <Badge variant="soft-secondary" className="text-xs">
                Free
              </Badge>
            )}
          </span>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" />
            {item.profiles?.full_name || "Neighbor"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}