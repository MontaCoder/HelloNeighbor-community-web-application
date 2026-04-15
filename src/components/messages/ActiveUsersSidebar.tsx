import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
  online_at?: string;
  status?: "online" | "offline" | "away";
  neighborhood_id?: string;
}

type PresenceRecord = {
  user_id?: string;
  neighborhood_id?: string;
};

export function ActiveUsersSidebar() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useAuth();

  const updateUsers = useCallback(
    (presenceState: PresenceRecord[]) => {
      setUsers((currentUsers) =>
        currentUsers.map((user) => ({
          ...user,
          status: presenceState.some(
            (presence) =>
              presence.user_id === user.id &&
              presence.neighborhood_id === profile?.neighborhood_id
          )
            ? "online"
            : "offline",
        }))
      );
    },
    [profile?.neighborhood_id]
  );

  const fetchUsers = useCallback(async () => {
    if (!profile?.neighborhood_id) return;

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("neighborhood_id", profile.neighborhood_id)
      .not("id", "eq", profile.id)
      .order("full_name");

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    if (profiles) {
      const transformedUsers: User[] = profiles.map((profile) => ({
        id: profile.id,
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url,
        status: "offline",
        neighborhood_id: profile.neighborhood_id,
      }));
      setUsers(transformedUsers);
    }
  }, [profile?.neighborhood_id, profile?.id]);

  useEffect(() => {
    if (!profile?.neighborhood_id) return;

    const channel = supabase
      .channel(`online-users-${profile.neighborhood_id}`)
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState() as Record<string, PresenceRecord[]>;
        const onlineUsers = Object.values(state)
          .flat()
          .filter((presence) => presence.neighborhood_id === profile.neighborhood_id);
        updateUsers(onlineUsers);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;

        const userStatus = {
          online_at: new Date().toISOString(),
          status: "online",
          user_id: profile.id,
          neighborhood_id: profile.neighborhood_id,
        };

        await channel.track(userStatus);
      });

    fetchUsers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers, profile?.neighborhood_id, profile?.id, updateUsers]);

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500 ring-2 ring-green-500/20";
      case "away":
        return "bg-yellow-500 ring-2 ring-yellow-500/20";
      default:
        return "bg-gray-400 ring-2 ring-gray-400/20";
    }
  };

  const onlineCount = users.filter((u) => u.status === "online").length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-foreground ${isCollapsed ? "hidden" : ""}`}>
            Community ({onlineCount} online)
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-background">
                  <AvatarImage src={user.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {user.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ${getStatusColor(
                    user.status || "offline"
                  )} ring-2 ring-background`}
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.full_name || "Neighbor"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.status || "offline"}
                  </p>
                </div>
              )}
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className={`text-center py-8 ${isCollapsed ? "hidden" : ""}`}>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No users found" : "No other neighbors yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}