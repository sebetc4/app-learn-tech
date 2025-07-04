// Libs
import { Layout } from '../layout'
import { PAGE_PATH } from '@renderer/constants'
import { CourseImporterPage, CoursePage, ErrorPage, HomePage, LessonPage } from '@renderer/pages'
import { createHashRouter } from 'react-router-dom'

export const router = createHashRouter([
    {
        path: PAGE_PATH.ROOT,
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: PAGE_PATH.COURSES,
                children: [
                    {
                        path: `:courseId`,
                        children: [
                            {
                                index: true,
                                element: <CoursePage />
                            },
                            {
                                path: `:chapterId/:lessonId`,
                                element: <LessonPage />
                            }
                        ]
                    }
                ]
            },
            {
                path: PAGE_PATH.COURSE_MANAGER,
                element: <CourseImporterPage />
            }
        ]
    }
])
