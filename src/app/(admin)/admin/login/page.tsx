import { login } from "../actions";
import { brand } from "@/brand.config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111016] px-4">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#18171F] p-8"
      >
        <h1 className="font-semibold text-xl text-white">
          Panel del negocio
        </h1>
        <p className="mt-1 text-sm text-[#8E8A82]">{brand.name}</p>

        <label
          htmlFor="email"
          className="mt-6 block text-xs uppercase tracking-widest text-[#8E8A82]"
        >
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-white outline-none"
        />

        <label
          htmlFor="password"
          className="mt-4 block text-xs uppercase tracking-widest text-[#8E8A82]"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-white outline-none"
        />

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="bg-brand-orange text-brand-carbon mt-6 w-full rounded-lg py-2 font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
