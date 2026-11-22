import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { counselingAdminApi } from '@/api/counseling'
import { organizationApi } from '@/api/organization'
import { peopleApi } from '@/api/people'
import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { Cell, DataTable } from '@/components/ui/DataTable'
import { FormActions, FormStack } from '@/components/ui/Form'
import { Modal } from '@/components/ui/Modal'
import { PageSpinner, QueryError } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useToast } from '@/components/ui/Toast'

export function CounselingAssignmentsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [counselorMembershipId, setCounselorMembershipId] = useState('')
  const [assignmentType, setAssignmentType] = useState('STUDENT')
  const [studentId, setStudentId] = useState('')
  const [guardianId, setGuardianId] = useState('')

  const assignments = useQuery({ queryKey: ['counseling', 'assignments'], queryFn: counselingAdminApi.assignments })
  const users = useQuery({ queryKey: ['org-users'], queryFn: organizationApi.users })
  const people = useQuery({ queryKey: ['people'], queryFn: peopleApi.list })

  const create = useMutation({
    mutationFn: () =>
      counselingAdminApi.createAssignment({
        counselorMembershipId,
        assignmentType: assignmentType as 'STUDENT' | 'GUARDIAN',
        studentId: assignmentType === 'STUDENT' ? studentId : undefined,
        guardianId: assignmentType === 'GUARDIAN' ? guardianId : undefined,
      }),
    onSuccess: async () => {
      toast.success(t('common.saved'))
      setOpen(false)
      await client.invalidateQueries({ queryKey: ['counseling', 'assignments'] })
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })

  if (assignments.isLoading) return <PageSpinner label={t('common.loading')} />
  if (assignments.error) return <QueryError message={assignments.error.message} />

  const userOptions = (users.data ?? []).map((user) => [user.membershipId, `${user.firstName} ${user.lastName} (${user.email})`] as const)
  const studentOptions = (people.data?.students ?? []).map((s) => [s.id, `${s.person.firstName} ${s.person.lastName} · ${s.code}`] as const)
  const guardianOptions = (people.data?.guardians ?? []).map((g) => [g.id, `${g.person.firstName} ${g.person.lastName}`] as const)

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">{t('counseling.assignSubtitle')}</p>
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>{t('counseling.newAssignment')}</Button>
      </div>
      <DataTable
        rows={assignments.data ?? []}
        columns={[
          { key: 'counselor', header: t('counseling.counselor'), render: (row) => <Cell title={row.counselorName} detail={row.assignmentType} /> },
          { key: 'target', header: t('counseling.targetPerson'), render: (row) => row.targetName ?? '—' },
          { key: 'status', header: t('common.status'), render: (row) => <StatusBadge value={row.status} /> },
        ]}
      />
      {open && (
        <Modal title={t('counseling.newAssignment')} onClose={() => setOpen(false)}>
          <FormStack>
            <SelectField label={t('counseling.counselorUser')} value={counselorMembershipId} onChange={setCounselorMembershipId} options={userOptions} />
            <SelectField
              label={t('counseling.assignmentType')}
              value={assignmentType}
              onChange={setAssignmentType}
              options={[
                ['STUDENT', t('counseling.typeStudent')],
                ['GUARDIAN', t('counseling.typeGuardian')],
              ]}
            />
            {assignmentType === 'STUDENT' ? (
              <SelectField label={t('nav.students')} value={studentId} onChange={setStudentId} options={studentOptions} />
            ) : (
              <SelectField label={t('nav.guardians')} value={guardianId} onChange={setGuardianId} options={guardianOptions} />
            )}
            <FormActions>
              <Button disabled={!counselorMembershipId || create.isPending} onClick={() => create.mutate()}>{t('common.save')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function CounselingSupervisionsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [seniorMembershipId, setSeniorMembershipId] = useState('')
  const [counselorMembershipId, setCounselorMembershipId] = useState('')
  const supervisions = useQuery({ queryKey: ['counseling', 'supervisions'], queryFn: counselingAdminApi.supervisions })
  const users = useQuery({ queryKey: ['org-users'], queryFn: organizationApi.users })
  const create = useMutation({
    mutationFn: () => counselingAdminApi.createSupervision({ seniorMembershipId, counselorMembershipId }),
    onSuccess: async () => {
      toast.success(t('common.saved'))
      setOpen(false)
      await client.invalidateQueries({ queryKey: ['counseling', 'supervisions'] })
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (supervisions.isLoading) return <PageSpinner label={t('common.loading')} />
  if (supervisions.error) return <QueryError message={supervisions.error.message} />
  const userOptions = (users.data ?? []).map((user) => [user.membershipId, `${user.firstName} ${user.lastName} (${user.email})`] as const)
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">{t('counseling.supervisionSubtitle')}</p>
      <div className="flex justify-end"><Button onClick={() => setOpen(true)}>{t('counseling.newSupervision')}</Button></div>
      <DataTable
        rows={supervisions.data ?? []}
        columns={[
          { key: 'senior', header: t('counseling.seniorCounselor'), render: (row) => row.seniorName },
          { key: 'counselor', header: t('counseling.counselor'), render: (row) => row.counselorName },
          { key: 'status', header: t('common.status'), render: (row) => <StatusBadge value={row.status} /> },
        ]}
      />
      {open && (
        <Modal title={t('counseling.newSupervision')} onClose={() => setOpen(false)}>
          <FormStack>
            <SelectField label={t('counseling.seniorCounselor')} value={seniorMembershipId} onChange={setSeniorMembershipId} options={userOptions} />
            <SelectField label={t('counseling.counselorUser')} value={counselorMembershipId} onChange={setCounselorMembershipId} options={userOptions} />
            <FormActions>
              <Button disabled={!seniorMembershipId || !counselorMembershipId || create.isPending} onClick={() => create.mutate()}>{t('common.save')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function CounselingAdminReportsPage() {
  const { t } = useTranslation()
  const reports = useQuery({ queryKey: ['counseling', 'admin-reports'], queryFn: counselingAdminApi.adminReports })
  if (reports.isLoading) return <PageSpinner label={t('common.loading')} />
  if (reports.error) return <QueryError message={reports.error.message} />
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">{t('counseling.adminReportsSubtitle')}</p>
      <DataTable
        rows={reports.data ?? []}
        columns={[
          { key: 'title', header: t('common.name'), render: (row) => <Cell title={row.title} detail={row.counselorName} /> },
          { key: 'period', header: t('counseling.period'), render: (row) => row.periodLabel ?? '—' },
          { key: 'body', header: t('common.description'), render: (row) => <span className="line-clamp-2">{row.body}</span> },
        ]}
      />
    </div>
  )
}
