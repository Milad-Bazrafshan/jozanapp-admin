import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PermissionRoute } from '@/auth/PermissionRoute'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/features/auth/LoginPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ForbiddenPage, NotFoundPage } from '@/features/errors/ErrorPages'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { BranchesPage } from '@/features/organization/BranchesPage'
import { RolesPage } from '@/features/organization/RolesPage'
import { UsersPage } from '@/features/organization/UsersPage'
import { StudentsPage } from '@/features/people/StudentsPage'
import { InstructorsPage } from '@/features/people/InstructorsPage'
import { GuardiansPage } from '@/features/people/GuardiansPage'
import { CoursesPage, PeriodsPage, ProgramsPage } from '@/features/academic/AcademicPages'
import { OfferingsPage, SectionsPage } from '@/features/classroom/ClassroomPages'
import { EnrollmentsPage } from '@/features/enrollment/EnrollmentsPage'
import { LocationsPage, RulesPage, SessionsPage } from '@/features/scheduling/SchedulePages'
import { AttendancePage, AttendanceSheetPage } from '@/features/attendance/AttendancePages'
import { AssessmentDetailPage, AssessmentsPage, GradingPage, QuestionsPage } from '@/features/assessment/AssessmentPages'
import { FinanceBalancesPage, FinanceChargesPage, FinanceInvoicesPage, FinancePaymentsPage } from '@/features/finance/FinancePages'
import {
  AnnouncementsPage,
  LedgerAccountsPage,
  LedgerVouchersPage,
  ReportCardsAdminPage,
  RequestQueuePage,
  StudentCardsPage,
  SurveysPage,
  TrialBalancePage,
  WorkflowsPage,
} from '@/features/platform/PlatformPages'
import { CounselingAdminReportsPage, CounselingAssignmentsPage, CounselingSupervisionsPage } from '@/features/counseling/CounselingPages'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/forbidden', element: <ForbiddenPage /> },
          { path: '/settings', element: <SettingsPage /> },
          {
            element: <PermissionRoute anyOf={['ORGANIZATION_READ']} />,
            children: [{ path: '/branches', element: <BranchesPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['ROLE_READ']} />,
            children: [{ path: '/roles', element: <RolesPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['USER_READ']} />,
            children: [{ path: '/users', element: <UsersPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['PEOPLE_READ']} />,
            children: [
              { path: '/people/students', element: <StudentsPage /> },
              { path: '/people/instructors', element: <InstructorsPage /> },
              { path: '/people/guardians', element: <GuardiansPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['ACADEMIC_READ']} />,
            children: [
              { path: '/academic', element: <Navigate to="/academic/periods" replace /> },
              { path: '/academic/periods', element: <PeriodsPage /> },
              { path: '/academic/programs', element: <ProgramsPage /> },
              { path: '/academic/courses', element: <CoursesPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['CLASS_READ']} />,
            children: [
              { path: '/classes', element: <Navigate to="/classes/sections" replace /> },
              { path: '/classes/offerings', element: <OfferingsPage /> },
              { path: '/classes/sections', element: <SectionsPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['ENROLLMENT_READ']} />,
            children: [{ path: '/enrollments', element: <EnrollmentsPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['SCHEDULE_READ']} />,
            children: [
              { path: '/schedule', element: <Navigate to="/schedule/sessions" replace /> },
              { path: '/schedule/locations', element: <LocationsPage /> },
              { path: '/schedule/rules', element: <RulesPage /> },
              { path: '/schedule/sessions', element: <SessionsPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['ATTENDANCE_READ']} />,
            children: [
              { path: '/attendance', element: <AttendancePage /> },
              { path: '/attendance/:sessionId', element: <AttendanceSheetPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['QUESTION_READ']} />,
            children: [{ path: '/questions', element: <QuestionsPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['ASSESSMENT_READ']} />,
            children: [
              { path: '/assessments', element: <AssessmentsPage /> },
              { path: '/assessments/:id', element: <AssessmentDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['GRADING_READ']} />,
            children: [
              { path: '/grading', element: <GradingPage /> },
              { path: '/assessments/:assessmentId/grading', element: <GradingPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['FINANCE_READ']} />,
            children: [
              { path: '/finance', element: <Navigate to="/finance/balances" replace /> },
              { path: '/finance/balances', element: <FinanceBalancesPage /> },
              { path: '/finance/charges', element: <FinanceChargesPage /> },
              { path: '/finance/invoices', element: <FinanceInvoicesPage /> },
              { path: '/finance/payments', element: <FinancePaymentsPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['LEDGER_READ']} />,
            children: [
              { path: '/finance/accounts', element: <LedgerAccountsPage /> },
              { path: '/finance/vouchers', element: <LedgerVouchersPage /> },
              { path: '/finance/trial-balance', element: <TrialBalancePage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['NOTIFICATION_READ']} />,
            children: [{ path: '/announcements', element: <AnnouncementsPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['REPORT_CARD_READ']} />,
            children: [{ path: '/report-cards', element: <ReportCardsAdminPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['WORKFLOW_READ']} />,
            children: [{ path: '/workflows', element: <WorkflowsPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['WORKFLOW_APPROVE']} />,
            children: [{ path: '/requests', element: <RequestQueuePage /> }],
          },
          {
            element: <PermissionRoute anyOf={['SURVEY_READ']} />,
            children: [{ path: '/surveys', element: <SurveysPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['STUDENT_CARD_READ']} />,
            children: [{ path: '/student-cards', element: <StudentCardsPage /> }],
          },
          {
            element: <PermissionRoute anyOf={['COUNSELING_ASSIGN']} />,
            children: [
              { path: '/counseling/assignments', element: <CounselingAssignmentsPage /> },
              { path: '/counseling/supervisions', element: <CounselingSupervisionsPage /> },
            ],
          },
          {
            element: <PermissionRoute anyOf={['COUNSELING_ADMIN_REPORT_READ']} />,
            children: [{ path: '/counseling/reports', element: <CounselingAdminReportsPage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
