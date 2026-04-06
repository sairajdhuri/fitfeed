import { redirect } from 'next/navigation';

export default async function Page() {
  // Middleware handles the real redirect logic.
  // Fallback: send to login.
  redirect('/login');
}

