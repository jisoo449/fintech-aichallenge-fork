import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StudentInfo = {
  id: string;
  name: string;
  classRoom: string;
  currentJob: string;
  creditGrade: string;
  creditScore: number;
};

interface StudentState {
  student: StudentInfo;
  updateStudent: (partial: Partial<StudentInfo>) => void;
  updateJob: (job: string) => void;
  updateCredit: (grade: string, score: number) => void;
  updateFromDashboard: (data: {
    currentJob?: string;
    creditGrade?: string;
    creditScore?: number;
    name?: string;
  }) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      student: {
        id: 'student-1',
        name: '황건우 학생',
        classRoom: '6학년 4반',
        currentJob: '정리 반장',
        creditGrade: '보통',
        creditScore: 688,
      },
      updateStudent: (partial) =>
        set((state) => ({
          student: { ...state.student, ...partial },
        })),
      updateJob: (job) =>
        set((state) => ({
          student: { ...state.student, currentJob: job },
        })),
      updateCredit: (grade, score) =>
        set((state) => ({
          student: { ...state.student, creditGrade: grade, creditScore: score },
        })),
      updateFromDashboard: (data) =>
        set((state) => ({
          student: {
            ...state.student,
            ...(data.currentJob ? { currentJob: data.currentJob } : {}),
            ...(data.creditGrade ? { creditGrade: data.creditGrade } : {}),
            ...(data.creditScore ? { creditScore: data.creditScore } : {}),
            ...(data.name ? { name: data.name } : {}),
          },
        })),
    }),
    {
      name: 'seed-student-storage',
    }
  )
);
