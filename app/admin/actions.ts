'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isAdmin, signIn, signOut } from '../../lib/portfolio-auth';
import { publishPortfolio } from '../../lib/portfolio-store';
import { parsePortfolio } from '../../lib/portfolio-validation';

export async function login(_previous: string, form: FormData) {
  const password = form.get('password');
  if (typeof password !== 'string' || password.length > 1024) return 'Enter your admin password.';
  const error = await signIn(password);
  if (error) return error;
  redirect('/admin');
}

export async function logout() {
  await signOut();
  redirect('/admin');
}

export async function publish(input: unknown, revision: string) {
  if (!(await isAdmin())) return { error: 'Your session expired. Sign in again in another tab, then retry.' };
  let content;
  try {
    content = parsePortfolio(input);
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Check your changes and try again.' };
  }
  try {
    const nextRevision = await publishPortfolio(content, revision);
    if (!nextRevision) return { error: 'Another editor published changes. Reload the editor before publishing again.' };
    revalidatePath('/');
    return { revision: nextRevision };
  } catch (error) {
    console.error('Portfolio publish failed', error);
    return { error: 'Publishing failed. Check the server’s storage configuration and try again.' };
  }
}
