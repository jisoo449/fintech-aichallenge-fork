import LoginForm from '@/features/auth/components/LoginForm';

export default function HomePage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#34C37D] px-4 py-8 bg-cover bg-center"
      style={{
        backgroundImage: "url('/backgrounds/green-pattern.svg')",
      }}
    >
      {/* 중앙 로그인 폼 카드 */}
      <section className="relative z-10 flex flex-col items-center justify-center w-full max-w-[440px]">
        <LoginForm />

        {/* 하단 카피라이트 */}
        <footer className="mt-6 text-center text-xs text-white/80 tracking-tight">
          © 2026 우리반 경제생활 MVP. All Rights Reserved.
        </footer>
      </section>
    </main>
  );
}