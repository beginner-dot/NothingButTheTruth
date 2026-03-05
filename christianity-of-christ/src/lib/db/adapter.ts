import { HabitEntry, Reflection, UserProgress } from "@/lib/types";

export interface DataAdapter {
  getProgress(userId: string): Promise<UserProgress | null>;
  upsertProgress(progress: UserProgress): Promise<UserProgress>;
  addHabitEntry(userId: string, entry: HabitEntry): Promise<void>;
  listHabitEntries(userId: string): Promise<HabitEntry[]>;
  addReflection(userId: string, reflection: Reflection): Promise<void>;
  listReflections(userId: string): Promise<Reflection[]>;
}
