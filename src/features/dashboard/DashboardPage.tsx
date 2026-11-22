import { Link } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Megaphone,
  Receipt,
  Users,
  Wallet,
  FileBadge,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { academicApi } from '@/api/academic'
import { assessmentApi } from '@/api/assessment'
import { classroomApi } from '@/api/classroom'
import { financeApi } from '@/api/finance'
import { organizationApi } from '@/api/organization'
import { peopleApi } from '@/api/people'
import { schedulingApi } from '@/api/scheduling'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/auth/useAuth'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageSpinner, QueryError } from '@/components/ui/Spinner'
import { formatDate, formatMoney, useLocale } from '@/lib/format'
import type { Permission } from '@/api/types'

type Action = {
  to: string
  title: string
  hint: string
  icon: LucideIcon
  anyOf: Permission[]
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const auth = useAuth()
  const canOrg = auth.hasPermission('ORGANIZATION_READ')
  const canPeople = auth.hasPermission('PEOPLE_READ')
  const canClass = auth.hasPermission('CLASS_READ')
  const canAssess = auth.hasPermission('ASSESSMENT_READ')
  const canSchedule = auth.hasPermission('SCHEDULE_READ')
  const canFinance = auth.hasPermission('FINANCE_READ')

  const results = useQueries({
    queries: [
      { queryKey: queryKeys.organization, queryFn: organizationApi.current, enabled: canOrg },
      { queryKey: queryKeys.branches, queryFn: organizationApi.branches, enabled: canOrg },
      { queryKey: queryKeys.people, queryFn: peopleApi.list, enabled: canPeople },
      { queryKey: queryKeys.classroom, queryFn: classroomApi.list, enabled: canClass },
      { queryKey: queryKeys.assessments, queryFn: assessmentApi.assessments, enabled: canAssess },
      { queryKey: queryKeys.scheduling, queryFn: schedulingApi.list, enabled: canSchedule },
      { queryKey: queryKeys.academic, queryFn: academicApi.list, enabled: auth.hasPermission('ACADEMIC_READ') },
      { queryKey: queryKeys.finance, queryFn: financeApi.overview, enabled: canFinance },
    ],
  })

  const loading = results.some((item) => item.isLoading)
  const error = results.find((item) => item.error)?.error
  if (loading) return <PageSpinner label={t('common.loading')} />
  if (error) return <QueryError message={error instanceof Error ? error.message : t('common.retry')} />

  const organization = results[0].data
  const branches = results[1].data ?? []
  const people = results[2].data
  const classroom = results[3].data
  const assessments = results[4].data ?? []
  const scheduling = results[5].data
  const finance = results[7].data
  const sessions = (scheduling?.sessions ?? []).filter((item) => ['PLANNED', 'CONFIRMED'].includes(item.status)).slice(0, 6)

  const allActions: Action[] = [
    { to: '/users', title: t('dashboard.actionUsers'), hint: t('dashboard.actionUsersHint'), icon: Building2, anyOf: ['USER_READ'] },
    { to: '/people/instructors', title: t('dashboard.actionInstructors'), hint: t('dashboard.actionInstructorsHint'), icon: GraduationCap, anyOf: ['PEOPLE_READ'] },
    { to: '/people/students', title: t('dashboard.actionPeople'), hint: t('dashboard.actionPeopleHint'), icon: Users, anyOf: ['PEOPLE_READ'] },
    { to: '/classes/sections', title: t('dashboard.actionClasses'), hint: t('dashboard.actionClassesHint'), icon: GraduationCap, anyOf: ['CLASS_READ'] },
    { to: '/enrollments', title: t('dashboard.actionEnroll'), hint: t('dashboard.actionEnrollHint'), icon: ClipboardCheck, anyOf: ['ENROLLMENT_READ'] },
    { to: '/attendance', title: t('dashboard.actionAttendance'), hint: t('dashboard.actionAttendanceHint'), icon: CalendarDays, anyOf: ['ATTENDANCE_READ'] },
    { to: '/assessments', title: t('dashboard.actionExams'), hint: t('dashboard.actionExamsHint'), icon: BookOpenCheck, anyOf: ['ASSESSMENT_READ'] },
    { to: '/finance/invoices', title: t('dashboard.actionFinance'), hint: t('dashboard.actionFinanceHint'), icon: Receipt, anyOf: ['FINANCE_READ'] },
    { to: '/announcements', title: t('dashboard.actionAnnounce'), hint: t('dashboard.actionAnnounceHint'), icon: Megaphone, anyOf: ['NOTIFICATION_READ'] },
    { to: '/report-cards', title: t('dashboard.actionReports'), hint: t('dashboard.actionReportsHint'), icon: FileBadge, anyOf: ['REPORT_CARD_READ'] },
  ]
  const actions = allActions.filter((item) => !item.anyOf.length || auth.hasAnyPermission(item.anyOf))

  return (
    <div className="space-y-6">
      <section className="bg-neutral-900 text-white rounded-2xl p-6 md:p-7">
        <p className="text-xs uppercase tracking-wide text-neutral-400">{t('brand.admin')}</p>
        <h2 className="text-2xl font-semibold mt-1">{organization?.tenantName || auth.session?.user.tenantName}</h2>
        <p className="text-sm text-neutral-300 mt-2 max-w-2xl">{t('dashboard.guide')}</p>
        <p className="text-xs text-neutral-500 mt-3" dir="ltr">{organization?.tenantSlug || auth.session?.user.tenantSlug}</p>
      </section>

      <section>
        <h3 className="font-semibold mb-3">{t('dashboard.startHere')}</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {actions.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="bg-white rounded-xl border border-neutral-200 p-4 hover:border-neutral-400 hover:shadow-sm transition-all"
              >
                <span className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <p className="font-semibold mt-3">{item.title}</p>
                <p className="text-sm text-neutral-500 mt-1 leading-6">{item.hint}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label={t('dashboard.students')} value={people?.students.length ?? 0} />
        <StatCard icon={GraduationCap} label={t('dashboard.activeClasses')} value={classroom?.sections.filter((item) => item.status === 'ACTIVE').length ?? 0} />
        <StatCard icon={BookOpenCheck} label={t('dashboard.publishedAssessments')} value={assessments.filter((item) => item.status === 'PUBLISHED').length} />
        <StatCard icon={Building2} label={t('dashboard.branches')} value={branches.length} />
        {canFinance ? <StatCard icon={Wallet} label={t('dashboard.outstanding')} value={formatMoney(finance?.outstanding ?? 0, locale)} /> : null}
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold">{t('dashboard.recentSessions')}</h3>
          {auth.hasPermission('SCHEDULE_READ') ? (
            <Link to="/schedule/sessions" className="text-sm text-neutral-500 hover:text-neutral-900">{t('dashboard.viewAll')}</Link>
          ) : null}
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-neutral-500">{t('dashboard.noSessions')}</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between gap-3 py-2 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="font-medium">{session.className}</p>
                  <p className="text-xs text-neutral-500">{session.courseTitle} · {formatDate(session.plannedStartAt, locale)}</p>
                </div>
                <StatusBadge value={session.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
