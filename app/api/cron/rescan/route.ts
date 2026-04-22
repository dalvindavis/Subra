import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, plan')
      .in('plan', ['basic', 'lifetime']);

    if (error) throw error;

    console.log(`Found ${users?.length || 0} paid users for monthly re-scan check`);

    return NextResponse.json({
      success: true,
      usersChecked: users?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Cron rescan error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}