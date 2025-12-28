import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/integrations/supabase/client";

export const useSession = () => {
  const supabase = getSupabase();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    user,
    session,
    isAuthenticated: !!user,
    isLoading: loading,
  };
};
