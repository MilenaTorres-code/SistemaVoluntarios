"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Plus,
  Search,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  buscarPresencas,
  buscarResumo,
  buscarVoluntarios,
  cadastrarVoluntario,
  registrarPresenca,
} from "@/lib/api";

type Voluntario = {
  id: number;
  numeroCadastro: number;
  nome: string;
  cpf: string;
  celular: string;
  endereco: string;
  dataNascimento: string;
  sexo: string;
  ativo: boolean;
};

type Presenca = {
  id: number;
  voluntarioId: number;
  nome: string;
  sexo: string;
  numeroCadastro: number;
  data: string;
};

type Resumo = {
  data: string;
  total: number;
  homens: number;
  mulheres: number;
};

export default function Home() {
  const [mesAtual, setMesAtual] = useState(new Date(2026, 8, 12));
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date(2026, 8, 12)
  );
  const [calendarioAberto, setCalendarioAberto] = useState(false);

  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [resumo, setResumo] = useState<Resumo>({
    data: "",
    total: 0,
    homens: 0,
    mulheres: 0,
  });

  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(false);
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [formularioLogin, setFormularioLogin] = useState({
    email: "",
    senha: "",
  });

  const [formularioCadastro, setFormularioCadastro] = useState({
    numeroCadastro: "",
    nome: "",
    cpf: "",
    celular: "",
    endereco: "",
    dataNascimento: "",
    sexo: "MASCULINO",
  });

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const quantidadeDias = ultimoDia.getDate();
  const inicioSemana = (primeiroDia.getDay() + 6) % 7;

  const nomeMes = mesAtual.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const dataFormatada = dataSelecionada.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const dataApi = `${dataSelecionada.getFullYear()}-${String(
    dataSelecionada.getMonth() + 1
  ).padStart(2, "0")}-${String(dataSelecionada.getDate()).padStart(2, "0")}`;

  const voluntariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return voluntarios;
    }

    return voluntarios.filter((voluntario) =>
      voluntario.nome.toLowerCase().includes(termo)
    );
  }, [voluntarios, busca]);

  const idsPresentes = useMemo(() => {
    return new Set(presencas.map((presenca) => presenca.voluntarioId));
  }, [presencas]);

  useEffect(() => {
    carregarVoluntarios();
  }, []);

  useEffect(() => {
    carregarDadosDoDia();
  }, [dataSelecionada]);

  async function carregarVoluntarios() {
    try {
      const dados = await buscarVoluntarios();
      setVoluntarios(dados);
    } catch {
      mostrarMensagem("Não foi possível carregar os voluntários.", 4000);
    }
  }

  async function carregarDadosDoDia() {
    try {
      const [listaPresencas, dadosResumo] = await Promise.all([
        buscarPresencas(dataApi),
        buscarResumo(dataApi),
      ]);

      setPresencas(listaPresencas);
      setResumo(dadosResumo);
    } catch {
      mostrarMensagem("Não foi possível carregar os dados do dia.", 4000);
    }
  }

  function mostrarMensagem(texto: string, tempo = 3000) {
    setMensagem(texto);

    setTimeout(() => {
      setMensagem("");
    }, tempo);
  }

  function mudarMes(direcao: number) {
    const novoMes = new Date(ano, mes + direcao, 1);

    setMesAtual(novoMes);

    setDataSelecionada(
      new Date(novoMes.getFullYear(), novoMes.getMonth(), 1)
    );
  }

  function selecionarDia(dia: number) {
    setDataSelecionada(new Date(ano, mes, dia));
    setCalendarioAberto(false);
  }

  function abrirModal() {
    setBusca("");
    setMensagem("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setBusca("");
  }

  function abrirLogin() {
    setMensagem("");
    setFormularioLogin({
      email: "",
      senha: "",
    });
    setLoginAberto(true);
  }

  function fecharLogin() {
    if (carregandoLogin) {
      return;
    }
    setLoginAberto(false);
  }

  function abrirCadastro() {
    setMensagem("");
    setFormularioCadastro({
      numeroCadastro: "",
      nome: "",
      cpf: "",
      celular: "",
      endereco: "",
      dataNascimento: "",
      sexo: "MASCULINO",
    });
    setCadastroAberto(true);
  }

  function fecharCadastro() {
    if (carregandoCadastro) {
      return;
    }
    setCadastroAberto(false);
  }

  function atualizarCampoLogin(
    campo: keyof typeof formularioLogin,
    valor: string
  ) {
    setFormularioLogin((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function atualizarCampoCadastro(
    campo: keyof typeof formularioCadastro,
    valor: string
  ) {
    setFormularioCadastro((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function realizarLogin(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!formularioLogin.email.trim()) {
      mostrarMensagem("Informe o e-mail.");
      return;
    }

    if (!formularioLogin.senha.trim()) {
      mostrarMensagem("Informe a senha.");
      return;
    }

    try {
      setCarregandoLogin(true);
      setMensagem("");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoginAberto(false);
      mostrarMensagem("Login realizado com sucesso!");
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao realizar login.",
        4000
      );
    } finally {
      setCarregandoLogin(false);
    }
  }

  async function realizarCadastro(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!formularioCadastro.numeroCadastro.toString().trim()) {
      mostrarMensagem("Informe o número do cadastro.");
      return;
    }

    if (!formularioCadastro.nome.trim()) {
      mostrarMensagem("Informe o nome completo.");
      return;
    }

    if (!formularioCadastro.cpf.trim()) {
      mostrarMensagem("Informe o CPF.");
      return;
    }

    try {
      setCarregandoCadastro(true);
      setMensagem("");

      await cadastrarVoluntario({
        ...formularioCadastro,
        numeroCadastro: Number(formularioCadastro.numeroCadastro),
      });

      await carregarVoluntarios();
      setCadastroAberto(false);
      mostrarMensagem("Voluntário cadastrado com sucesso!");
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao cadastrar voluntário.",
        4000
      );
    } finally {
      setCarregandoCadastro(false);
    }
  }

  async function registrar(id: number) {
    const voluntario = voluntarios.find((item) => item.id === id);

    if (!voluntario) {
      return;
    }

    if (!voluntario.ativo) {
      mostrarMensagem(
        "Não é possível registrar presença para um voluntário inativo.",
        4000
      );
      return;
    }

    if (idsPresentes.has(id)) {
      mostrarMensagem(
        "Este voluntário já possui presença registrada nesta data."
      );
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      await registrarPresenca(id, dataApi);
      await carregarDadosDoDia();

      setBusca("");

      mostrarMensagem(
        `Presença de ${voluntario.nome} registrada com sucesso.`
      );
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao registrar presença.",
        4000
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fbf9] pb-32 text-[#16423c]">
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

          <button
            onClick={abrirLogin}
            className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-600 transition hover:bg-emerald-100 active:scale-95"
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <section className="mb-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                Controle diário
              </p>

              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#16423c]">
                Presenças
              </h2>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-400">
                Data selecionada
              </p>

              <p className="text-sm font-bold capitalize text-emerald-600">
                {dataFormatada}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-3.5 sm:p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <UserCheck size={18} />
            </div>

            <p className="text-xs font-bold text-emerald-700">Presentes</p>

            <p className="mt-1 text-2xl font-extrabold text-[#174b45] sm:text-3xl">
              {resumo.total}
            </p>

            <p className="mt-1 text-[10px] font-medium text-emerald-600 sm:text-xs">
              voluntários
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-sky-50/70 p-3.5 sm:p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-500">
              <UserRound size={18} />
            </div>

            <p className="text-xs font-bold text-sky-700">Homens</p>

            <p className="mt-1 text-2xl font-extrabold text-[#174b45] sm:text-3xl">
              {resumo.homens}
            </p>

            <p className="mt-1 text-[10px] font-medium text-sky-500 sm:text-xs">
              presentes
            </p>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-pink-50/70 p-3.5 sm:p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-500">
              <UserRound size={18} />
            </div>

            <p className="text-xs font-bold text-pink-700">Mulheres</p>

            <p className="mt-1 text-2xl font-extrabold text-[#174b45] sm:text-3xl">
              {resumo.mulheres}
            </p>

            <p className="mt-1 text-[10px] font-medium text-pink-500 sm:text-xs">
              presentes
            </p>
          </div>
        </section>

        <section className="mb-5 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <button
            onClick={() => setCalendarioAberto(!calendarioAberto)}
            className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-emerald-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <CalendarDays size={21} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Calendário
                </p>

                <p className="mt-0.5 text-sm font-extrabold capitalize text-[#174b45]">
                  {nomeMes}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 sm:block">
                {dataSelecionada.getDate()} de{" "}
                {dataSelecionada.toLocaleDateString("pt-BR", {
                  month: "long",
                })}
              </div>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition ${
                  calendarioAberto
                    ? "rotate-180 bg-emerald-50 text-emerald-500"
                    : ""
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {calendarioAberto && (
            <div className="border-t border-slate-100 px-4 pb-5 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => mudarMes(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <ChevronLeft size={18} />
                </button>

                <p className="text-sm font-extrabold capitalize text-[#174b45]">
                  {nomeMes}
                </p>

                <button
                  onClick={() => mudarMes(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7">
                {["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"].map(
                  (dia) => (
                    <div
                      key={dia}
                      className="py-2 text-center text-[9px] font-extrabold tracking-wide text-slate-400"
                    >
                      {dia}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-y-2">
                {Array.from({ length: inicioSemana }).map((_, index) => (
                  <div key={`vazio-${index}`} />
                ))}

                {Array.from({ length: quantidadeDias }, (_, index) => {
                  const dia = index + 1;

                  const selecionado =
                    dia === dataSelecionada.getDate() &&
                    mes === dataSelecionada.getMonth() &&
                    ano === dataSelecionada.getFullYear();

                  return (
                    <button
                      key={dia}
                      onClick={() => selecionarDia(dia)}
                      className="flex justify-center"
                    >
                      <div
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                          selecionado
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                            : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                        }`}
                      >
                        {dia}

                        <span
                          className={`absolute bottom-1 h-1 w-1 rounded-full ${
                            selecionado ? "bg-white" : "bg-emerald-300"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-500">
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-500">
                      Dia selecionado
                    </p>

                    <p className="text-xs font-extrabold capitalize text-[#174b45]">
                      {dataFormatada}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-emerald-600">
                  {resumo.total} presentes
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="mb-6">
          <button
            onClick={abrirModal}
            className="flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-100 transition hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-500">
              <Plus size={21} />
            </div>

            Registrar presença
          </button>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <Users size={19} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#174b45]">
                  Presenças do dia
                </h3>

                <p className="text-xs font-medium capitalize text-slate-400">
                  {dataFormatada}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-600">
              {resumo.total}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar voluntário..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2.5">
            {presencas.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-400">
                  <CalendarDays size={24} />
                </div>

                <p className="font-bold text-slate-600">
                  Nenhuma presença registrada
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Registre a primeira presença deste dia.
                </p>
              </div>
            ) : (
              presencas.map((presenca) => (
                <div
                  key={presenca.id}
                  className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-extrabold text-emerald-600">
                      {presenca.nome
                        .split(" ")
                        .slice(0, 2)
                        .map((parte) => parte[0])
                        .join("")}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-[#174b45]">
                        {presenca.nome}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        Cadastro #{presenca.numeroCadastro}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 sm:block">
                      Presente
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <UserCheck size={16} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* BARRA DE NAVEGAÇÃO FIXA NO RODAPÉ */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-100 bg-white/95 px-6 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-center">
          <button
            type="button"
            onClick={abrirCadastro}
            className="flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95 shadow-sm"
          >
            <UserRound size={18} />
            <span>Cadastro</span>
          </button>
        </div>
      </nav>

      {mensagem && (
        <div className="fixed left-4 right-4 top-4 z-[100] rounded-2xl bg-[#174b45] px-4 py-3 text-center text-sm font-bold text-white shadow-xl">
          {mensagem}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                  {dataFormatada}
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-[#174b45]">
                  Registrar presença
                </h3>
              </div>

              <button
                onClick={fecharModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar voluntário..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                autoFocus
              />
            </div>

            <div className="max-h-[55vh] space-y-2 overflow-y-auto">
              {voluntariosFiltrados.length === 0 ? (
                <div className="py-8 text-center">
                  <Search size={28} className="mx-auto mb-3 text-slate-300" />

                  <p className="font-bold text-slate-600">
                    Nenhum voluntário encontrado
                  </p>
                </div>
              ) : (
                voluntariosFiltrados.map((voluntario) => {
                  const presente = idsPresentes.has(voluntario.id);
                  const inativo = !voluntario.ativo;

                  return (
                    <div
                      key={voluntario.id}
                      className={`flex items-center justify-between rounded-2xl border p-3 ${
                        inativo
                          ? "border-slate-200 bg-slate-50 opacity-70"
                          : presente
                          ? "border-emerald-100 bg-emerald-50/60"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                            presente
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {voluntario.nome
                            .split(" ")
                            .slice(0, 2)
                            .map((parte) => parte[0])
                            .join("")}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {voluntario.nome}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Cadastro #{voluntario.numeroCadastro}
                          </p>

                          {inativo && (
                            <p className="mt-0.5 text-[10px] font-bold text-red-500">
                              Voluntário inativo
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        disabled={presente || inativo || carregando}
                        onClick={() => registrar(voluntario.id)}
                        className={`ml-3 shrink-0 rounded-xl px-3 py-2 text-[11px] font-extrabold transition ${
                          presente
                            ? "bg-emerald-100 text-emerald-700"
                            : inativo
                            ? "bg-slate-200 text-slate-400"
                            : "bg-emerald-500 text-white hover:bg-emerald-600"
                        }`}
                      >
                        {presente
                          ? "✓ Presente"
                          : inativo
                          ? "Inativo"
                          : carregando
                          ? "..."
                          : "Registrar"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={fecharModal}
              className="mt-4 w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-sm font-extrabold text-slate-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {loginAberto && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                  Acesso
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-[#174b45]">
                  Entrar no sistema
                </h3>
              </div>

              <button
                onClick={fecharLogin}
                disabled={carregandoLogin}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={realizarLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  E-mail
                </label>

                <input
                  type="email"
                  value={formularioLogin.email}
                  onChange={(e) =>
                    atualizarCampoLogin("email", e.target.value)
                  }
                  placeholder="seu.email@exemplo.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Senha
                </label>

                <input
                  type="password"
                  value={formularioLogin.senha}
                  onChange={(e) =>
                    atualizarCampoLogin("senha", e.target.value)
                  }
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <button
                type="submit"
                disabled={carregandoLogin}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                {carregandoLogin ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      )}

      {cadastroAberto && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                  Novo Registro
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-[#174b45]">
                  Cadastrar Voluntário
                </h3>
              </div>

              <button
                onClick={fecharCadastro}
                disabled={carregandoCadastro}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={realizarCadastro} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Número de Cadastro
                </label>
                <input
                  type="number"
                  value={formularioCadastro.numeroCadastro}
                  onChange={(e) =>
                    atualizarCampoCadastro("numeroCadastro", e.target.value)
                  }
                  placeholder="Ex: 101"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formularioCadastro.nome}
                  onChange={(e) =>
                    atualizarCampoCadastro("nome", e.target.value)
                  }
                  placeholder="Nome do voluntário"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  CPF
                </label>
                <input
                  type="text"
                  value={formularioCadastro.cpf}
                  onChange={(e) =>
                    atualizarCampoCadastro("cpf", e.target.value)
                  }
                  placeholder="000.000.000-00"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Celular
                </label>
                <input
                  type="text"
                  value={formularioCadastro.celular}
                  onChange={(e) =>
                    atualizarCampoCadastro("celular", e.target.value)
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formularioCadastro.endereco}
                  onChange={(e) =>
                    atualizarCampoCadastro("endereco", e.target.value)
                  }
                  placeholder="Rua, número, bairro"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formularioCadastro.dataNascimento}
                  onChange={(e) =>
                    atualizarCampoCadastro("dataNascimento", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Sexo
                </label>
                <select
                  value={formularioCadastro.sexo}
                  onChange={(e) =>
                    atualizarCampoCadastro("sexo", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                >
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={carregandoCadastro}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                {carregandoCadastro ? "Cadastrando..." : "Cadastrar Voluntário"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}