"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, CalendarDays, TrendingUp, Users } from "lucide-react";

import { buscarFrequencia } from "@/lib/api";

type FrequenciaVoluntario = {
  id: number;
  numeroCadastro: number;
  nome: string;
  presencas: number;
  percentual: number;
  classificacao: string;
};

type ResultadoFrequencia = {
  mes: number;
  ano: number;
  totalDiasAtividade: number;
  totalVoluntarios: number;
  mediaFrequencia: number;
  frequenciaAlta: number;
  frequenciaMedia: number;
  frequenciaBaixa: number;
  voluntarios: FrequenciaVoluntario[];
};

const cores: Record<string, { forte: string; fundo: string }> = {
  Alta: { forte: "#10b981", fundo: "#ecfdf5" },
  Média: { forte: "#f59e0b", fundo: "#fffbeb" },
  Baixa: { forte: "#f43f5e", fundo: "#fff1f2" },
  "Sem atividade": { forte: "#94a3b8", fundo: "#f1f5f9" },
};

function mesAtualTexto() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

export default function Frequencia() {
  const router = useRouter();

  const [liberado, setLiberado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState(mesAtualTexto);
  const [resultado, setResultado] = useState<ResultadoFrequencia | null>(null);

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
  }, []);

  useEffect(() => {
    if (!liberado || !mesSelecionado) {
      return;
    }

    carregar();
  }, [liberado, mesSelecionado]);

  async function carregar() {
    const [ano, mes] = mesSelecionado.split("-").map(Number);

    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarFrequencia(mes, ano);
      setResultado(dados);
    } catch {
      setErro("Não foi possível carregar a frequência.");
    } finally {
      setCarregando(false);
    }
  }

  if (!liberado) {
    return null;
  }

  const nomeMes = mesSelecionado
    ? new Date(`${mesSelecionado}-01T12:00:00`).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "";

  const semAtividade = resultado !== null && resultado.totalDiasAtividade === 0;

  return (
    <main
      className="min-h-screen pb-16"
      style={{ background: "#f7fbf9", color: "#16423c" }}
    >
      <header className="border-b border-emerald-50 bg-white">
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

      <div className="mx-auto max-w-3xl px-5 py-6">
        <section className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              Indicador
            </p>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#16423c]">
              Frequência dos voluntários
            </h2>

            <p className="mt-0.5 text-sm font-medium capitalize text-slate-400">
              {nomeMes}
            </p>
          </div>

          <label className="flex flex-col text-xs font-bold text-slate-500">
            Mês
            <input
              type="month"
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              className="mt-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
            />
          </label>
        </section>

        {carregando ? (
          <p className="py-10 text-center text-sm font-bold text-slate-400">
            Carregando...
          </p>
        ) : erro ? (
          <p className="py-10 text-center text-sm font-bold text-red-500">
            {erro}
          </p>
        ) : resultado ? (
          <>
            <section className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CalendarDays size={18} />
                </div>

                <p className="text-xs font-bold text-slate-500">
                  Dias de atividade
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#174b45]">
                  {resultado.totalDiasAtividade}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <TrendingUp size={18} />
                </div>

                <p className="text-xs font-bold text-slate-500">
                  Frequência média
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#174b45]">
                  {resultado.mediaFrequencia.toLocaleString("pt-BR")}%
                </p>
              </div>
            </section>

            <section className="mb-5 grid grid-cols-3 gap-3">
              {[
                { rotulo: "Alta", valor: resultado.frequenciaAlta, faixa: "75% ou mais" },
                { rotulo: "Média", valor: resultado.frequenciaMedia, faixa: "50% a 74%" },
                { rotulo: "Baixa", valor: resultado.frequenciaBaixa, faixa: "abaixo de 50%" },
              ].map((item) => (
                <div
                  key={item.rotulo}
                  className="rounded-3xl p-3.5"
                  style={{
                    background: cores[item.rotulo].fundo,
                    border: `1px solid ${cores[item.rotulo].forte}33`,
                  }}
                >
                  <p
                    className="text-xs font-bold"
                    style={{ color: cores[item.rotulo].forte }}
                  >
                    {item.rotulo}
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-[#174b45]">
                    {item.valor}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    {item.faixa}
                  </p>
                </div>
              ))}
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                    <Users size={19} />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-[#174b45]">
                      Voluntários ativos
                    </h3>

                    <p className="text-xs font-medium text-slate-400">
                      Presenças no mês ÷ dias de atividade
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-600">
                  {resultado.totalVoluntarios}
                </span>
              </div>

              {semAtividade && (
                <p className="mb-3 rounded-2xl bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-500">
                  Nenhuma presença registrada neste mês.
                </p>
              )}

              {resultado.voluntarios.length === 0 ? (
                <p className="py-6 text-center text-sm font-bold text-slate-500">
                  Nenhum voluntário ativo.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {resultado.voluntarios.map((voluntario) => {
                    const cor =
                      cores[voluntario.classificacao] ?? cores["Sem atividade"];

                    return (
                      <div
                        key={voluntario.id}
                        className="rounded-2xl border border-slate-100 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#174b45]">
                              {voluntario.nome}
                            </p>

                            <p className="text-[11px] font-medium text-slate-400">
                              Cadastro #{voluntario.numeroCadastro} ·{" "}
                              {voluntario.presencas} de{" "}
                              {resultado.totalDiasAtividade}{" "}
                              {resultado.totalDiasAtividade === 1 ? "dia" : "dias"}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-sm font-extrabold text-[#174b45]">
                              {voluntario.percentual.toLocaleString("pt-BR")}%
                            </span>

                            <span
                              className="rounded-full px-2.5 py-1 text-[10px] font-extrabold"
                              style={{ background: cor.fundo, color: cor.forte }}
                            >
                              {voluntario.classificacao}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(voluntario.percentual, 100)}%`,
                              background: cor.forte,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
