import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome to your Dashboard!</h2>
            <p>This is a protected page that only authenticated users can access.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
