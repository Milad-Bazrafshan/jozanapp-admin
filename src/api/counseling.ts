import { api, jsonBody } from './client'

export type AssignmentView = {
  id: string
  counselorMembershipId: string
  counselorName: string
  assignmentType: string
  targetId: string | null
  targetName: string | null
  effectiveFrom: string
  effectiveTo: string | null
  status: string
  note: string | null
}

export type AdminReportView = {
  id: string
  counselorMembershipId: string
  counselorName: string
  title: string
  body: string
  periodLabel: string | null
  status: string
  sentAt: string | null
  createdAt: string
}

export type SupervisionView = {
  id: string
  seniorMembershipId: string
  seniorName: string
  counselorMembershipId: string
  counselorName: string
  effectiveFrom: string
  effectiveTo: string | null
  status: string
}

export const counselingAdminApi = {
  assignments: () => api<AssignmentView[]>('/api/v1/counseling/assignments'),
  createAssignment: (body: {
    counselorMembershipId: string
    assignmentType: 'STUDENT' | 'GUARDIAN'
    studentId?: string
    guardianId?: string
    effectiveFrom?: string
    note?: string
  }) => api<AssignmentView>('/api/v1/counseling/assignments', { method: 'POST', body: jsonBody(body) }),
  endAssignment: (id: string) => api<AssignmentView>(`/api/v1/counseling/assignments/${id}/end`, { method: 'POST' }),
  createSupervision: (body: { seniorMembershipId: string; counselorMembershipId: string; effectiveFrom?: string }) =>
    api<{ id: string }>('/api/v1/counseling/supervisions', { method: 'POST', body: jsonBody(body) }),
  adminReports: () => api<AdminReportView[]>('/api/v1/counseling/admin-reports'),
  supervisions: () => api<SupervisionView[]>('/api/v1/counseling/supervisions'),
}
