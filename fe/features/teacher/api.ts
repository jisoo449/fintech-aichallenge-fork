import { apiFetch } from '@/lib/api/fetcher';
import type {
  ClassroomEconomyDashboardResponse,
  ClassroomIndicatorsResponse,
  ClassroomStudentEconomy,
  EconomicAnalysisResponse,
  EconomicEvent,
  PolicyProposal,
  PolicySimulationRequest,
  PolicySimulationResponse,
} from './types';

export const DEFAULT_CLASSROOM_ID = 1;

export const getClassroomDashboard = (classroomId = DEFAULT_CLASSROOM_ID) =>
  apiFetch<ClassroomEconomyDashboardResponse>(
    `/api/v1/classrooms/${classroomId}/economy/dashboard`,
  );
export const getClassroomIndicators = (classroomId = DEFAULT_CLASSROOM_ID) =>
  apiFetch<ClassroomIndicatorsResponse>(
    `/api/v1/classrooms/${classroomId}/economy/indicators`,
  );

export async function getClassroomStudentsEconomy(
  classroomId = DEFAULT_CLASSROOM_ID,
): Promise<ClassroomStudentEconomy[]> {
  const response = await apiFetch<
    ClassroomStudentEconomy[] | ClassroomStudentEconomy[][]
  >(`/api/v1/classrooms/${classroomId}/students/economy`);
  return Array.isArray(response[0])
    ? (response as ClassroomStudentEconomy[][]).flat()
    : (response as ClassroomStudentEconomy[]);
}

export const getRandomEconomicEvent = () =>
  apiFetch<EconomicEvent>('/api/v1/economic-events/random');
export const createEconomicAnalysis = (classroomId = DEFAULT_CLASSROOM_ID) =>
  apiFetch<EconomicAnalysisResponse>(
    `/api/v1/classrooms/${classroomId}/economic-analyses`,
    { method: 'POST' },
  );
export const getLatestEconomicAnalysis = (classroomId = DEFAULT_CLASSROOM_ID) =>
  apiFetch<EconomicAnalysisResponse>(
    `/api/v1/classrooms/${classroomId}/economic-analyses/latest`,
  );
export const getPolicyProposals = (classroomId = DEFAULT_CLASSROOM_ID) =>
  apiFetch<PolicyProposal[]>(
    `/api/v1/classrooms/${classroomId}/policy-proposals`,
  );
export const simulatePolicy = (
  classroomId = DEFAULT_CLASSROOM_ID,
  request: PolicySimulationRequest,
) =>
  apiFetch<PolicySimulationResponse>(
    `/api/v1/classrooms/${classroomId}/policy-simulations`,
    { method: 'POST', body: JSON.stringify(request) },
  );
