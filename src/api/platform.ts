import { api, apiHtml, jsonBody, printFromFetch } from './client'

export type FeatureView = {
  courseSelectionEnabled: boolean
  virtualClassEnabled: boolean
  smsProvider: string
  meetingProvider: string
  meetingBaseUrl: string | null
}

export type AnnouncementView = {
  id: string
  title: string
  body: string
  audienceType: string
  audienceRef: string | null
  channel: string
  status: string
  scheduledAt: string | null
  sentAt: string | null
  classSectionId: string | null
  deliveryCount: number
}

export type DeliveryView = {
  id: string
  phone: string
  status: string
  providerMessageId: string | null
  error: string | null
  sentAt: string | null
}

export type InboxView = {
  unread: number
  items: Array<{ id: string; title: string; body: string; readAt: string | null; createdAt: string }>
}

export type LedgerAccount = { id: string; parentId: string | null; code: string; name: string; type: string; status: string }
export type VoucherType = { id: string; code: string; name: string; autoPost: boolean }
export type VoucherLine = { id: string; accountId: string; accountCode: string; accountName: string; lineNo: number; description: string | null; debit: number; credit: number }
export type VoucherView = { id: string; code: string; voucherTypeId: string; voucherTypeName: string; voucherDate: string; description: string | null; status: string; sourceType: string | null; lines: VoucherLine[] }
export type TrialRow = { accountId: string; code: string; name: string; type: string; debit: number; credit: number }

export type ReportRun = { id: string; title: string; academicPeriodId: string; periodName: string; classSectionId: string; className: string; status: string; includeRank: boolean; publishedAt: string | null; cardCount: number }
export type ReportCard = { id: string; runId: string; runTitle: string; studentId: string; studentCode: string; studentName: string; className: string; periodName: string; status: string; attendancePercent: number | null; absenceCount: number | null; overallScore: number | null; rankInClass: number | null; verificationToken: string }

export type WorkflowDef = { id: string; code: string; name: string; description: string | null; starterRole: string; formSchema: string | null; outputKind: string; outputTitle: string | null; status: string; steps: Array<{ id: string; sequenceNumber: number; name: string; approverRole: string; slaHours: number | null }> }
export type WorkflowInstance = { id: string; definitionId: string; processName: string; outputKind: string; status: string; formData: string | null; studentId: string | null; studentName: string | null; currentStep: number; certificateReady: boolean; createdAt: string }
export type WorkflowTask = { id: string; instanceId: string; processName: string; stepName: string; status: string; studentName: string | null; dueAt: string | null; createdAt: string }

export type SurveyView = { id: string; title: string; instructorId: string; instructorName: string; classSectionId: string; className: string; audience: string; opensAt: string; closesAt: string; status: string; questions: Array<{ id: string; prompt: string; sequenceNumber: number }> }
export type SurveyReport = { survey: SurveyView; overallAverage: number; responseCount: number; questions: Array<{ questionId: string; prompt: string; average: number; count: number }> }
export type StudentCardView = { id: string; studentId: string; studentCode: string; studentName: string; className: string | null; validUntil: string; verificationToken: string; photoFileId: string | null; status: string }
export type OpsReport = { collected: number; outstanding: number; overdueCount: number; debtors: Array<{ studentId: string; studentName: string; outstanding: number }>; overdue: Array<{ studentId: string; studentName: string; overdue: number }> }

export const platformApi = {
  features: () => api<FeatureView>('/api/v1/organization/features'),
  updateFeatures: (body: FeatureView & { meetingSecret?: string | null }) =>
    api<FeatureView>('/api/v1/organization/features', { method: 'PATCH', body: jsonBody(body) }),
  announcements: () => api<AnnouncementView[]>('/api/v1/announcements'),
  previewAnnouncement: (body: { title: string; body: string; audienceType: string; audienceRef?: string | null; channel: string; scheduledAt?: string | null }) =>
    api<{ recipientCount: number }>('/api/v1/announcements/preview', { method: 'POST', body: jsonBody(body) }),
  createAnnouncement: (body: { title: string; body: string; audienceType: string; audienceRef?: string | null; channel: string; scheduledAt?: string | null }) =>
    api<AnnouncementView>('/api/v1/announcements', { method: 'POST', body: jsonBody(body) }),
  deliveries: (id: string) => api<DeliveryView[]>(`/api/v1/announcements/${id}/deliveries`),
  inbox: () => api<InboxView>('/api/v1/notifications'),
  accounts: () => api<LedgerAccount[]>('/api/v1/finance/accounts'),
  createAccount: (body: { code: string; name: string; type: string; parentId?: string | null }) =>
    api<LedgerAccount>('/api/v1/finance/accounts', { method: 'POST', body: jsonBody(body) }),
  voucherTypes: () => api<VoucherType[]>('/api/v1/finance/voucher-types'),
  vouchers: () => api<VoucherView[]>('/api/v1/finance/vouchers'),
  createVoucher: (body: { voucherTypeId: string; voucherDate: string; description?: string | null; post: boolean; lines: Array<{ accountId: string; description?: string; debit: number; credit: number }> }) =>
    api<VoucherView>('/api/v1/finance/vouchers', { method: 'POST', body: jsonBody(body) }),
  postVoucher: (id: string) => api<VoucherView>(`/api/v1/finance/vouchers/${id}/post`, { method: 'POST' }),
  voidVoucher: (id: string) => api<VoucherView>(`/api/v1/finance/vouchers/${id}/void`, { method: 'POST' }),
  printVoucher: (id: string) => printFromFetch(() => apiHtml(`/api/v1/finance/vouchers/${id}/print`)),
  trialBalance: () => api<TrialRow[]>('/api/v1/finance/trial-balance'),
  opsReport: () => api<OpsReport>('/api/v1/finance/reports'),
  printInvoice: (id: string) => printFromFetch(() => apiHtml(`/api/v1/finance/invoices/${id}/print`)),
  printReceipt: (id: string) => printFromFetch(() => apiHtml(`/api/v1/finance/payments/${id}/receipt`)),
  refund: (id: string, reason: string) => api(`/api/v1/finance/payments/${id}/refund`, { method: 'POST', body: jsonBody({ reason }) }),
  reportRuns: () => api<ReportRun[]>('/api/v1/report-cards/runs'),
  generateReport: (body: { academicPeriodId: string; classSectionId: string; title: string; includeRank: boolean }) =>
    api<ReportRun>('/api/v1/report-cards/runs', { method: 'POST', body: jsonBody(body) }),
  finalizeReport: (id: string) => api<ReportRun>(`/api/v1/report-cards/runs/${id}/finalize`, { method: 'POST' }),
  publishReport: (id: string) => api<ReportRun>(`/api/v1/report-cards/runs/${id}/publish`, { method: 'POST' }),
  reportCards: (id: string) => api<ReportCard[]>(`/api/v1/report-cards/runs/${id}/cards`),
  printReport: (id: string) => printFromFetch(() => apiHtml(`/api/v1/report-cards/${id}/print`)),
  workflows: () => api<WorkflowDef[]>('/api/v1/workflows'),
  createWorkflow: (body: { code: string; name: string; description?: string; starterRole: string; formSchema?: string; outputKind: string; outputTitle?: string; steps: Array<{ name: string; approverRole: string; slaHours?: number | null }> }) =>
    api<WorkflowDef>('/api/v1/workflows', { method: 'POST', body: jsonBody(body) }),
  requests: () => api<WorkflowInstance[]>('/api/v1/requests/all'),
  queue: () => api<WorkflowTask[]>('/api/v1/requests/queue'),
  act: (id: string, decision: string, comment?: string) =>
    api<WorkflowInstance>(`/api/v1/requests/tasks/${id}`, { method: 'POST', body: jsonBody({ decision, comment }) }),
  printRequest: (id: string) => printFromFetch(() => apiHtml(`/api/v1/requests/${id}/print`)),
  surveys: () => api<SurveyView[]>('/api/v1/surveys'),
  createSurvey: (body: { instructorId: string; classSectionId: string; title: string; audience: string; opensAt: string; closesAt: string; questions: string[] }) =>
    api<SurveyView>('/api/v1/surveys', { method: 'POST', body: jsonBody(body) }),
  surveyReport: (id: string) => api<SurveyReport>(`/api/v1/surveys/${id}/report`),
  studentCards: () => api<StudentCardView[]>('/api/v1/student-cards'),
  issueCard: (body: { studentId: string; classSectionId?: string | null; validUntil: string; photoFileId?: string | null }) =>
    api<StudentCardView>('/api/v1/student-cards', { method: 'POST', body: jsonBody(body) }),
  issueClassCards: (classSectionId: string, validUntil: string) =>
    api<StudentCardView[]>(`/api/v1/student-cards/class/${classSectionId}`, { method: 'POST', body: jsonBody({ validUntil }) }),
}
