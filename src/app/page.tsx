import { prisma } from '@/lib/prisma'

export default async function Home() {
  let empresasCount = 0;
  let error = null;

  try {
    empresasCount = await prisma.empresa.count();
  } catch (e) {
    console.error("Error connecting to database:", e);
    error = "No se pudo conectar a la base de datos. Verifica la configuración de Prisma y .env";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex border p-8 rounded-xl shadow-lg bg-white overflow-hidden">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">RetenSaaS</h1>
          <p className="mt-4 text-slate-600">
            Plataforma de gestión de retenciones fiscales.
          </p>
          
          <div className="mt-8 p-4 bg-slate-50 rounded border">
            <h2 className="text-xl font-semibold mb-2">Estado de Conexión:</h2>
            {error ? (
              <p className="text-red-500 font-medium">{error}</p>
            ) : (
              <p className="text-green-600 font-medium">
                ✅ Conectado a la Base de Datos.
                <br />
                <span className="text-slate-500 text-sm">Empresas registradas: {empresasCount}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
