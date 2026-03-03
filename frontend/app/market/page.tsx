import MarketView from '../../components/ssuk/MarketView';
import { type MarketTabId } from '../../components/ssuk/mockData';

type MarketPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const validTabs: MarketTabId[] = ['studio', 'jewelry'];

export default async function MarketPage({ searchParams }: MarketPageProps) {
  const params = searchParams ? await searchParams : {};
  const tabParam = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const activeTab = validTabs.includes(tabParam as MarketTabId)
    ? (tabParam as MarketTabId)
    : 'studio';

  return <MarketView activeTab={activeTab} />;
}
