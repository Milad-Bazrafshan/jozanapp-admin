import {
  BookOpen,
  Building2,
  CalendarDays,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Permission } from '@/api/types'

export type NavChild = {
  id: string
  to: string
  labelKey: string
  anyOf: Permission[]
}

export type NavGroup = {
  id: string
  labelKey: string
  icon: LucideIcon
  children: NavChild[]
}

export const navGroups: NavGroup[] = [
  {
    id: 'main',
    labelKey: 'nav.main',
    icon: LayoutDashboard,
    children: [{ id: 'dashboard', to: '/', labelKey: 'nav.dashboard', anyOf: [] }],
  },
  {
    id: 'people',
    labelKey: 'nav.people',
    icon: Users,
    children: [
      { id: 'instructors', to: '/people/instructors', labelKey: 'nav.instructors', anyOf: ['PEOPLE_READ'] },
      { id: 'students', to: '/people/students', labelKey: 'nav.students', anyOf: ['PEOPLE_READ'] },
      { id: 'guardians', to: '/people/guardians', labelKey: 'nav.guardians', anyOf: ['PEOPLE_READ'] },
    ],
  },
  {
    id: 'organization',
    labelKey: 'nav.organization',
    icon: Building2,
    children: [
      { id: 'users', to: '/users', labelKey: 'nav.users', anyOf: ['USER_READ'] },
      { id: 'branches', to: '/branches', labelKey: 'nav.branches', anyOf: ['ORGANIZATION_READ'] },
      { id: 'roles', to: '/roles', labelKey: 'nav.roles', anyOf: ['ROLE_READ'] },
    ],
  },
  {
    id: 'academic',
    labelKey: 'nav.academic',
    icon: BookOpen,
    children: [
      { id: 'periods', to: '/academic/periods', labelKey: 'nav.periods', anyOf: ['ACADEMIC_READ'] },
      { id: 'programs', to: '/academic/programs', labelKey: 'nav.programs', anyOf: ['ACADEMIC_READ'] },
      { id: 'courses', to: '/academic/courses', labelKey: 'nav.courses', anyOf: ['ACADEMIC_READ'] },
    ],
  },
  {
    id: 'classes',
    labelKey: 'nav.classes',
    icon: GraduationCap,
    children: [
      { id: 'offerings', to: '/classes/offerings', labelKey: 'nav.offerings', anyOf: ['CLASS_READ'] },
      { id: 'sections', to: '/classes/sections', labelKey: 'nav.sections', anyOf: ['CLASS_READ'] },
      { id: 'enrollments', to: '/enrollments', labelKey: 'nav.enrollments', anyOf: ['ENROLLMENT_READ'] },
    ],
  },
  {
    id: 'schedule',
    labelKey: 'nav.schedule',
    icon: CalendarDays,
    children: [
      { id: 'locations', to: '/schedule/locations', labelKey: 'nav.locations', anyOf: ['SCHEDULE_READ'] },
      { id: 'rules', to: '/schedule/rules', labelKey: 'nav.rules', anyOf: ['SCHEDULE_READ'] },
      { id: 'sessions', to: '/schedule/sessions', labelKey: 'nav.sessions', anyOf: ['SCHEDULE_READ'] },
      { id: 'attendance', to: '/attendance', labelKey: 'nav.attendance', anyOf: ['ATTENDANCE_READ'] },
    ],
  },
  {
    id: 'assessments',
    labelKey: 'nav.assessments',
    icon: FileQuestion,
    children: [
      { id: 'questions', to: '/questions', labelKey: 'nav.questions', anyOf: ['QUESTION_READ'] },
      { id: 'assessmentList', to: '/assessments', labelKey: 'nav.assessmentList', anyOf: ['ASSESSMENT_READ'] },
      { id: 'grading', to: '/grading', labelKey: 'nav.grading', anyOf: ['GRADING_READ'] },
    ],
  },
  {
    id: 'finance',
    labelKey: 'nav.finance',
    icon: Wallet,
    children: [
      { id: 'balances', to: '/finance/balances', labelKey: 'nav.balances', anyOf: ['FINANCE_READ'] },
      { id: 'charges', to: '/finance/charges', labelKey: 'nav.charges', anyOf: ['FINANCE_READ'] },
      { id: 'invoices', to: '/finance/invoices', labelKey: 'nav.invoices', anyOf: ['FINANCE_READ'] },
      { id: 'payments', to: '/finance/payments', labelKey: 'nav.payments', anyOf: ['FINANCE_READ'] },
      { id: 'accounts', to: '/finance/accounts', labelKey: 'nav.accounts', anyOf: ['LEDGER_READ'] },
      { id: 'vouchers', to: '/finance/vouchers', labelKey: 'nav.vouchers', anyOf: ['LEDGER_READ'] },
      { id: 'trial', to: '/finance/trial-balance', labelKey: 'nav.trial', anyOf: ['LEDGER_READ'] },
    ],
  },
  {
    id: 'comms',
    labelKey: 'nav.comms',
    icon: Megaphone,
    children: [
      { id: 'announcements', to: '/announcements', labelKey: 'nav.announcements', anyOf: ['NOTIFICATION_READ'] },
      { id: 'reportCards', to: '/report-cards', labelKey: 'nav.reportCards', anyOf: ['REPORT_CARD_READ'] },
      { id: 'workflows', to: '/workflows', labelKey: 'nav.workflows', anyOf: ['WORKFLOW_READ'] },
      { id: 'requests', to: '/requests', labelKey: 'nav.requests', anyOf: ['WORKFLOW_APPROVE'] },
      { id: 'surveys', to: '/surveys', labelKey: 'nav.surveys', anyOf: ['SURVEY_READ'] },
      { id: 'cards', to: '/student-cards', labelKey: 'nav.studentCards', anyOf: ['STUDENT_CARD_READ'] },
      { id: 'counselingAssign', to: '/counseling/assignments', labelKey: 'nav.counselingAssign', anyOf: ['COUNSELING_ASSIGN'] },
      { id: 'counselingSupervision', to: '/counseling/supervisions', labelKey: 'nav.counselingSupervision', anyOf: ['COUNSELING_ASSIGN'] },
      { id: 'counselingReports', to: '/counseling/reports', labelKey: 'nav.counselingReports', anyOf: ['COUNSELING_ADMIN_REPORT_READ'] },
    ],
  },
  {
    id: 'system',
    labelKey: 'nav.system',
    icon: Settings,
    children: [{ id: 'settings', to: '/settings', labelKey: 'nav.settings', anyOf: [] }],
  },
]

export const pageMeta: Record<string, { titleKey: string; subtitleKey: string }> = {
  '/': { titleKey: 'page.dashboard.title', subtitleKey: 'page.dashboard.subtitle' },
  '/branches': { titleKey: 'page.branches.title', subtitleKey: 'page.branches.subtitle' },
  '/roles': { titleKey: 'page.roles.title', subtitleKey: 'page.roles.subtitle' },
  '/users': { titleKey: 'page.users.title', subtitleKey: 'page.users.subtitle' },
  '/people/students': { titleKey: 'page.students.title', subtitleKey: 'page.students.subtitle' },
  '/people/instructors': { titleKey: 'page.instructors.title', subtitleKey: 'page.instructors.subtitle' },
  '/people/guardians': { titleKey: 'page.guardians.title', subtitleKey: 'page.guardians.subtitle' },
  '/academic/periods': { titleKey: 'page.periods.title', subtitleKey: 'page.periods.subtitle' },
  '/academic/programs': { titleKey: 'page.programs.title', subtitleKey: 'page.programs.subtitle' },
  '/academic/courses': { titleKey: 'page.courses.title', subtitleKey: 'page.courses.subtitle' },
  '/classes/offerings': { titleKey: 'page.offerings.title', subtitleKey: 'page.offerings.subtitle' },
  '/classes/sections': { titleKey: 'page.sections.title', subtitleKey: 'page.sections.subtitle' },
  '/enrollments': { titleKey: 'page.enrollments.title', subtitleKey: 'page.enrollments.subtitle' },
  '/schedule/locations': { titleKey: 'page.locations.title', subtitleKey: 'page.locations.subtitle' },
  '/schedule/rules': { titleKey: 'page.rules.title', subtitleKey: 'page.rules.subtitle' },
  '/schedule/sessions': { titleKey: 'page.sessions.title', subtitleKey: 'page.sessions.subtitle' },
  '/attendance': { titleKey: 'page.attendance.title', subtitleKey: 'page.attendance.subtitle' },
  '/questions': { titleKey: 'page.questions.title', subtitleKey: 'page.questions.subtitle' },
  '/assessments': { titleKey: 'page.assessments.title', subtitleKey: 'page.assessments.subtitle' },
  '/grading': { titleKey: 'page.grading.title', subtitleKey: 'page.grading.subtitle' },
  '/finance/balances': { titleKey: 'page.balances.title', subtitleKey: 'page.balances.subtitle' },
  '/finance/charges': { titleKey: 'page.charges.title', subtitleKey: 'page.charges.subtitle' },
  '/finance/invoices': { titleKey: 'page.invoices.title', subtitleKey: 'page.invoices.subtitle' },
  '/finance/payments': { titleKey: 'page.payments.title', subtitleKey: 'page.payments.subtitle' },
  '/finance/accounts': { titleKey: 'page.accounts.title', subtitleKey: 'page.accounts.subtitle' },
  '/finance/vouchers': { titleKey: 'page.vouchers.title', subtitleKey: 'page.vouchers.subtitle' },
  '/finance/trial-balance': { titleKey: 'page.trial.title', subtitleKey: 'page.trial.subtitle' },
  '/announcements': { titleKey: 'page.announcements.title', subtitleKey: 'page.announcements.subtitle' },
  '/report-cards': { titleKey: 'page.reportCards.title', subtitleKey: 'page.reportCards.subtitle' },
  '/workflows': { titleKey: 'page.workflows.title', subtitleKey: 'page.workflows.subtitle' },
  '/requests': { titleKey: 'page.requests.title', subtitleKey: 'page.requests.subtitle' },
  '/surveys': { titleKey: 'page.surveys.title', subtitleKey: 'page.surveys.subtitle' },
  '/student-cards': { titleKey: 'page.cards.title', subtitleKey: 'page.cards.subtitle' },
  '/counseling/assignments': { titleKey: 'counseling.assignTitle', subtitleKey: 'counseling.assignSubtitle' },
  '/counseling/supervisions': { titleKey: 'counseling.supervisionTitle', subtitleKey: 'counseling.supervisionSubtitle' },
  '/counseling/reports': { titleKey: 'counseling.adminReportsTitle', subtitleKey: 'counseling.adminReportsSubtitle' },
  '/settings': { titleKey: 'page.settings.title', subtitleKey: 'page.settings.subtitle' },
}
