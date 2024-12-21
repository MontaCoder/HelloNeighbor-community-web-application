import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';

export function LocationDetector() {
  const { loading, detectLocation } = useLocation();

  useEffect(() => {
    // Attempt to detect location on component mount
    detectLocation();
  }, [detectLocation]);

  return (
    <Button 
      onClick={() => detectLocation()} 
      disabled={loading}
      variant="outline"
      className="w-full"
    >
      {loading ? "Detecting location..." : "Update Current Location"}
    </Button>
  );
}