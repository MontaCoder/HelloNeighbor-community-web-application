import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AlertList } from "@/components/alerts/AlertList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

jest.mock("@/integrations/supabase/client");
jest.mock("@/components/auth/AuthProvider");
jest.mock("@/hooks/use-toast");

describe("AlertList", () => {
  const mockUser = { id: "user-id" };
  const mockProfile = { neighborhood_id: "neighborhood-id" };
  const mockToast = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, profile: mockProfile });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the list of alerts correctly", async () => {
    const mockAlerts = [
      {
        id: "alert-1",
        title: "Test Alert 1",
        message: "This is a test alert 1",
        type: "general",
        urgency: "low",
        created_by: "user-id",
        profiles: { full_name: "Test User" },
        neighborhoods: { name: "Test Neighborhood" },
        created_at: new Date().toISOString(),
      },
      {
        id: "alert-2",
        title: "Test Alert 2",
        message: "This is a test alert 2",
        type: "emergency",
        urgency: "high",
        created_by: "user-id",
        profiles: { full_name: "Test User" },
        neighborhoods: { name: "Test Neighborhood" },
        created_at: new Date().toISOString(),
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({ data: mockAlerts, error: null }),
    });

    render(<AlertList />);

    await waitFor(() => {
      expect(screen.getByText(/test alert 1/i)).toBeInTheDocument();
      expect(screen.getByText(/test alert 2/i)).toBeInTheDocument();
    });
  });

  it("handles alert deletion correctly", async () => {
    const mockAlerts = [
      {
        id: "alert-1",
        title: "Test Alert 1",
        message: "This is a test alert 1",
        type: "general",
        urgency: "low",
        created_by: "user-id",
        profiles: { full_name: "Test User" },
        neighborhoods: { name: "Test Neighborhood" },
        created_at: new Date().toISOString(),
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({ data: mockAlerts, error: null }),
      delete: jest.fn().mockReturnValue({ error: null }),
    });

    render(<AlertList />);

    await waitFor(() => {
      expect(screen.getByText(/test alert 1/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Alert deleted",
        description: "The alert has been removed successfully.",
      });
    });
  });

  it("shows error toast on alert deletion failure", async () => {
    const mockAlerts = [
      {
        id: "alert-1",
        title: "Test Alert 1",
        message: "This is a test alert 1",
        type: "general",
        urgency: "low",
        created_by: "user-id",
        profiles: { full_name: "Test User" },
        neighborhoods: { name: "Test Neighborhood" },
        created_at: new Date().toISOString(),
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({ data: mockAlerts, error: null }),
      delete: jest.fn().mockReturnValue({ error: new Error("Delete error") }),
    });

    render(<AlertList />);

    await waitFor(() => {
      expect(screen.getByText(/test alert 1/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "There was a problem deleting the alert.",
        variant: "destructive",
      });
    });
  });
});
