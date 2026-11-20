import type { Metadata } from 'next';
import Portfolio from '../components/portfolio';
import { readPortfolio } from '../lib/portfolio-store';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { content: { site } } = await readPortfolio();
  return {
    title: site.title,
    description: site.description,
    openGraph: { title: site.socialTitle, description: site.socialDescription, type: 'website' },
  };
}

export default async function Home() {
  const { content } = await readPortfolio();
  return <Portfolio content={content} />;
}
