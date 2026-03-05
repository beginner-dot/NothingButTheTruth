import { prisma } from "@/lib/db/client";
import { DataAdapter } from "@/lib/db/adapter";
import { HabitEntry, Reflection, UserProgress } from "@/lib/types";

export class SqliteAdapter implements DataAdapter {
  async getProgress(userId: string): Promise<UserProgress | null> {
    try {
      const item = await prisma.userProgress.findUnique({ where: { userId } });
      return item ? (JSON.parse(item.data) as UserProgress) : null;
    } catch {
      return null;
    }
  }

  async upsertProgress(progress: UserProgress): Promise<UserProgress> {
    try {
      await prisma.userProgress.upsert({
        where: { userId: progress.userId },
        update: { data: JSON.stringify(progress) },
        create: { userId: progress.userId, data: JSON.stringify(progress) },
      });
    } catch {
      return progress;
    }
    return progress;
  }

  async addHabitEntry(userId: string, entry: HabitEntry): Promise<void> {
    try {
      await prisma.habitEntry.create({
        data: {
          userId,
          habitId: entry.habitId,
          status: entry.status,
          createdAt: new Date(entry.createdAt),
        },
      });
    } catch {
      return;
    }
  }

  async listHabitEntries(userId: string): Promise<HabitEntry[]> {
    try {
      const rows = await prisma.habitEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100 });
      return rows.map((row: (typeof rows)[number]) => ({
        habitId: row.habitId,
        status: row.status as HabitEntry["status"],
        createdAt: row.createdAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }

  async addReflection(userId: string, reflection: Reflection): Promise<void> {
    try {
      await prisma.reflectionEntry.create({
        data: {
          userId,
          reflectionId: reflection.id,
          lessonId: reflection.lessonId,
          text: reflection.text,
          mood: reflection.mood ?? "neutral",
          createdAt: new Date(reflection.createdAt),
        },
      });
    } catch {
      return;
    }
  }

  async listReflections(userId: string): Promise<Reflection[]> {
    try {
      const rows = await prisma.reflectionEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      return rows.map((row: (typeof rows)[number]) => ({
        id: row.reflectionId,
        lessonId: row.lessonId,
        text: row.text,
        mood: row.mood as Reflection["mood"],
        createdAt: row.createdAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }
}
