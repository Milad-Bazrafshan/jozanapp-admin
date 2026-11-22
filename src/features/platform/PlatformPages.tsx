import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { academicApi } from '@/api/academic'
import { classroomApi } from '@/api/classroom'
import { peopleApi } from '@/api/people'
import { platformApi } from '@/api/platform'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { Cell, DataTable } from '@/components/ui/DataTable'
import { Field, SelectField, TextArea } from '@/components/ui/Field'
import { FormActions, FormGrid, FormStack } from '@/components/ui/Form'
import { Modal } from '@/components/ui/Modal'
import { PageSpinner, QueryError } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useToast } from '@/components/ui/Toast'
import { formatMoney, todayIso, useLocale } from '@/lib/format'

export function AnnouncementsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audienceType, setAudienceType] = useState('ALL')
  const [channel, setChannel] = useState('IN_APP')
  const [preview, setPreview] = useState<number | null>(null)
  const list = useQuery({ queryKey: ['announcements'], queryFn: platformApi.announcements })
  const previewMut = useMutation({
    mutationFn: () => platformApi.previewAnnouncement({ title, body, audienceType, channel }),
    onSuccess: (data) => setPreview(data.recipientCount),
  })
  const create = useMutation({
    mutationFn: () => platformApi.createAnnouncement({ title, body, audienceType, channel }),
    onSuccess: async () => {
      toast.success(t('common.saved'))
      setOpen(false)
      await client.invalidateQueries({ queryKey: ['announcements'] })
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (list.isLoading) return <PageSpinner label={t('common.loading')} />
  if (list.error) return <QueryError message={list.error.message} />
  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)}>{t('announcements.write')}</Button></div>
      <DataTable rows={list.data ?? []} columns={[
        { key: 'title', header: t('common.name'), render: (row) => <Cell title={row.title} detail={row.body} /> },
        { key: 'audience', header: t('announcements.audience'), render: (row) => row.audienceType },
        { key: 'channel', header: t('announcements.channel'), render: (row) => row.channel },
        { key: 'status', header: t('common.status'), render: (row) => <StatusBadge value={row.status} /> },
        { key: 'count', header: t('announcements.recipients'), render: (row) => row.deliveryCount },
      ]} />
      {open && (
        <Modal title={t('announcements.write')} onClose={() => setOpen(false)}>
          <FormStack>
            <Field label={t('common.name')} value={title} onChange={setTitle} />
            <TextArea label={t('common.description')} value={body} onChange={setBody} />
            <SelectField label={t('announcements.audience')} value={audienceType} onChange={setAudienceType} options={[['ALL','ALL'],['ROLE','ROLE'],['CLASS','CLASS']]} />
            <SelectField label={t('announcements.channel')} value={channel} onChange={setChannel} options={[['IN_APP','IN_APP'],['SMS','SMS'],['BOTH','BOTH']]} />
            {preview != null ? <p className="text-sm">{t('announcements.preview', { count: preview })}</p> : null}
            <FormActions>
              <Button variant="secondary" onClick={() => previewMut.mutate()}>{t('announcements.previewAction')}</Button>
              <Button disabled={!title || !body || create.isPending} onClick={() => create.mutate()}>{t('common.submit')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function ReportCardsAdminPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [periodId, setPeriodId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const academic = useQuery({ queryKey: queryKeys.academic, queryFn: academicApi.list })
  const classroom = useQuery({ queryKey: queryKeys.classroom, queryFn: classroomApi.list })
  const runs = useQuery({ queryKey: ['report-cards'], queryFn: platformApi.reportRuns })
  const generate = useMutation({
    mutationFn: () => platformApi.generateReport({ academicPeriodId: periodId, classSectionId: sectionId, title, includeRank: true }),
    onSuccess: async () => { toast.success(t('common.saved')); setOpen(false); await client.invalidateQueries({ queryKey: ['report-cards'] }) },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (runs.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)}>{t('reportCards.generate')}</Button></div>
      <DataTable rows={runs.data ?? []} columns={[
        { key: 'title', header: t('common.name'), render: (row) => <Cell title={row.title} detail={row.className} /> },
        { key: 'status', header: t('common.status'), render: (row) => <StatusBadge value={row.status} /> },
        { key: 'count', header: t('common.count', { count: 0 }), render: (row) => row.cardCount },
        { key: 'actions', header: t('common.actions'), render: (row) => (
          <div className="flex gap-2">
            {row.status === 'DRAFT' ? <Button variant="ghost" onClick={() => platformApi.finalizeReport(row.id).then(() => runs.refetch())}>{t('reportCards.finalize')}</Button> : null}
            {row.status === 'FINALIZED' ? <Button variant="ghost" onClick={() => platformApi.publishReport(row.id).then(() => runs.refetch())}>{t('reportCards.publish')}</Button> : null}
            <Button variant="ghost" onClick={async () => { const cards = await platformApi.reportCards(row.id); if (cards[0]) await platformApi.printReport(cards[0].id) }}>{t('common.print')}</Button>
          </div>
        ) },
      ]} />
      {open && (
        <Modal title={t('reportCards.generate')} onClose={() => setOpen(false)}>
          <FormStack>
            <Field label={t('common.name')} value={title} onChange={setTitle} />
            <SelectField label={t('nav.periods')} value={periodId} onChange={setPeriodId} options={(academic.data?.periods ?? []).map((item) => [item.id, item.name] as [string, string])} />
            <SelectField label={t('nav.sections')} value={sectionId} onChange={setSectionId} options={(classroom.data?.sections ?? []).map((item) => [item.id, item.name] as [string, string])} />
            <FormActions>
              <Button variant="secondary" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button disabled={!title || !periodId || !sectionId || generate.isPending} onClick={() => generate.mutate()}>{t('common.save')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function LedgerAccountsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('ASSET')
  const accounts = useQuery({ queryKey: ['ledger', 'accounts'], queryFn: platformApi.accounts })
  const create = useMutation({
    mutationFn: () => platformApi.createAccount({ code, name, type }),
    onSuccess: async () => { toast.success(t('common.saved')); setOpen(false); await client.invalidateQueries({ queryKey: ['ledger'] }) },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (accounts.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)}>{t('common.add')}</Button></div>
      <DataTable rows={accounts.data ?? []} columns={[
        { key: 'code', header: t('common.code'), render: (row) => <span dir="ltr">{row.code}</span> },
        { key: 'name', header: t('common.name'), render: (row) => row.name },
        { key: 'type', header: t('common.type'), render: (row) => row.type },
      ]} />
      {open && (
        <Modal title={t('ledger.account')} onClose={() => setOpen(false)}>
          <FormStack>
            <FormGrid>
              <Field label={t('common.code')} value={code} onChange={setCode} />
              <Field label={t('common.name')} value={name} onChange={setName} />
            </FormGrid>
            <SelectField label={t('common.type')} value={type} onChange={setType} options={[['ASSET','ASSET'],['LIABILITY','LIABILITY'],['EQUITY','EQUITY'],['REVENUE','REVENUE'],['EXPENSE','EXPENSE']]} />
            <FormActions>
              <Button variant="secondary" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button disabled={!code || !name || create.isPending} onClick={() => create.mutate()}>{t('common.save')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function LedgerVouchersPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [typeId, setTypeId] = useState('')
  const [date, setDate] = useState(todayIso())
  const [description, setDescription] = useState('')
  const [debitAccount, setDebitAccount] = useState('')
  const [creditAccount, setCreditAccount] = useState('')
  const [amount, setAmount] = useState('')
  const vouchers = useQuery({ queryKey: ['ledger', 'vouchers'], queryFn: platformApi.vouchers })
  const types = useQuery({ queryKey: ['ledger', 'types'], queryFn: platformApi.voucherTypes })
  const accounts = useQuery({ queryKey: ['ledger', 'accounts'], queryFn: platformApi.accounts, enabled: open })
  const create = useMutation({
    mutationFn: () => platformApi.createVoucher({
      voucherTypeId: typeId,
      voucherDate: date,
      description,
      post: false,
      lines: [
        { accountId: debitAccount, debit: Number(amount), credit: 0 },
        { accountId: creditAccount, debit: 0, credit: Number(amount) },
      ],
    }),
    onSuccess: async () => { toast.success(t('common.saved')); setOpen(false); await client.invalidateQueries({ queryKey: ['ledger'] }) },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (vouchers.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)}>{t('ledger.voucher')}</Button></div>
      <DataTable rows={vouchers.data ?? []} columns={[
        { key: 'code', header: t('common.code'), render: (row) => <Cell title={row.code} detail={row.voucherTypeName} /> },
        { key: 'date', header: t('common.date'), render: (row) => row.voucherDate },
        { key: 'status', header: t('common.status'), render: (row) => <StatusBadge value={row.status} /> },
        { key: 'actions', header: t('common.actions'), render: (row) => (
          <div className="flex gap-2">
            {row.status === 'DRAFT' ? <Button variant="ghost" onClick={() => platformApi.postVoucher(row.id).then(() => vouchers.refetch())}>{t('ledger.post')}</Button> : null}
            {row.status === 'POSTED' ? <Button variant="ghost" onClick={() => platformApi.voidVoucher(row.id).then(() => vouchers.refetch())}>{t('ledger.void')}</Button> : null}
            <Button variant="ghost" onClick={() => void platformApi.printVoucher(row.id)}>{t('common.print')}</Button>
          </div>
        ) },
      ]} />
      {open && (
        <Modal title={t('ledger.voucher')} onClose={() => setOpen(false)}>
          <FormStack>
            <SelectField label={t('ledger.type')} value={typeId} onChange={setTypeId} options={(types.data ?? []).map((item) => [item.id, item.name] as [string, string])} />
            <Field label={t('common.date')} type="date" value={date} onChange={setDate} />
            <Field label={t('common.description')} required={false} value={description} onChange={setDescription} />
            <SelectField label={t('ledger.debit')} value={debitAccount} onChange={setDebitAccount} options={(accounts.data ?? []).map((item) => [item.id, `${item.code} ${item.name}`] as [string, string])} />
            <SelectField label={t('ledger.credit')} value={creditAccount} onChange={setCreditAccount} options={(accounts.data ?? []).map((item) => [item.id, `${item.code} ${item.name}`] as [string, string])} />
            <Field label={t('finance.amount')} type="number" value={amount} onChange={setAmount} />
            <FormActions>
              <Button variant="secondary" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button disabled={!typeId || !debitAccount || !creditAccount || !amount || create.isPending} onClick={() => create.mutate()}>{t('common.save')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function TrialBalancePage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const rows = useQuery({ queryKey: ['ledger', 'trial'], queryFn: platformApi.trialBalance })
  if (rows.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <DataTable rows={(rows.data ?? []).map((row) => ({ ...row, id: row.accountId }))} columns={[
      { key: 'code', header: t('common.code'), render: (row) => <span dir="ltr">{row.code}</span> },
      { key: 'name', header: t('common.name'), render: (row) => row.name },
      { key: 'debit', header: t('ledger.debit'), render: (row) => formatMoney(row.debit, locale) },
      { key: 'credit', header: t('ledger.credit'), render: (row) => formatMoney(row.credit, locale) },
    ]} />
  )
}

export function WorkflowsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [starterRole, setStarterRole] = useState('GUARDIAN')
  const [stepName, setStepName] = useState('Approval')
  const [approverRole, setApproverRole] = useState('ADMIN')
  const defs = useQuery({ queryKey: ['workflows'], queryFn: platformApi.workflows })
  const create = useMutation({
    mutationFn: () => platformApi.createWorkflow({ code, name, starterRole, outputKind: 'NONE', steps: [{ name: stepName, approverRole }] }),
    onSuccess: async () => { toast.success(t('common.saved')); setOpen(false); await client.invalidateQueries({ queryKey: ['workflows'] }) },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (defs.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)}>{t('common.add')}</Button></div>
      <DataTable rows={defs.data ?? []} columns={[
        { key: 'name', header: t('common.name'), render: (row) => <Cell title={row.name} detail={row.code} /> },
        { key: 'starter', header: t('workflow.starter'), render: (row) => row.starterRole },
        { key: 'output', header: t('workflow.output'), render: (row) => row.outputKind },
      ]} />
      {open && (
        <Modal title={t('workflow.define')} onClose={() => setOpen(false)}>
          <FormStack>
            <Field label={t('common.code')} value={code} onChange={setCode} />
            <Field label={t('common.name')} value={name} onChange={setName} />
            <SelectField label={t('workflow.starter')} value={starterRole} onChange={setStarterRole} options={[['GUARDIAN','GUARDIAN'],['STUDENT','STUDENT'],['INSTRUCTOR','INSTRUCTOR'],['STAFF','STAFF']]} />
            <Field label={t('workflow.step')} value={stepName} onChange={setStepName} />
            <Field label={t('workflow.approver')} value={approverRole} onChange={setApproverRole} />
            <FormActions>
              <Button variant="secondary" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button disabled={!code || !name || create.isPending} onClick={() => create.mutate()}>{t('common.save')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function RequestQueuePage() {
  const { t } = useTranslation()
  const queue = useQuery({ queryKey: ['workflow-queue'], queryFn: platformApi.queue })
  const all = useQuery({ queryKey: ['workflow-all'], queryFn: platformApi.requests })
  if (queue.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <div className="space-y-6">
      <DataTable rows={queue.data ?? []} columns={[
        { key: 'process', header: t('workflow.process'), render: (row) => <Cell title={row.processName} detail={row.stepName} /> },
        { key: 'student', header: t('finance.student'), render: (row) => row.studentName || t('common.dash') },
        { key: 'actions', header: t('common.actions'), render: (row) => (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => platformApi.act(row.id, 'APPROVED').then(() => queue.refetch())}>{t('workflow.approve')}</Button>
            <Button variant="ghost" onClick={() => platformApi.act(row.id, 'REJECTED').then(() => queue.refetch())}>{t('workflow.reject')}</Button>
          </div>
        ) },
      ]} />
      <DataTable rows={all.data ?? []} columns={[
        { key: 'name', header: t('workflow.process'), render: (row) => row.processName },
        { key: 'status', header: t('common.status'), render: (row) => <StatusBadge value={row.status} /> },
        { key: 'actions', header: t('common.actions'), render: (row) => row.certificateReady ? <Button variant="ghost" onClick={() => void platformApi.printRequest(row.id)}>{t('common.print')}</Button> : null },
      ]} />
    </div>
  )
}

export function SurveysPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [instructorId, setInstructorId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [question, setQuestion] = useState('')
  const [reportId, setReportId] = useState<string | null>(null)
  const people = useQuery({ queryKey: queryKeys.people, queryFn: peopleApi.list })
  const classroom = useQuery({ queryKey: queryKeys.classroom, queryFn: classroomApi.list })
  const list = useQuery({ queryKey: ['surveys'], queryFn: platformApi.surveys })
  const report = useQuery({ queryKey: ['surveys', reportId], queryFn: () => platformApi.surveyReport(reportId!), enabled: Boolean(reportId) })
  const create = useMutation({
    mutationFn: () => platformApi.createSurvey({
      instructorId, classSectionId: sectionId, title, audience: 'GUARDIANS',
      opensAt: new Date().toISOString(), closesAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      questions: [question],
    }),
    onSuccess: () => { toast.success(t('common.saved')); setOpen(false); void list.refetch() },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (list.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)}>{t('common.add')}</Button></div>
      <DataTable rows={list.data ?? []} columns={[
        { key: 'title', header: t('common.name'), render: (row) => <Cell title={row.title} detail={row.instructorName} /> },
        { key: 'status', header: t('common.status'), render: (row) => <StatusBadge value={row.status} /> },
        { key: 'actions', header: t('common.actions'), render: (row) => <Button variant="ghost" onClick={() => setReportId(row.id)}>{t('surveys.report')}</Button> },
      ]} />
      {report.data && (
        <Modal title={t('surveys.report')} onClose={() => setReportId(null)}>
          <p className="text-sm">{t('surveys.average')}: {report.data.overallAverage.toFixed(2)} ({report.data.responseCount})</p>
          {report.data.questions.map((item) => <p key={item.questionId} className="text-sm mt-2">{item.prompt}: {item.average.toFixed(2)}</p>)}
        </Modal>
      )}
      {open && (
        <Modal title={t('surveys.create')} onClose={() => setOpen(false)}>
          <FormStack>
            <Field label={t('common.name')} value={title} onChange={setTitle} />
            <SelectField label={t('nav.instructors')} value={instructorId} onChange={setInstructorId} options={(people.data?.instructors ?? []).map((item) => [item.id, `${item.person.firstName} ${item.person.lastName}`] as [string, string])} />
            <SelectField label={t('nav.sections')} value={sectionId} onChange={setSectionId} options={(classroom.data?.sections ?? []).map((item) => [item.id, item.name] as [string, string])} />
            <Field label={t('surveys.question')} value={question} onChange={setQuestion} />
            <FormActions>
              <Button variant="secondary" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button disabled={!title || !instructorId || !sectionId || !question || create.isPending} onClick={() => create.mutate()}>{t('common.save')}</Button>
            </FormActions>
          </FormStack>
        </Modal>
      )}
    </div>
  )
}

export function StudentCardsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const [sectionId, setSectionId] = useState('')
  const [validUntil, setValidUntil] = useState(todayIso())
  const classroom = useQuery({ queryKey: queryKeys.classroom, queryFn: classroomApi.list })
  const cards = useQuery({ queryKey: ['student-cards'], queryFn: platformApi.studentCards })
  const issue = useMutation({
    mutationFn: () => platformApi.issueClassCards(sectionId, validUntil),
    onSuccess: () => { toast.success(t('common.saved')); void cards.refetch() },
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (cards.isLoading) return <PageSpinner label={t('common.loading')} />
  return (
    <div className="space-y-5">
      <FormStack>
        <SelectField label={t('nav.sections')} value={sectionId} onChange={setSectionId} options={(classroom.data?.sections ?? []).map((item) => [item.id, item.name] as [string, string])} />
        <Field label={t('cards.validUntil')} type="date" value={validUntil} onChange={setValidUntil} />
        <Button disabled={!sectionId || issue.isPending} onClick={() => issue.mutate()}>{t('cards.issueClass')}</Button>
      </FormStack>
      <DataTable rows={cards.data ?? []} columns={[
        { key: 'student', header: t('finance.student'), render: (row) => <Cell title={row.studentName} detail={row.studentCode} /> },
        { key: 'class', header: t('nav.classes'), render: (row) => row.className || t('common.dash') },
        { key: 'until', header: t('cards.validUntil'), render: (row) => row.validUntil },
      ]} />
    </div>
  )
}

export function FeaturesSettings() {
  const { t } = useTranslation()
  const toast = useToast()
  const auth = useAuth()
  const features = useQuery({ queryKey: ['features'], queryFn: platformApi.features })
  const [form, setForm] = useState<null | { courseSelectionEnabled: boolean; virtualClassEnabled: boolean; smsProvider: string; meetingProvider: string; meetingBaseUrl: string; meetingSecret: string }>(null)
  const current = form ?? (features.data ? { ...features.data, meetingBaseUrl: features.data.meetingBaseUrl ?? '', meetingSecret: '' } : null)
  const save = useMutation({
    mutationFn: () => platformApi.updateFeatures({
      courseSelectionEnabled: current!.courseSelectionEnabled,
      virtualClassEnabled: current!.virtualClassEnabled,
      smsProvider: current!.smsProvider,
      meetingProvider: current!.meetingProvider,
      meetingBaseUrl: current!.meetingBaseUrl || null,
      meetingSecret: current!.meetingSecret || null,
    }),
    onSuccess: () => toast.success(t('common.saved')),
    onError: (error) => toast.error(error instanceof Error ? error.message : t('common.retry')),
  })
  if (!auth.hasPermission('FEATURE_WRITE')) return null
  if (features.isLoading || !current) return <PageSpinner label={t('common.loading')} />
  return (
    <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
      <h2 className="font-semibold">{t('settings.features')}</h2>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={current.courseSelectionEnabled} onChange={(event) => setForm({ ...current, courseSelectionEnabled: event.target.checked })} />{t('settings.courseSelection')}</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={current.virtualClassEnabled} onChange={(event) => setForm({ ...current, virtualClassEnabled: event.target.checked })} />{t('settings.virtualClass')}</label>
      <SelectField label={t('settings.smsProvider')} value={current.smsProvider} onChange={(smsProvider) => setForm({ ...current, smsProvider })} options={[['DEMO','DEMO'],['KAVENEGAR','KAVENEGAR'],['QASEDAK','QASEDAK']]} />
      <SelectField label={t('settings.meetingProvider')} value={current.meetingProvider} onChange={(meetingProvider) => setForm({ ...current, meetingProvider })} options={[['GENERIC_LINK','GENERIC_LINK'],['BIGBLUEBUTTON','BIGBLUEBUTTON'],['ADOBE_CONNECT','ADOBE_CONNECT']]} />
      <Field label={t('settings.meetingBaseUrl')} required={false} value={current.meetingBaseUrl} onChange={(meetingBaseUrl) => setForm({ ...current, meetingBaseUrl })} />
      <Field label={t('settings.meetingSecret')} required={false} type="password" value={current.meetingSecret} onChange={(meetingSecret) => setForm({ ...current, meetingSecret })} />
      <Button disabled={save.isPending} onClick={() => save.mutate()}>{t('common.save')}</Button>
    </section>
  )
}
