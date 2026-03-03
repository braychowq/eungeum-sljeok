import CommunityPostDetailView from '../../../../components/ssuk/CommunityPostDetailView';

type CommunityPostDetailPageProps = {
  params: Promise<{ postId: string }>;
};

export default async function CommunityPostDetailPage({
  params
}: CommunityPostDetailPageProps) {
  const { postId } = await params;

  return <CommunityPostDetailView postId={postId} />;
}
