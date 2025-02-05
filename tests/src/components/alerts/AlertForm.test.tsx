import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AlertForm } from "@/components/alerts/AlertForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

jest.mock("@/integrations/supabase/client");
jest.mock("@/components/auth/AuthProvider");
jest.mock("@/hooks/use-toast");

describe("AlertForm", () => {
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

  it("renders the form fields correctly", () => {
    render(<AlertForm onSuccess={jest.fn()} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/urgency/i)).toBeInTheDocument();
  });

  it("validates form submission and shows error toast on failure", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({ error: new Error("Insert error") }),
    });

    render(<AlertForm onSuccess={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Alert" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "This is a test alert" } });
    fireEvent.click(screen.getByText(/create alert/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "There was a problem creating your alert.",
        variant: "destructive",
      });
    });
  });

  it("submits the form and shows success toast on success", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({ error: null }),
    });

    const mockOnSuccess = jest.fn();
    render(<AlertForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Alert" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "This is a test alert" } });
    fireEvent.click(screen.getByText(/create alert/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Alert created",
        description: "Your alert has been posted successfully.",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
