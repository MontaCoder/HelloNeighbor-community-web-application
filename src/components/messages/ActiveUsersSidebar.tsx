import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
  online_at?: string;
  status?: 'online' | 'offline' | 'away';
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

  const updateUsers = useCallback((presenceState: PresenceRecord[]) => {
    setUsers(currentUsers =>
      currentUsers.map(user => ({
        ...user,
        status: presenceState.some(
          (presence) =>
            presence.user_id === user.id &&
            presence.neighborhood_id === profile?.neighborhood_id
        )
          ? 'online'
          : 'offline'
      }))
    );
  }, [profile?.neighborhood_id]);

  const fetchUsers = useCallback(async () => {
    if (!profile?.neighborhood_id) return;

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('neighborhood_id', profile.neighborhood_id)
      .not('id', 'eq', profile.id) // Exclude current user
      .order('full_name');
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    
    if (profiles) {
      const transformedUsers: User[] = profiles.map(profile => ({
        id: profile.id,
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url,
        status: 'offline',
        neighborhood_id: profile.neighborhood_id
      }));
      setUsers(transformedUsers);
    }
  }, [profile?.neighborhood_id, profile?.id]);

  useEffect(() => {
    if (!profile?.neighborhood_id) return;

    const channel = supabase
      .channel(`online-users-${profile.neighborhood_id}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState() as Record<string, PresenceRecord[]>;
        const onlineUsers = (Object.values(state).flat() as PresenceRecord[]).filter(
          (presence) => presence.neighborhood_id === profile.neighborhood_id
        );
        updateUsers(onlineUsers);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('join', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('leave', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        const userStatus = {
          online_at: new Date().toISOString(),
          status: 'online',
          user_id: profile.id,
          neighborhood_id: profile.neighborhood_id
        };

        await channel.track(userStatus);
      });

    fetchUsers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers, profile?.neighborhood_id, profile?.id, updateUsers]);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`border-l transition-all duration-300 h-full overflow-y-auto ${
      isCollapsed ? 'w-16' : 'w-64 md:w-72'
    }`}>
      <div className="p-4 sticky top-0 bg-background z-10 border-b">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? '→' : '←'}
        </button>
        
        {!isCollapsed && (
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        )}

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="relative flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || ''} />
                  <AvatarFallback>
                    {user.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
                    getStatusColor(user.status || 'offline')
                  } ring-2 ring-white`}
                />
              </div>
              {!isCollapsed && (
                <span className="text-sm truncate flex-1">
                  {user.full_name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
