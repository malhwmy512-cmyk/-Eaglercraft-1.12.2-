import { db } from "./db";
import {
  seeds,
  ratings,
  users,
  achievements,
  userAchievements,
  favorites,
  type Seed,
  type InsertSeed,
  type Rating,
  type InsertRating,
  type SeedResponse,
  type RatingResponse,
  type SeedsQueryParams,
  type Achievement,
  type UserAchievement,
  type Favorite
} from "@shared/schema";
import { eq, desc, sql, ilike, and, asc } from "drizzle-orm";

export interface IStorage {
  // Seeds
  getSeeds(params?: SeedsQueryParams): Promise<SeedResponse[]>;
  getFeaturedSeeds(): Promise<SeedResponse[]>;
  getSeed(id: number): Promise<SeedResponse | undefined>;
  createSeed(seed: InsertSeed, userId: string): Promise<Seed>;
  incrementViewCount(id: number): Promise<void>;
  
  // Ratings
  getRatings(seedId: number): Promise<RatingResponse[]>;
  createRating(rating: InsertRating, seedId: number, userId: string): Promise<Rating>;
  
  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement>;
  
  // Favorites
  getUserFavorites(userId: string): Promise<SeedResponse[]>;
  addFavorite(userId: string, seedId: number): Promise<Favorite>;
  removeFavorite(userId: string, seedId: number): Promise<void>;
  isFavorite(userId: string, seedId: number): Promise<boolean>;
  
  // Stats
  getUserStats(userId: string): Promise<{ seedsCreated: number; ratingsGiven: number; favoritesCount: number; totalPoints: number }>;
  getGlobalStats(): Promise<{ totalSeeds: number; totalUsers: number; totalRatings: number }>;
}

export class DatabaseStorage implements IStorage {
  async getSeeds(params?: SeedsQueryParams): Promise<SeedResponse[]> {
    let query = db.select({
      id: seeds.id,
      seedValue: seeds.seedValue,
      name: seeds.name,
      description: seeds.description,
      category: seeds.category,
      difficulty: seeds.difficulty,
      imageUrl: seeds.imageUrl,
      features: seeds.features,
      isFeatured: seeds.isFeatured,
      viewCount: seeds.viewCount,
      createdBy: seeds.createdBy,
      createdAt: seeds.createdAt,
      authorName: users.firstName,
      averageRating: sql<number>`COALESCE(avg(${ratings.score})::numeric(2,1), 0)`,
      ratingsCount: sql<number>`count(${ratings.id})`
    })
    .from(seeds)
    .leftJoin(users, eq(seeds.createdBy, users.id))
    .leftJoin(ratings, eq(seeds.id, ratings.seedId))
    .groupBy(seeds.id, users.firstName);

    // Build conditions
    const conditions = [];
    
    if (params?.search) {
      conditions.push(ilike(seeds.name, `%${params.search}%`));
    }
    
    if (params?.category) {
      conditions.push(eq(seeds.category, params.category));
    }
    
    if (params?.difficulty) {
      conditions.push(eq(seeds.difficulty, params.difficulty));
    }
    
    if (params?.featured) {
      conditions.push(eq(seeds.isFeatured, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Sorting
    let orderClause;
    switch (params?.sortBy) {
      case 'popular':
        orderClause = desc(seeds.viewCount);
        break;
      case 'rating':
        orderClause = desc(sql`avg(${ratings.score})`);
        break;
      case 'newest':
      default:
        orderClause = desc(seeds.createdAt);
    }

    const allSeeds = await query.orderBy(orderClause);

    return allSeeds.map(s => ({
      ...s,
      authorName: s.authorName || undefined,
      averageRating: Number(s.averageRating) || 0,
      ratingsCount: Number(s.ratingsCount) || 0
    }));
  }

  async getFeaturedSeeds(): Promise<SeedResponse[]> {
    return this.getSeeds({ featured: true, sortBy: 'rating' });
  }

  async getSeed(id: number): Promise<SeedResponse | undefined> {
    const [seed] = await db.select({
      id: seeds.id,
      seedValue: seeds.seedValue,
      name: seeds.name,
      description: seeds.description,
      category: seeds.category,
      difficulty: seeds.difficulty,
      imageUrl: seeds.imageUrl,
      features: seeds.features,
      isFeatured: seeds.isFeatured,
      viewCount: seeds.viewCount,
      createdBy: seeds.createdBy,
      createdAt: seeds.createdAt,
      authorName: users.firstName,
      averageRating: sql<number>`COALESCE(avg(${ratings.score})::numeric(2,1), 0)`,
      ratingsCount: sql<number>`count(${ratings.id})`
    })
    .from(seeds)
    .leftJoin(users, eq(seeds.createdBy, users.id))
    .leftJoin(ratings, eq(seeds.id, ratings.seedId))
    .where(eq(seeds.id, id))
    .groupBy(seeds.id, users.firstName);

    if (!seed) return undefined;

    return {
      ...seed,
      authorName: seed.authorName || undefined,
      averageRating: Number(seed.averageRating) || 0,
      ratingsCount: Number(seed.ratingsCount) || 0
    };
  }

  async createSeed(insertSeed: InsertSeed, userId: string): Promise<Seed> {
    const [seed] = await db
      .insert(seeds)
      .values({ ...insertSeed, createdBy: userId })
      .returning();
    return seed;
  }

  async incrementViewCount(id: number): Promise<void> {
    await db
      .update(seeds)
      .set({ viewCount: sql`${seeds.viewCount} + 1` })
      .where(eq(seeds.id, id));
  }

  async getRatings(seedId: number): Promise<RatingResponse[]> {
    const results = await db.select({
      id: ratings.id,
      seedId: ratings.seedId,
      userId: ratings.userId,
      score: ratings.score,
      comment: ratings.comment,
      createdAt: ratings.createdAt,
      username: users.firstName
    })
    .from(ratings)
    .leftJoin(users, eq(ratings.userId, users.id))
    .where(eq(ratings.seedId, seedId))
    .orderBy(desc(ratings.createdAt));

    return results.map(r => ({
      ...r,
      username: r.username || undefined
    }));
  }

  async createRating(insertRating: InsertRating, seedId: number, userId: string): Promise<Rating> {
    const [rating] = await db
      .insert(ratings)
      .values({ ...insertRating, seedId, userId })
      .returning();
    return rating;
  }

  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements).orderBy(asc(achievements.points));
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const results = await db.select({
      id: userAchievements.id,
      userId: userAchievements.userId,
      achievementId: userAchievements.achievementId,
      unlockedAt: userAchievements.unlockedAt,
      achievement: achievements
    })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId));

    return results;
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    // Check if already unlocked
    const existing = await db.select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));
    
    if (existing.length > 0) {
      return existing[0];
    }

    const [unlocked] = await db
      .insert(userAchievements)
      .values({ userId, achievementId })
      .returning();
    return unlocked;
  }

  async getUserFavorites(userId: string): Promise<SeedResponse[]> {
    const userFavs = await db.select({ seedId: favorites.seedId })
      .from(favorites)
      .where(eq(favorites.userId, userId));
    
    if (userFavs.length === 0) return [];
    
    const seedIds = userFavs.map(f => f.seedId);
    const allSeeds = await this.getSeeds();
    return allSeeds.filter(s => seedIds.includes(s.id));
  }

  async addFavorite(userId: string, seedId: number): Promise<Favorite> {
    const existing = await db.select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.seedId, seedId)));
    
    if (existing.length > 0) return existing[0];

    const [fav] = await db.insert(favorites)
      .values({ userId, seedId })
      .returning();
    return fav;
  }

  async removeFavorite(userId: string, seedId: number): Promise<void> {
    await db.delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.seedId, seedId)));
  }

  async isFavorite(userId: string, seedId: number): Promise<boolean> {
    const result = await db.select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.seedId, seedId)));
    return result.length > 0;
  }

  async getUserStats(userId: string): Promise<{ seedsCreated: number; ratingsGiven: number; favoritesCount: number; totalPoints: number }> {
    const [seedsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(seeds)
      .where(eq(seeds.createdBy, userId));
    
    const [ratingsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(eq(ratings.userId, userId));
    
    const [favsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(favorites)
      .where(eq(favorites.userId, userId));
    
    const userAchievs = await this.getUserAchievements(userId);
    const totalPoints = userAchievs.reduce((sum, ua) => sum + (ua.achievement?.points || 0), 0);

    return {
      seedsCreated: Number(seedsResult?.count) || 0,
      ratingsGiven: Number(ratingsResult?.count) || 0,
      favoritesCount: Number(favsResult?.count) || 0,
      totalPoints
    };
  }

  async getGlobalStats(): Promise<{ totalSeeds: number; totalUsers: number; totalRatings: number }> {
    const [seedsResult] = await db.select({ count: sql<number>`count(*)` }).from(seeds);
    const [usersResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [ratingsResult] = await db.select({ count: sql<number>`count(*)` }).from(ratings);

    return {
      totalSeeds: Number(seedsResult?.count) || 0,
      totalUsers: Number(usersResult?.count) || 0,
      totalRatings: Number(ratingsResult?.count) || 0
    };
  }
}

export const storage = new DatabaseStorage();
