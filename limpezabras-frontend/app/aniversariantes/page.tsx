"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Cake, Gift, PartyPopper } from "lucide-react";

import { buscarAniversariantes } from "@/lib/api";

type Aniversariante = {
  id: number;
  numeroCadastro: number;
  nome: string;
  dataNascimento: string;
  dia: number;
};

const azulEscuro = "#1e3a8a";
const azul = "#3b5bdb";
const azulClaro = "#edf0ff";

export default function Aniversariantes() {
  const router = useRouter();

  const [liberado, setLiberado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;

  const nomeMes = hoje.toLocaleDateString("pt-BR", {
    month: "long",
  });

  useEffect(() => {
    let usuarioSalvo = null;

    try {
      usuarioSalvo = localStorage.getItem("usuario");
    } catch {
      usuarioSalvo = null;
    }

    if (!usuarioSalvo) {
      router.replace("/");
      return;
    }

    setLiberado(true);
    carregar();
  }, []);

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarAniversariantes(mesAtual);
      setAniversariantes(dados.aniversariantes);
    } catch {
      setErro("Não foi possível carregar os aniversariantes.");
    } finally {
      setCarregando(false);
    }
  }

  if (!liberado) {
    return null;
  }

  return (
    <main
      className="min-h-screen pb-16"
      style={{ background: "#f5f7ff", color: "#174b45" }}
    >
      <header className="border-b bg-white" style={{ borderColor: "#e0e7ff" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#174b45]">
              Limpeza <span className="text-emerald-500">Brás</span>
            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Juntos por um propósito maior
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-8">
        <section
          className="mb-5 overflow-hidden rounded-3xl shadow-sm"
          style={{ background: azulClaro, border: "1px solid #e0e7ff" }}
        >
          <img
            src="/aniversario.jpg"
            alt="Feliz aniversário"
            className="block w-full"
            style={{ aspectRatio: "1748 / 1240", objectFit: "cover" }}
          />

          <div className="flex items-center gap-4 bg-white px-5 py-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
              style={{ background: `linear-gradient(135deg, ${azul}, #60a5fa)` }}
            >
              <Cake size={24} />
            </div>

            <div className="min-w-0">
              <h2
                className="text-lg font-extrabold tracking-tight"
                style={{ color: azulEscuro }}
              >
                Aniversariantes de <span className="capitalize">{nomeMes}</span>
              </h2>

              <p
                className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: azul }}
              >
                <PartyPopper size={16} />
                {aniversariantes.length === 1
                  ? "1 voluntário faz aniversário este mês"
                  : `${aniversariantes.length} voluntários fazem aniversário este mês`}
              </p>
            </div>
          </div>
        </section>

        <section
          className="rounded-3xl bg-white p-4 shadow-sm"
          style={{ border: "1px solid #e0e7ff" }}
        >
          {carregando ? (
            <p className="py-6 text-center text-sm font-bold text-slate-400">
              Carregando...
            </p>
          ) : erro ? (
            <p className="py-6 text-center text-sm font-bold text-red-500">
              {erro}
            </p>
          ) : aniversariantes.length === 0 ? (
            <div className="py-8 text-center">
              <span style={{ color: "#a5b4fc" }}>
                <Cake size={28} className="mx-auto mb-3" />
              </span>

              <p className="font-bold text-slate-600">
                Nenhum aniversariante neste mês.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {aniversariantes.map((aniversariante) => {
                const aniversarioHoje = aniversariante.dia === hoje.getDate();

                return (
                  <div
                    key={aniversariante.id}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3"
                    style={{
                      background: aniversarioHoje
                        ? "linear-gradient(90deg, #e0e7ff, #eff6ff)"
                        : "#f8f9ff",
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white shadow-sm"
                      style={{ color: azul }}
                    >
                      <span className="text-sm font-extrabold leading-none">
                        {String(aniversariante.dia).padStart(2, "0")}
                      </span>

                      <span className="mt-0.5 text-[9px] font-bold uppercase">
                        {nomeMes.slice(0, 3)}
                      </span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#174b45]">
                        {aniversariante.nome}
                      </p>

                      <p className="text-[11px] font-medium text-slate-400">
                        Cadastro #{aniversariante.numeroCadastro}
                      </p>
                    </div>

                    {aniversarioHoje ? (
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold text-white"
                        style={{
                          background: `linear-gradient(90deg, ${azul}, #60a5fa)`,
                        }}
                      >
                        Hoje!
                      </span>
                    ) : (
                      <span className="shrink-0" style={{ color: "#93a5f5" }}>
                        <Gift size={18} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
