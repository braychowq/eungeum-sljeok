import MarketView from '../../components/ssuk/MarketView';
import { type MarketSort } from '../../components/ssuk/mockData';

type MarketPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const validSorts: MarketSort[] = ['recommended', 'popular', 'latest', 'price_low'];

function pickQueryParam<T extends string>(value: string | undefined, valid: T[], fallback: T): T {
  return valid.includes(value as T) ? (value as T) : fallback;
}

export default async function MarketPage({ searchParams }: MarketPageProps) {
  const params = searchParams ? await searchParams : {};
  const sortParam = Array.isArray(params.sort) ? params.sort[0] : params.sort;

  const activeSort = pickQueryParam(sortParam, validSorts, 'recommended');

  return <MarketView activeSort={activeSort} />;
}
