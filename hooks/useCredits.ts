"use client";

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';

export interface CreditsState {
  textLimit: number;
  textUsed: number;
  imageLimit: number;
  imageUsed: number;
  videoLimit: number;
  videoUsed: number;
  plan: 'free' | 'starter' | 'pro' | 'agency';
}

export function useCredits() {
  const [credits, setCredits] = useState<CreditsState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setCredits(null);
        setLoading(false);
        return;
      }

      // Query profiles for latest credits and active subscription plan
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('credits_text, credits_image, credits_video, plan')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Determine credit limits based on plan definitions
      // Starter: 50 texts/mo, 10 images/mo, 2 videos/mo
      // Pro: 500 texts/mo, 100 images/mo, 20 videos/mo
      // Agency: UNLIMITED (represented as huge values e.g. 9999) or high threshold
      // Free: 10 texts, 5 images, 0 videos
      let textLimit = 10;
      let imageLimit = 5;
      let videoLimit = 0;

      if (data.plan === 'starter') {
        textLimit = 50;
        imageLimit = 25;
        videoLimit = 5;
      } else if (data.plan === 'pro') {
        textLimit = 250;
        imageLimit = 100;
        videoLimit = 20;
      } else if (data.plan === 'agency') {
        textLimit = 1000;
        imageLimit = 500;
        videoLimit = 100;
      }

      setCredits({
        textLimit,
        textUsed: Math.max(0, textLimit - data.credits_text),
        imageLimit,
        imageUsed: Math.max(0, imageLimit - data.credits_image),
        videoLimit,
        videoUsed: Math.max(0, videoLimit - data.credits_video),
        plan: data.plan as 'free' | 'starter' | 'pro' | 'agency',
      });

    } catch (err: any) {
      console.error('Error fetching credit thresholds:', err);
      setError(err.message || 'Falha ao buscar limites de créditos.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Utility to check if user has credits of a given type remaining before performing generation
  const hasRemainingCredits = useCallback((type: 'text' | 'image' | 'video'): boolean => {
    if (!credits) return false;
    if (credits.plan === 'agency') return true; // Unlimited / huge package

    if (type === 'text') {
      return credits.textLimit - credits.textUsed > 0;
    } else if (type === 'image') {
      return credits.imageLimit - credits.imageUsed > 0;
    } else if (type === 'video') {
      return credits.videoLimit - credits.videoUsed > 0;
    }
    return false;
  }, [credits]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    loading,
    error,
    refetch: fetchCredits,
    hasRemainingCredits,
  };
}
