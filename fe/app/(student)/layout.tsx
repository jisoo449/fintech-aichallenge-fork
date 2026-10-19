import StudentSidebar from '@/components/layout/StudentSidebar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRoles={['STUDENT']}>
      <div className="flex min-h-screen">
        <StudentSidebar />

        <main className="min-w-0 flex-1 min-h-screen bg-dashboard">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}