import CommunityView from '../../components/ssuk/CommunityView';
import { type CommunityTabId } from '../../components/ssuk/mockData';

type CommunityPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const validTabs: CommunityTabId[] = ['qna', 'share', 'free'];

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const params = searchParams ? await searchParams : {};
  const tabParam = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const activeTab = validTabs.includes(tabParam as CommunityTabId)
    ? (tabParam as CommunityTabId)
    : 'qna';

  return <CommunityView activeTab={activeTab} />;
}
