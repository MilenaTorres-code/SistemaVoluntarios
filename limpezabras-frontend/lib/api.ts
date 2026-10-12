const API_URL = "https://localhost:7020/api";

export async function buscarPresencas(data: string) {
  const resposta = await fetch(
    `${API_URL}/Presencas?data=${data}`,
    {
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar presenças.");
  }

  return resposta.json();
}

export async function buscarResumo(data: string) {
  const resposta = await fetch(
    `${API_URL}/Presencas/resumo?data=${data}`,
    {
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar resumo.");
  }

  return resposta.json();
}

export async function buscarVoluntarios() {
  const resposta = await fetch(
    `${API_URL}/Voluntarios`,
    {
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar voluntários.");
  }

  return resposta.json();
}

export async function buscarVoluntario(id: number) {
  const resposta = await fetch(
    `${API_URL}/Voluntarios/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar voluntário.");
  }

  return resposta.json();
}

export async function cadastrarVoluntario(dados: {
  numeroCadastro: number;
  nome: string;
  cpf: string;
  celular: string;
  endereco: string;
  dataNascimento: string;
  sexo: string;
}) {
  const resposta = await fetch(
    `${API_URL}/Voluntarios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      texto || "Erro ao cadastrar voluntário."
    );
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function atualizarVoluntario(
  id: number,
  dados: {
    numeroCadastro: number;
    nome: string;
    cpf: string;
    celular: string;
    endereco: string;
    dataNascimento: string;
    sexo: string;
  }
) {
  const resposta = await fetch(
    `${API_URL}/Voluntarios/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      texto || "Erro ao atualizar voluntário."
    );
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function ativarVoluntario(id: number) {
  const resposta = await fetch(
    `${API_URL}/Voluntarios/${id}/ativar`,
    {
      method: "PATCH",
    }
  );

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      texto || "Erro ao ativar voluntário."
    );
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function inativarVoluntario(id: number) {
  const resposta = await fetch(
    `${API_URL}/Voluntarios/${id}/inativar`,
    {
      method: "PATCH",
    }
  );

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      texto || "Erro ao inativar voluntário."
    );
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function registrarPresenca(
  voluntarioId: number,
  data: string
) {
  const resposta = await fetch(
    `${API_URL}/Presencas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voluntarioId,
        data,
      }),
    }
  );

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      texto || "Erro ao registrar presença."
    );
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function removerPresenca(id: number) {
  const resposta = await fetch(
    `${API_URL}/Presencas/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao remover presença.");
  }

  return resposta.json();

}


export async function buscarVoluntariosPorNome(nome: string) {
  const resposta = await fetch(
    `${API_URL}/Voluntarios/buscar?nome=${encodeURIComponent(nome)}`,
    {
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar voluntários.");
  }

  return resposta.json();
}

export async function atualizarPresenca(
  id: number,
  voluntarioId: number,
  data: string
) {
  const resposta = await fetch(
    `${API_URL}/Presencas/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voluntarioId,
        data,
      }),
    }
  );

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      texto || "Erro ao alterar presença."
    );
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function buscarPresencasDoVoluntario(voluntarioId: number) {
  const resposta = await fetch(
    `${API_URL}/Presencas/voluntario/${voluntarioId}`,
    {
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar presenças do voluntário.");
  }

  return resposta.json();
}

export async function excluirVoluntario(id: number) {
  const resposta = await fetch(
    `${API_URL}/Voluntarios/${id}`,
    {
      method: "DELETE",
    }
  );

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      texto || "Erro ao excluir voluntário."
    );
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}
