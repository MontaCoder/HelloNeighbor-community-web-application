import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function NeighborhoodList() {
  const { data: neighborhoods, isLoading } = useQuery({
    queryKey: ["neighborhoods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {neighborhoods?.map((neighborhood) => (
          <TableRow key={neighborhood.id}>
            <TableCell>{neighborhood.name}</TableCell>
            <TableCell>{neighborhood.description}</TableCell>
            <TableCell>
              {new Date(neighborhood.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}