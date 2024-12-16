import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

export default function Exchange() {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "general"
    }
  });

  const { data: items, refetch } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*, profiles(full_name)")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const { error } = await supabase
        .from("marketplace_items")
        .insert({
          title: values.title,
          description: values.description,
          price: values.price ? parseFloat(values.price) : null,
          category: values.category,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Item listed successfully",
        description: "Your item has been posted to the marketplace."
      });

      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: "Error listing item",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>List New Item</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Item title" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Item description" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Price (optional)" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="furniture">Furniture</SelectItem>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="clothing">Clothing</SelectItem>
                                <SelectItem value="books">Books</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">List Item</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items?.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p>{item.description}</p>
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
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}