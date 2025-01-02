import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface NeighborhoodFormData {
  name: string;
  description: string;
}

export function NeighborhoodForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm<NeighborhoodFormData>();

  const onSubmit = async (data: NeighborhoodFormData) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('neighborhoods')
        .insert({
          name: data.name,
          description: data.description,
          boundaries: {}, // This would be populated with actual boundary data
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Neighborhood created successfully",
      });

      reset();
    } catch (error) {
      console.error('Error creating neighborhood:', error);
      toast({
        title: "Error",
        description: "Failed to create neighborhood",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input {...register("name", { required: true })} />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea {...register("description")} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Neighborhood"}
      </Button>
    </form>
  );
}