import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Paint Estimator Platform</h1>
          <div className="space-x-4">
            <Link href="/sign-in" className="btn btn-primary">Sign In</Link>
            <Link href="/sign-up" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome!</h2>
            <p>Your AI-powered paint estimation platform is ready for use.</p>
            <p>Please sign in or create an account to get started.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/documents" className="btn btn-primary">
                Upload Floor Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
