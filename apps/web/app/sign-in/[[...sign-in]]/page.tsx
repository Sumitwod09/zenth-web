import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="auth-page">
      <SignIn
        appearance={{
          elements: {
            rootBox: "auth-root",
            cardBox: "auth-card",
          },
        }}
      />
    </div>
  );
}
