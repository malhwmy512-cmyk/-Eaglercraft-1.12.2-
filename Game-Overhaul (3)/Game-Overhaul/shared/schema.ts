import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

// Seed categories enum
export const SEED_CATEGORIES = [
  'survival',
  'adventure', 
  'building',
  'exploration',
  'challenge',
  'resource',
  'village',
  'spawn'
] as const;

export type SeedCategory = typeof SEED_CATEGORIES[number];

export const seeds = pgTable("seeds", {
  id: serial("id").primaryKey(),
  seedValue: text("seed_value").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").default('survival'),
  difficulty: integer("difficulty").default(3), // 1-5
  imageUrl: text("image_url"),
  features: text("features"), // JSON array of features
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  seedId: integer("seed_id").references(() => seeds.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").references(() => users.id),
  score: integer("score").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements system
export const ACHIEVEMENT_TYPES = [
  'explorer',
  'collector', 
  'builder',
  'warrior',
  'social',
  'legendary'
] as const;

export type AchievementType = typeof ACHIEVEMENT_TYPES[number];

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // Icon name from lucide
  type: text("type").default('explorer'),
  points: integer("points").default(10),
  requirement: text("requirement"), // JSON describing how to unlock
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Favorites system
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  seedId: integer("seed_id").references(() => seeds.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const seedsRelations = relations(seeds, ({ one, many }) => ({
  author: one(users, {
    fields: [seeds.createdBy],
    references: [users.id],
  }),
  ratings: many(ratings),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  seed: one(seeds, {
    fields: [ratings.seedId],
    references: [seeds.id],
  }),
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertSeedSchema = createInsertSchema(seeds).omit({ 
  id: true, 
  createdAt: true,
  createdBy: true 
});

export const insertRatingSchema = createInsertSchema(ratings).omit({ 
  id: true, 
  createdAt: true, 
  userId: true,
  seedId: true
});

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type Seed = typeof seeds.$inferSelect;
export type InsertSeed = z.infer<typeof insertSeedSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;

// Request types
export type CreateSeedRequest = InsertSeed;
export type CreateRatingRequest = InsertRating;

// Response types
export type SeedResponse = Seed & { 
  authorName?: string; 
  averageRating?: number;
  ratingsCount?: number;
};
export type RatingResponse = Rating & { username?: string };

export type SeedsListResponse = SeedResponse[];
export type RatingsListResponse = RatingResponse[];

// Query params for filtering seeds
export interface SeedsQueryParams {
  search?: string;
  category?: SeedCategory;
  difficulty?: number;
  sortBy?: 'newest' | 'popular' | 'rating';
  featured?: boolean;
}
