import StudioShareDetailView from '../../../../components/ssuk/StudioShareDetailView';

type StudioShareDetailPageProps = {
  params: Promise<{ studioId: string }>;
};

export default async function StudioShareDetailPage({ params }: StudioShareDetailPageProps) {
  const resolvedParams = await params;
  return <StudioShareDetailView studioId={resolvedParams.studioId} />;
}
