import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExchangeForm } from "./ExchangeForm";
import { useAuth } from "@/components/auth/AuthProvider";

interface ExchangeCardProps {
  item: any;
  onDelete: (itemId: string) => void;
  onEdit: (itemId: string, values: any) => void;
}

export function ExchangeCard({ item, onDelete, onEdit }: ExchangeCardProps) {
  const { user } = useAuth();

  return (
    <Card key={item.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.title}</CardTitle>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
          {user && item.created_by === user.id && (
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
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
                size="icon"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
        {item.image_urls?.[0] && (
          <img
            src={item.image_urls[0]}
            alt={item.title}
            className="mt-3 rounded-lg w-full h-48 object-cover"
          />
        )}
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold">
            {item.price ? `$${item.price}` : "Free"}
          </span>
          <p className="text-sm text-gray-500">
            Posted by {item.profiles?.full_name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}