import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Document } from '@/models/Document';
import dbConnect from '@/lib/mongodb';
import { getS3FileUrl } from '@/lib/s3';
import PDFViewer from '@/components/PDFViewer';

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  await dbConnect();
  const document = await Document.findOne({
    _id: params.id,
    userId: user.id,
  });

  if (!document) {
    redirect('/documents');
  }

  const pdfUrl = getS3FileUrl(document.key);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">{document.filename}</h1>
      <div className="max-w-5xl mx-auto">
        <PDFViewer url={pdfUrl} />
      </div>
    </main>
  );
}
