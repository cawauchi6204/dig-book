import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Notes() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: notes } = await supabase.from("notes").select();

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}