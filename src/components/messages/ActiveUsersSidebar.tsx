import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
  online_at?: string;
  status?: 'online' | 'offline' | 'away';
}

export function ActiveUsersSidebar() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Subscribe to presence changes
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const onlineUsers = Object.values(state).flat() as any[];
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
          status: 'online'
        };
        
        await channel.track(userStatus);
      });

    // Fetch initial users
    fetchUsers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
    
    if (profiles) {
      // Transform profiles to match User interface
      const transformedUsers: User[] = profiles.map(profile => ({
        id: profile.id,
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url,
        status: 'offline',
        online_at: null
      }));
      setUsers(transformedUsers);
    }
  };

  const updateUsers = (presenceState: any[]) => {
    setUsers(currentUsers => 
      currentUsers.map(user => ({
        ...user,
        status: presenceState.find(p => p.user_id === user.id) ? 'online' : 'offline'
      }))
    );
  };

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
    <div className={`border-l transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-4 text-gray-500 hover:text-gray-700"
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

        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <div className="relative">
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
                <span className="text-sm truncate">
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