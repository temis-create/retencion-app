import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Users, 
  BarChart3,
  Calculator,
  MessageSquare,
  Mail,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "RetenSaaS | Sistema de Retenciones IVA e ISLR en Venezuela",
  description: "Automatiza el cálculo de retenciones, genera comprobantes y exportaciones fiscales TXT/XML. Diseñado para empresas y contadores en Venezuela.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 shadow-emerald-200 shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">RetenSaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-emerald-700 hover:bg-emerald-50">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="https://wa.me/584145202075" target="_blank">
              <Button className="bg-emerald-700 hover:bg-emerald-600 shadow-md">
                Solicitar demo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Sistema de Retenciones <span className="text-emerald-700">IVA e ISLR</span> automatizado
                </h1>
                <p className="mt-6 text-lg text-slate-600 sm:text-xl">
                  Calcula, gestiona y genera comprobantes fiscales sin errores. La plataforma definitiva lista para el cumplimiento real en empresas y despachos contables de Venezuela.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/login">
                    <Button size="lg" className="h-14 bg-emerald-700 px-8 text-base font-bold hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all hover:-translate-y-1">
                      Comenzar ahora
                    </Button>
                  </Link>
                  <Link href="https://wa.me/584145202075" target="_blank">
                    <Button variant="outline" size="lg" className="h-14 border-slate-200 px-8 text-base font-bold text-slate-700 hover:bg-slate-50 transition-all hover:-translate-y-1">
                      <Smartphone className="mr-2 h-5 w-5" />
                      Solicitar Demo
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Cumplimiento SENIAT</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Exportación XML/TXT</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-emerald-100/50 blur-2xl"></div>
                <div className="relative rounded-2xl border border-white/20 bg-white/30 p-2 shadow-2xl backdrop-blur-sm">
                  <Image 
                    src="/images/hero_fiscal.png" 
                    alt="RetenSaaS Dashboard" 
                    width={1000} 
                    height={800} 
                    className="rounded-xl shadow-inner shadow-black/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold uppercase tracking-wider text-emerald-700">El desafío fiscal</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Las retenciones ya no tienen por qué ser un dolor de cabeza
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Las retenciones fiscales en Venezuela son complejas, propensas a errores de cálculo y consumen horas de trabajo operativo. Un error puede resultar en sanciones costosas.
            </p>
            <div className="mt-12 rounded-2xl bg-slate-50 p-8 sm:p-12">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:text-left">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Nuestra Solución</h3>
                  <p className="mt-2 text-slate-600">
                    RetenSaaS automatiza el ciclo completo: desde el registro de la compra hasta la generación del comprobante y el archivo de exportación para el portal fiscal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="px-4 py-24 sm:px-6 lg:px-8 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Beneficios Clave</h2>
              <p className="mt-4 text-slate-600">Todo lo que necesitas para tu gestión fiscal en un solo lugar</p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Cálculo Automático",
                  desc: "Mecanismo inteligente para IVA e ISLR basado en leyes vigentes.",
                  icon: Calculator
                },
                {
                  title: "Comprobantes PDF",
                  desc: "Genera comprobantes oficiales listos para imprimir o enviar.",
                  icon: FileText
                },
                {
                  title: "Exportación Directa",
                  desc: "Archivos TXT y XML listos para el portal del SENIAT.",
                  icon: ArrowRight
                },
                {
                  title: "Multi-Empresa",
                  desc: "Gestiona múltiples RIFs y usuarios desde una sola cuenta.",
                  icon: Users
                }
              ].map((item, idx) => (
                <div key={idx} className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 border border-slate-100">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Flujo de Trabajo Inteligente</h2>
              <p className="mt-4 text-slate-600">Del registro a la declaración en 5 pasos simples</p>
            </div>
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              {['Compras', 'Pagos', 'Retenciones', 'Comprobantes', 'Exportación'].map((step, idx) => (
                <div key={idx} className="relative flex flex-1 flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-white font-bold mb-4 shadow-lg shadow-emerald-100">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-slate-900">{step}</h4>
                  {idx < 4 && (
                    <div className="hidden absolute top-6 left-[60%] w-[80%] h-0.5 bg-slate-100 lg:block"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-emerald-700 px-8 py-16 text-center shadow-2xl lg:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">¿Listo para optimizar tu gestión fiscal?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-50">
              Únete a las empresas y contadores que ya están automatizando sus retenciones con RetenSaaS.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="https://wa.me/584145202075" target="_blank">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-100 font-bold px-8 h-14">
                  Solicitar demo personalizada
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white/40 bg-transparent text-white hover:bg-emerald-600/50 font-bold px-8 h-14 border-2">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
             <ShieldCheck className="h-5 w-5 text-emerald-700" />
             <span className="font-bold text-slate-900">RetenSaaS</span>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} RetenSaaS. Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            <Link href="mailto:soporte@retensaas.com" className="text-slate-400 hover:text-emerald-700 transition-colors">
              <Mail className="h-5 w-5" />
            </Link>
            <Link href="https://wa.me/584145202075" target="_blank" className="text-slate-400 hover:text-emerald-700 transition-colors">
              <MessageSquare className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
