import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import dbConnect from '@/lib/mongodb';
import { Document } from '@/models/Document';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, key } = await request.json();
    
    if (!filename || !key) {
      return NextResponse.json(
        { error: 'Filename and key are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const document = await Document.create({
      userId,
      filename,
      key,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Document creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Document fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
