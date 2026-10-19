export type EconomicStatus =
  'CONTRACTION' | 'EXPANSION' | 'STABLE' | 'INFLATION' | 'DEFLATION' | string;

export type ClassroomKpis = {
  moneySupply: number;
  averageBalance: number;
  totalConsumption: number;
  totalSavings: number;
  transactionVolume: number;
};

export type ClassroomEconomyDashboardResponse = { kpis: ClassroomKpis };

export type ClassroomStudentEconomy = {
  studentId: number;
  name: string;
  jobName: string;
  balance: number;
  creditGrade: string;
};

export type EconomicMetricLatest = {
  totalMoney: number;
  averageAsset: number;
  weeklyTransactionVolume: number;
  averageConsumption: number;
  consumptionChangeRate: number;
  transactionChangeRate: number;
  savingRate: number;
  wealthGap: number;
  measuredAt: string;
};

export type EconomicMetricTrend = Pick<
  EconomicMetricLatest,
  | 'totalMoney'
  | 'weeklyTransactionVolume'
  | 'averageConsumption'
  | 'savingRate'
  | 'measuredAt'
>;
export type ClassroomIndicatorsResponse = {
  latest: EconomicMetricLatest;
  trends: EconomicMetricTrend[];
};

export type EconomicEvent = {
  id: number;
  name: string;
  level: string;
  description: string | null;
  trigger: string;
  target: string;
  effect: string;
  value: number;
};

export type EconomicAnalysisResponse = {
  classroomId: number;
  economicStatus: EconomicStatus;
  summary: string;
  mainFactors: string[];
  generatedAt: string;
};

export type PolicyProposal = {
  proposalId: string;
  policyType: string;
  title: string;
  description: string;
  purpose: string;
};

export type PolicySimulationRequest = {
  proposalId: string;
  parameters: { incomeTaxRate: number };
};
export type PolicyStateSnapshot = {
  moneySupply: number;
  totalConsumption: number;
  inflationRate: number | null;
  consumptionGrowthRate: number | null;
  economicStatus: EconomicStatus;
};
export type PolicySimulationResponse = {
  before: PolicyStateSnapshot;
  after: PolicyStateSnapshot;
  changes: string[];
};
