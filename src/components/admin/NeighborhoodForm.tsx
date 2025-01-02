import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

type NeighborhoodFormData = {
  name: string;
  description: string;
};

export default function NeighborhoodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NeighborhoodFormData>();

  const onSubmit = async (data: NeighborhoodFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .insert([
          {
            name: data.name,
            description: data.description,
            boundaries: {}, // This will be updated when map integration is added
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Neighborhood created successfully"
      });

      // Refresh neighborhoods list
      queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
      
      // Reset form
      reset();
    } catch (error) {
      console.error('Error creating neighborhood:', error);
      toast({
        title: "Error",
        description: "Could not create neighborhood. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Neighborhood</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Neighborhood name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description"
              {...register("description")}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Neighborhood"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}