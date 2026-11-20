'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function LoginForm({ configured }: { configured: boolean }) {
  const [error, action, pending] = useActionState(login, '');
  return <form action={action} className="admin-login">
    <h1 className="serif">Portfolio admin</h1>
    {configured ? <>
      <label htmlFor="admin-password">Password</label>
      <input suppressHydrationWarning id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={1024} />
      <button suppressHydrationWarning className="admin-primary" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      {error && <p role="alert">{error}</p>}
    </> : <p>Set <code>PORTFOLIO_ADMIN_PASSWORD</code> to at least 16 characters on the server to enable sign-in.</p>}
  </form>;
}
