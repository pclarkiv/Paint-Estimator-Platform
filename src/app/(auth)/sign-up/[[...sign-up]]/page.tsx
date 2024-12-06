import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary-focus text-white',
            card: 'bg-base-100 shadow-xl'
          }
        }}
      />
    </main>
  );
}