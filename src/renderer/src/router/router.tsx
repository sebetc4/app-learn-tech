// Libs
import { CoursePage } from '../pages/CoursePage/CoursePage'
import App from '@renderer/App'
import { PAGE_PATH } from '@renderer/constants'
import { CourseImporterPage, ErrorPage, HomePage, ProfilePage } from '@renderer/pages'
import { createHashRouter } from 'react-router-dom'

export const router = createHashRouter([
    {
        path: PAGE_PATH.ROOT,
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: `${PAGE_PATH.COURSES}/:courseId`,
                element: <CoursePage />
            },
            {
                path: PAGE_PATH.COURSE_MANAGER,
                element: <CourseImporterPage />
            },
            {
                path: PAGE_PATH.PROFILE,
                element: <ProfilePage />
            }
        ]
    }
])
