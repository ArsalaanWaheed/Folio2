import type { Metadata } from 'next';
import Link from 'next/link';
import { adminConfigured, isAdmin } from '../../lib/portfolio-auth';
import { readPortfolio } from '../../lib/portfolio-store';
import { logout } from './actions';
import Editor from './editor';
import LoginForm from './login-form';
import './admin.css';

export const metadata: Metadata = { title: 'Portfolio admin', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <main className="admin-shell"><LoginForm configured={adminConfigured()} /></main>;
  const { content, revision } = await readPortfolio();
  return <main className="admin-shell">
    <header className="admin-header">
      <h1 className="serif">Portfolio editor</h1>
      <div className="admin-controls">
        <Link href="/" target="_blank" rel="noopener noreferrer">View portfolio</Link>
        <form action={logout}><button suppressHydrationWarning>Sign out</button></form>
      </div>
    </header>
    <Editor initialContent={content} initialRevision={revision} />
  </main>;
}
