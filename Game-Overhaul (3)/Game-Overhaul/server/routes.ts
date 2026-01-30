import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { SEED_CATEGORIES, type SeedsQueryParams, type SeedCategory } from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Get categories list
  app.get('/api/categories', (req, res) => {
    res.json(SEED_CATEGORIES);
  });

  // Seeds with filtering
  app.get(api.seeds.list.path, async (req, res) => {
    const params: SeedsQueryParams = {
      search: req.query.search as string | undefined,
      category: req.query.category as SeedCategory | undefined,
      difficulty: req.query.difficulty ? Number(req.query.difficulty) : undefined,
      sortBy: req.query.sortBy as 'newest' | 'popular' | 'rating' | undefined,
      featured: req.query.featured === 'true'
    };
    
    const seeds = await storage.getSeeds(params);
    res.json(seeds);
  });

  // Featured seeds
  app.get('/api/seeds/featured', async (req, res) => {
    const seeds = await storage.getFeaturedSeeds();
    res.json(seeds);
  });

  app.get(api.seeds.get.path, async (req, res) => {
    const seed = await storage.getSeed(Number(req.params.id));
    if (!seed) {
      return res.status(404).json({ message: 'Seed not found' });
    }
    // Increment view count
    await storage.incrementViewCount(Number(req.params.id));
    res.json(seed);
  });

  app.post(api.seeds.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.seeds.create.input.parse(req.body);
      // @ts-ignore - req.user is added by auth middleware
      const userId = req.user.claims.sub;
      const seed = await storage.createSeed(input, userId);
      res.status(201).json(seed);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Ratings
  app.get(api.ratings.list.path, async (req, res) => {
    const ratings = await storage.getRatings(Number(req.params.seedId));
    res.json(ratings);
  });

  app.post(api.ratings.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.ratings.create.input.parse(req.body);
      const seedId = Number(req.params.seedId);
      // @ts-ignore
      const userId = req.user.claims.sub;
      
      const rating = await storage.createRating(input, seedId, userId);
      res.status(201).json(rating);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Achievements
  app.get('/api/achievements', async (req, res) => {
    const achievementsList = await storage.getAchievements();
    res.json(achievementsList);
  });

  app.get('/api/achievements/user', isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const userAchievements = await storage.getUserAchievements(userId);
    res.json(userAchievements);
  });

  app.post('/api/achievements/:id/unlock', isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const achievementId = Number(req.params.id);
    const unlocked = await storage.unlockAchievement(userId, achievementId);
    res.json(unlocked);
  });

  // Favorites
  app.get('/api/favorites', isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const favs = await storage.getUserFavorites(userId);
    res.json(favs);
  });

  app.post('/api/favorites/:seedId', isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const seedId = Number(req.params.seedId);
    const fav = await storage.addFavorite(userId, seedId);
    res.json(fav);
  });

  app.delete('/api/favorites/:seedId', isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const seedId = Number(req.params.seedId);
    await storage.removeFavorite(userId, seedId);
    res.json({ success: true });
  });

  app.get('/api/favorites/:seedId/check', isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const seedId = Number(req.params.seedId);
    const isFav = await storage.isFavorite(userId, seedId);
    res.json({ isFavorite: isFav });
  });

  // Stats
  app.get('/api/stats', async (req, res) => {
    const stats = await storage.getGlobalStats();
    res.json(stats);
  });

  app.get('/api/stats/user', isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const stats = await storage.getUserStats(userId);
    res.json(stats);
  });

  return httpServer;
}
