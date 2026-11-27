"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Mail, Trash2, UserPlus, Users } from "lucide-react";

import { buscarUsuarios, cadastrarUsuario, excluirUsuario } from "@/lib/api";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
};

export default function Usuarios() {
  const router = useRouter();

  const [liberado, setLiberado] = useState(false);
  const [idLogado, setIdLogado] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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

    try {
      setIdLogado(JSON.parse(usuarioSalvo).id ?? null);
    } catch {
      setIdLogado(null);
    }

    setLiberado(true);
    carregar();
  }, []);

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarUsuarios();
      setUsuarios(dados);
    } catch {
      setErro("Não foi possível carregar os usuários.");
    } finally {
      setCarregando(false);
    }
  }

  function mostrarMensagem(texto: string) {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3000);
  }

  async function criarUsuario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nome.trim() || !email.trim() || !senha) {
      mostrarMensagem("Preencha nome, e-mail e senha.");
      return;
    }

    if (senha.length < 6) {
      mostrarMensagem("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setSalvando(true);

      await cadastrarUsuario(nome.trim(), email.trim(), senha);

      setNome("");
      setEmail("");
      setSenha("");

      mostrarMensagem("Usuário criado com sucesso.");
      carregar();
    } catch (e) {
      mostrarMensagem(e instanceof Error ? e.message : "Erro ao criar usuário.");
    } finally {
      setSalvando(false);
    }
  }

  async function remover(usuario: Usuario) {
    if (!window.confirm(`Excluir o usuário ${usuario.nome}?`)) {
      return;
    }

    try {
      await excluirUsuario(usuario.id);

      mostrarMensagem("Usuário excluído.");
      carregar();
    } catch (e) {
      mostrarMensagem(e instanceof Error ? e.message : "Erro ao excluir usuário.");
    }
  }

  if (!liberado) {
    return null;
  }

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
        <section className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
            Acesso
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#16423c]">
            Usuários do sistema
          </h2>

          <p className="mt-0.5 text-sm font-medium text-slate-400">
            Crie contas para quem vai usar o sistema.
          </p>
        </section>

        <section className="mb-5 rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <UserPlus size={19} />
            </div>

            <h3 className="text-base font-extrabold text-[#174b45]">
              Novo usuário
            </h3>
          </div>

          <form onSubmit={criarUsuario} className="space-y-3">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
            />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
            />

            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
            />

            <button
              type="submit"
              disabled={salvando}
              className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60"
            >
              {salvando ? "Criando..." : "Criar usuário"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <Users size={19} />
              </div>

              <h3 className="text-base font-extrabold text-[#174b45]">
                Usuários cadastrados
              </h3>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-600">
              {usuarios.length}
            </span>
          </div>

          {carregando ? (
            <p className="py-6 text-center text-sm font-bold text-slate-400">
              Carregando...
            </p>
          ) : erro ? (
            <p className="py-6 text-center text-sm font-bold text-red-500">
              {erro}
            </p>
          ) : (
            <div className="space-y-2.5">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#174b45]">
                      {usuario.nome}
                      {usuario.id === idLogado && (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600">
                          Você
                        </span>
                      )}
                    </p>

                    <p className="flex items-center gap-1 truncate text-xs font-medium text-slate-400">
                      <Mail size={12} />
                      {usuario.email}
                    </p>
                  </div>

                  {usuario.id !== idLogado && (
                    <button
                      type="button"
                      onClick={() => remover(usuario)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 active:scale-95"
                      aria-label={`Excluir ${usuario.nome}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {mensagem && (
        <div className="fixed left-4 right-4 top-4 z-[100] rounded-2xl bg-[#174b45] px-4 py-3 text-center text-sm font-bold text-white shadow-xl">
          {mensagem}
        </div>
      )}
    </main>
  );
}
