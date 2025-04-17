import ProfileContent from "@/components/ProfileContent";

type ProfilePageProps = Readonly<{ params: { username: string } }>;

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  return (
    <ProfileContent username={username} />
  );
}