import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/shared/ImageUpload";

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

export type ExchangeFormValues = {
  title: string;
  description: string;
  price: string;
  category: string;
  image_urls?: string[];
};

interface ExchangeFormProps {
  onSubmit: (values: ExchangeFormValues) => void;
  defaultValues?: Partial<ExchangeFormValues>;
  mode?: 'create' | 'edit';
}

export function ExchangeForm({ onSubmit, defaultValues = {}, mode = 'create' }: ExchangeFormProps) {
  const form = useForm<ExchangeFormValues>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "general",
      ...defaultValues
    }
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{mode === 'create' ? 'List New Item' : 'Edit Item'}</DialogTitle>
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
                <select {...field} className={selectClassName}>
                  <option value="general">General</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="services">Services</option>
                </select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_urls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    existingUrl={field.value?.[0]}
                    onImageUploaded={(url) => field.onChange([url])}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {mode === 'create' ? 'List Item' : 'Update Item'}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
