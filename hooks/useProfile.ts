"use client";

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';
import { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get authenticated user session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Fetch corresponding profile record
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Falha ao buscar dados do perfil.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Update profile handler
  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at'>>) => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (data) {
        setProfile(data);
      }
      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Falha ao atualizar dados.');
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}
