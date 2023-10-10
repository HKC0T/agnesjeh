import prisma from "@/prisma/db";
import RegisterForm from "@/components/registerForm";

export default async function Home() {
  return (
    <main className="px-6 max-w-7xl lg:px-8 mx-auto">
      <RegisterForm></RegisterForm>
    </main>
  );
}
