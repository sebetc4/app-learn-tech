import {
    chapters,
    codeSnippets,
    courseHistory,
    courseProgress,
    courses,
    lessonProgress,
    lessonProgressStatus,
    lessonTypes,
    lessons,
    resourceTypes,
    resources,
    settingKeys,
    settings,
    themes,
    users
} from '@/database/schemas'

export type Theme = (typeof themes)[number]
export type SettingKey = (typeof settingKeys)[number]
export type ResourceType = (typeof resourceTypes)[number]
export type LessonType = (typeof lessonTypes)[number]
export type LessonProgressStatus = (typeof lessonProgressStatus)[number]
export type Chapter = typeof chapters.$inferSelect
export type CodeSnippet = typeof codeSnippets.$inferSelect
export type CourseProgress = typeof courseProgress.$inferSelect
export type Course = typeof courses.$inferInsert
export type LessonProgress = typeof lessonProgress.$inferSelect
export type Lesson = typeof lessons.$inferSelect
export type Resource = typeof resources.$inferInsert
export type Setting = typeof settings.$inferSelect
export type User = typeof users.$inferInsert
export type CourseHistoryEntry = typeof courseHistory.$inferSelect
