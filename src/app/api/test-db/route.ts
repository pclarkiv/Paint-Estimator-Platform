import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Project } from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const testProject = await Project.findOne();
    return NextResponse.json({ 
      message: 'Database connection successful',
      testProject: testProject || 'No projects found'
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 });
  }
}
