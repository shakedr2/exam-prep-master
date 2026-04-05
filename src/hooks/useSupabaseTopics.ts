import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbTopic = Tables<"topics">;

export function useSupabaseTopics() {
  const [topics, setTopics] = useState<DbTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      const { data, error: err } = await supabase
        .from("topics")
        .select("*")
        .order("id");
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setTopics(data ?? []);
      setLoading(false);
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  return { topics, loading, error };
}
