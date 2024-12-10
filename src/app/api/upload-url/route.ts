import { NextResponse } from 'next/server';
import { createPresignedUploadUrl } from '@/lib/s3';
import { auth } from '@clerk/nextjs';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, contentType } = await request.json();
    
    if (!filename || contentType !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid request. Filename and PDF content type required.' },
        { status: 400 }
      );
    }

    const key = `${userId}/${Date.now()}-${filename}`;
    const presignedPost = await createPresignedUploadUrl(key);

    return NextResponse.json(presignedPost);
  } catch (error) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
