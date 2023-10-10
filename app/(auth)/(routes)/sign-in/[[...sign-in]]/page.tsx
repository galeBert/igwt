import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <h1 className="absolute top-0">IGWT</h1>
      <SignIn />
    </div>
  );
}
