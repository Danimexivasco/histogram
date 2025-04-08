"use client";

import Container from "@/components/Container";
import Link from "@/components/ui/Link";
import Spinner from "@/components/ui/Spinner";
import { useAuthUser } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";

export default function ConfirmEmailPage() {
  const { data: user, isFetching } = useAuthUser();

  if (isFetching) return (
    <Container className="grid justify-items-center space-y-3 mt-6">
      <Spinner />
    </Container>
  );

  const userWithConfirmedEmail = user && user.email_confirmed_at;

  return (
    <Container className="grid justify-items-center space-y-3 mt-6">
      {userWithConfirmedEmail ? (
        <>
          <p>Thanks for confirming your email! 🚀</p>
          <p>Explore interesting topics and start learning 📖</p>
          <Link
            href={routes.home}
            asButton
            className="mt-4"
          >Go to explore posts!
          </Link>
        </>
      ) : (
        <>
          <p>We have sent you an email to confirm your account.</p>
          <p> Please confirm your email in order to login to the app.</p>
        </>
      )}
    </Container>
  );
}