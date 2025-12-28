import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/integrations/supabase/client";
import { Location } from "@/types";
import { API_BASE_URL, fetchConfig } from "@/api/config";
import { useToast } from "@/hooks/use-toast";

type AppRole = "client" | "staff" | "admin";

interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: AppRole;
  location?: Location;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone?: string,
    role?: AppRole,
    location?: Location
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  demoLogin: (
    role: "client" | "staff-medical" | "staff-bitbites"
  ) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_CREDENTIALS = {
  client: { email: "client@demo.com", password: "demo123456" },
  "staff-medical": { email: "staff-med@demo.com", password: "demo123456" },
  "staff-bitbites": { email: "staff-bit@demo.com", password: "demo123456" },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const supabase = getSupabase();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = async (currentUser: User) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${currentUser.id}`
      ).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        return {
          id: data.id || data._id,
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          location: data.location,
        } as UserProfile;
      }

      // Fallback to metadata
      const meta = currentUser.user_metadata;
      return {
        id: "temp-id",
        userId: currentUser.id,
        name: meta.name || "User",
        email: currentUser.email || "",
        phone: meta.phone,
        role: meta.role || "client",
        location: meta.location,
      };
    } catch {
      return null;
    }
  };

  // ---------------- INIT AUTH ----------------
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const p = await fetchProfile(session.user);
          setProfile(p);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        const p = await fetchProfile(data.session.user);
        setProfile(p);
      }
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  // ---------------- AUTH ACTIONS ----------------
  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    role: AppRole = "client",
    location?: Location
  ) => {
    if (!supabase)
      return { error: new Error("Auth service unavailable") };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role, location },
      },
    });

    if (error) return { error: new Error(error.message) };

    if (data.user) {
      await fetch(`${API_BASE_URL}/users`, {
        ...fetchConfig,
        method: "POST",
        body: JSON.stringify({
          userId: data.user.id,
          email,
          name,
          role,
          phone,
          location,
        }),
      }).catch(() => null);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase)
      return { error: new Error("Auth service unavailable") };

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  };

  const demoLogin = async (
    role: "client" | "staff-medical" | "staff-bitbites"
  ) => {
    if (!supabase)
      return { error: new Error("Auth service unavailable") };

    const creds = DEMO_CREDENTIALS[role];
    const { error } = await supabase.auth.signInWithPassword(creds);

    return { error: error ? new Error(error.message) : null };
  };

  // ---------------- CONTEXT ----------------
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: !!user,
        isLoading,
        signUp,
        signIn,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------- HOOK ----------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
