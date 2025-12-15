import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Cache keys
export const CACHE_KEYS = {
  EXAMS: 'exams',
  SUBMISSIONS: 'submissions',
  FEEDBACK: 'feedback',
  QUESTIONS: 'questions',
  PROFILES: 'profiles',
  ANNOUNCEMENTS: 'announcements',
  DOWNLOADS: 'downloads',
  STUDY_TIPS: 'study_tips',
} as const;

// Cached exams hook
export function useCachedExams() {
  return useQuery({
    queryKey: [CACHE_KEYS.EXAMS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for exams
  });
}

// Cached active exams for students
export function useCachedActiveExams() {
  return useQuery({
    queryKey: [CACHE_KEYS.EXAMS, 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute for active exams
  });
}

// Cached submissions hook
export function useCachedSubmissions() {
  return useQuery({
    queryKey: [CACHE_KEYS.SUBMISSIONS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

// Cached feedback hook
export function useCachedFeedback() {
  return useQuery({
    queryKey: [CACHE_KEYS.FEEDBACK],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_feedback')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes for feedback
  });
}

// Cached announcements hook
export function useCachedAnnouncements() {
  return useQuery({
    queryKey: [CACHE_KEYS.ANNOUNCEMENTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes for announcements
  });
}

// Cached downloads hook
export function useCachedDownloads() {
  return useQuery({
    queryKey: [CACHE_KEYS.DOWNLOADS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('downloads_materials')
        .select('*')
        .eq('is_active', true)
        .order('order_number', { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes for downloads
  });
}

// Cached study tips hook
export function useCachedStudyTips() {
  return useQuery({
    queryKey: [CACHE_KEYS.STUDY_TIPS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_tips')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes for study tips
  });
}

// Hook to invalidate cache
export function useInvalidateCache() {
  const queryClient = useQueryClient();
  
  return {
    invalidateExams: () => queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EXAMS] }),
    invalidateSubmissions: () => queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.SUBMISSIONS] }),
    invalidateFeedback: () => queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.FEEDBACK] }),
    invalidateAnnouncements: () => queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ANNOUNCEMENTS] }),
    invalidateDownloads: () => queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.DOWNLOADS] }),
    invalidateStudyTips: () => queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.STUDY_TIPS] }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}

// Prefetch data for better UX
export function usePrefetchData() {
  const queryClient = useQueryClient();
  
  return {
    prefetchExams: async () => {
      await queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.EXAMS],
        queryFn: async () => {
          const { data } = await supabase.from('exams').select('*').order('created_at', { ascending: false });
          return data;
        },
      });
    },
    prefetchAnnouncements: async () => {
      await queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.ANNOUNCEMENTS],
        queryFn: async () => {
          const { data } = await supabase.from('announcements').select('*').eq('is_active', true);
          return data;
        },
      });
    },
  };
}