import { NextResponse } from 'next/server';
import { getUser, getUserConversations } from '@/lib/db/queries';

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await getUserConversations();

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error loading conversations:', error);
    return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 });
  }
}
