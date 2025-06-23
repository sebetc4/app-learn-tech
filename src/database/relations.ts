import { chapters, codeSnippets, courseHistory, courseProgress, courses, lessonProgress, lessons, resources, users } from './schemas';
import { relations } from 'drizzle-orm/relations';





export const chaptersRelations = relations(chapters, ({ one, many }) => ({
    course: one(courses, {
        fields: [chapters.courseId],
        references: [courses.id]
    }),
    lessons: many(lessons)
}))

export const coursesRelations = relations(courses, ({ many }) => ({
    chapters: many(chapters),
    lessons: many(lessons),
    courseProgresses: many(courseProgress),
    lessonProgresses: many(lessonProgress),
    courseHistory: many(courseHistory)
}))

export const courseHistoryRelations = relations(courseHistory, ({ one }) => ({
    user: one(users, {
        fields: [courseHistory.userId],
        references: [users.id]
    }),
    course: one(courses, {
        fields: [courseHistory.courseId],
        references: [courses.id]
    })
}))

export const codeSnippetsRelations = relations(codeSnippets, ({ one }) => ({
    lesson: one(lessons, {
        fields: [codeSnippets.lessonId],
        references: [lessons.id]
    })
}))

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    codeSnippets: many(codeSnippets),
    course: one(courses, {
        fields: [lessons.courseId],
        references: [courses.id]
    }),
    chapter: one(chapters, {
        fields: [lessons.chapterId],
        references: [chapters.id]
    }),
    resources: many(resources),
    lessonProgresses: many(lessonProgress)
}))

export const resourcesRelations = relations(resources, ({ one }) => ({
    lesson: one(lessons, {
        fields: [resources.lessonId],
        references: [lessons.id]
    })
}))

export const courseProgressRelations = relations(courseProgress, ({ one }) => ({
    user: one(users, {
        fields: [courseProgress.userId],
        references: [users.id]
    }),
    course: one(courses, {
        fields: [courseProgress.courseId],
        references: [courses.id]
    })
}))

export const usersRelations = relations(users, ({ many }) => ({
    courseProgresses: many(courseProgress),
    lessonProgresses: many(lessonProgress),
    courseHistory: many(courseHistory)
}))

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
    user: one(users, {
        fields: [lessonProgress.userId],
        references: [users.id]
    }),
    lesson: one(lessons, {
        fields: [lessonProgress.lessonId],
        references: [lessons.id]
    }),
    course: one(courses, {
        fields: [lessonProgress.courseId],
        references: [courses.id]
    })
}))