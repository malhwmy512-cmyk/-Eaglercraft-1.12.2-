import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { SeedResponse, SeedsQueryParams, SeedCategory } from "@shared/schema";

type CreateSeedRequest = {
  seedValue: string;
  name: string;
  description?: string | null;
  category?: string | null;
  difficulty?: number | null;
  imageUrl?: string | null;
  features?: string | null;
};

type CreateRatingRequest = {
  score: number;
  comment?: string | null;
};

// Fetch all seeds with optional filters
export function useSeeds(params?: SeedsQueryParams) {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set('search', params.search);
  if (params?.category) queryParams.set('category', params.category);
  if (params?.difficulty) queryParams.set('difficulty', String(params.difficulty));
  if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params?.featured) queryParams.set('featured', 'true');

  const queryString = queryParams.toString();
  const url = `/api/seeds${queryString ? `?${queryString}` : ''}`;

  return useQuery<SeedResponse[]>({
    queryKey: ['/api/seeds', params],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch seeds");
      return await res.json();
    },
  });
}

// Fetch featured seeds
export function useFeaturedSeeds() {
  return useQuery<SeedResponse[]>({
    queryKey: ['/api/seeds/featured'],
    queryFn: async () => {
      const res = await fetch('/api/seeds/featured');
      if (!res.ok) throw new Error('Failed to fetch featured seeds');
      return res.json();
    },
  });
}

// Fetch single seed
export function useSeed(id: number) {
  return useQuery<SeedResponse | null>({
    queryKey: ['/api/seeds', id],
    queryFn: async () => {
      const res = await fetch(`/api/seeds/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch seed");
      return await res.json();
    },
    enabled: !!id,
  });
}

// Fetch categories
export function useCategories() {
  return useQuery<SeedCategory[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  });
}

// Create new seed
export function useCreateSeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSeedRequest) => {
      const res = await fetch(api.seeds.create.path, {
        method: api.seeds.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          const error = await res.json();
          throw new Error(error.message);
        }
        throw new Error("Failed to create seed");
      }
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/seeds'] }),
  });
}

// Fetch ratings for a seed
export function useRatings(seedId: number) {
  return useQuery({
    queryKey: [api.ratings.list.path, seedId],
    queryFn: async () => {
      const url = buildUrl(api.ratings.list.path, { seedId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch ratings");
      return await res.json();
    },
    enabled: !!seedId,
  });
}

// Create rating
export function useCreateRating(seedId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRatingRequest) => {
      const payload = {
        ...data,
        score: Number(data.score)
      };
      
      const url = buildUrl(api.ratings.create.path, { seedId });
      const res = await fetch(url, {
        method: api.ratings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit rating");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seeds', seedId] });
      queryClient.invalidateQueries({ queryKey: ['/api/seeds'] });
      queryClient.invalidateQueries({ queryKey: [api.ratings.list.path, seedId] });
    },
  });
}
