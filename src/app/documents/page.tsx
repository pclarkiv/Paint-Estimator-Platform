import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import FileUpload from '@/components/FileUpload';

export default async function DocumentsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Upload Floor Plan</h1>
      <div className="max-w-2xl mx-auto">
        <FileUpload />
      </div>
    </main>
  );
}
