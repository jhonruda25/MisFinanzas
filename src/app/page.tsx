
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

export default async function Home() {
  const sessionCookie = (await cookies()).get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
