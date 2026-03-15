import CommunityComposeView from '../../../components/ssuk/CommunityComposeView';
import { getCommunityComposeTab } from '../../../components/ssuk/communityComposeData';

type CommunityNewPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CommunityNewPage({ searchParams }: CommunityNewPageProps) {
  const params = searchParams ? await searchParams : {};
  const tabParam = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const initialTab = getCommunityComposeTab(tabParam);

  return <CommunityComposeView initialTab={initialTab} />;
}
