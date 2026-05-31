/* ================================================================
   imoveis-lista.js — filtros + dropdowns customizados
   Anselmo Pedroso Imóveis
   ================================================================ */

const listaImoveis = document.getElementById("listaImoveis");
const buscaImoveis = document.getElementById("buscaImoveis");
const tipoImovel = document.getElementById("tipoImovel");
const operacaoImovel = document.getElementById("operacaoImovel");
const resetTipo = document.getElementById("resetTipo");
const resetOperacao = document.getElementById("resetOperacao");

/* ── Labels padrão de cada filtro ────────────────────────────── */
const LABEL_TIPO = "Tipo de imóvel";
const LABEL_OPERACAO = "Comprar ou alugar";

/* ── MONTA A IMAGEM DO CARD ──────────────────────────────────── */
function montarImagem(imovel) {
  if (imovel.fotos && imovel.fotos.length > 0) {
    return `<img src="${imovel.fotos[0]}" alt="${imovel.titulo}" loading="lazy" />`;
  }
  return `<div class="sem-foto"><span>Foto em breve</span></div>`;
}

/* ── MONTA OS DADOS DO CARD ──────────────────────────────────── */
function montarDados(imovel) {
  const itens = [];
  if (imovel.area) itens.push(`<span>${imovel.area}</span>`);
  if (imovel.dormitorios)
    itens.push(`<span>${imovel.dormitorios} dorm.</span>`);
  if (imovel.banheiros)
    itens.push(
      `<span>${imovel.banheiros} banheiro${imovel.banheiros > 1 ? "s" : ""}</span>`,
    );
  if (imovel.vagas) itens.push(`<span>${imovel.vagas} vaga(s)</span>`);
  return itens.join("");
}

/* ── RENDERIZA A LISTA ───────────────────────────────────────── */
function renderizarImoveis(imoveis) {
  if (imoveis.length === 0) {
    listaImoveis.innerHTML = `
      <div class="resultado-vazio">
        <h3>Nenhum imóvel encontrado</h3>
        <p>Tente buscar por outro bairro, rua ou tipo de imóvel.</p>
      </div>`;
    return;
  }

  listaImoveis.innerHTML = imoveis
    .map(
      (imovel) => `
    <article class="card-imovel">
      <a href="${imovel.pagina}" class="imagem-imovel">
        ${montarImagem(imovel)}
        <span class="tag-operacao">${imovel.operacao}</span>
      </a>
      <div class="conteudo-card-imovel">
        <div class="linha-card">
          <span class="tipo-imovel">${imovel.tipo}</span>
          <span class="codigo-imovel">Cód. ${imovel.codigo}</span>
        </div>
        <h2>${imovel.titulo}</h2>
        <p class="endereco-imovel">${imovel.endereco}</p>
        <div class="dados-imovel">${montarDados(imovel)}</div>
        <strong class="preco-imovel">${imovel.preco}</strong>
        <div class="botoes-card">
          <a class="btn-principal" href="${imovel.pagina}">Ver detalhes</a>
          <a class="btn-secundario"
             href="https://wa.me/5551995483061?text=${encodeURIComponent(`Olá, tenho interesse no imóvel ${imovel.codigo} - ${imovel.titulo}`)}"
             target="_blank">
            Tenho interesse
          </a>
        </div>
      </div>
    </article>`,
    )
    .join("");
}

/* ── ATUALIZA BOTÕES × E CHIPS ───────────────────────────────── */
function sincronizarUI() {
  resetTipo.style.display = tipoImovel.value ? "flex" : "none";
  resetOperacao.style.display = operacaoImovel.value ? "flex" : "none";

  document.querySelectorAll(".chip-filtro").forEach((chip) => {
    const matchTipo =
      chip.dataset.tipo && chip.dataset.tipo === tipoImovel.value;
    const matchOp =
      chip.dataset.operacao && chip.dataset.operacao === operacaoImovel.value;
    chip.classList.toggle("ativo", matchTipo || matchOp);
  });
}

/* ── FILTRA OS IMÓVEIS ───────────────────────────────────────── */
function filtrarImoveis() {
  const termo = buscaImoveis.value.toLowerCase().trim();
  const tipoSelecionado = tipoImovel.value;
  const operacaoSelecionada = operacaoImovel.value;

  const filtrados = IMOVEIS.filter((imovel) => {
    const combinaTexto =
      imovel.titulo.toLowerCase().includes(termo) ||
      imovel.bairro.toLowerCase().includes(termo) ||
      imovel.endereco.toLowerCase().includes(termo) ||
      imovel.codigo.toLowerCase().includes(termo);

    const combinaTipo =
      !tipoSelecionado || imovel.tipoFiltro === tipoSelecionado;

    const combinaOperacao =
      !operacaoSelecionada || imovel.operacao === operacaoSelecionada;

    return combinaTexto && combinaTipo && combinaOperacao;
  });

  sincronizarUI();
  renderizarImoveis(filtrados);
}

/* ── HELPERS DE DROPDOWN ─────────────────────────────────────── */
function sincronizarDropdown(selectId, labelPadrao) {
  const dropdown = document.querySelector(
    `.filtro-custom[data-select="${selectId}"]`,
  );
  if (!dropdown) return;

  const selectEl = document.getElementById(selectId);
  const textoEl = dropdown.querySelector(".filtro-custom-text");
  const opcoes = dropdown.querySelectorAll(".filtro-custom-menu button");
  const valor = selectEl ? selectEl.value : "";

  if (textoEl) {
    if (valor) {
      const opcaoAtiva = dropdown.querySelector(
        `.filtro-custom-menu button[data-value="${valor}"]`,
      );
      textoEl.textContent = opcaoAtiva
        ? opcaoAtiva.textContent.trim()
        : labelPadrao;
    } else {
      textoEl.textContent = labelPadrao;
    }
  }

  opcoes.forEach((btn) => {
    btn.classList.toggle("selecionado", btn.dataset.value === valor);
  });
}

/* ── RESET DOS FILTROS ───────────────────────────────────────── */
resetTipo.addEventListener("click", () => {
  tipoImovel.value = "";
  sincronizarDropdown("tipoImovel", LABEL_TIPO);
  filtrarImoveis();
});

resetOperacao.addEventListener("click", () => {
  operacaoImovel.value = "";
  sincronizarDropdown("operacaoImovel", LABEL_OPERACAO);
  filtrarImoveis();
});

/* ── LISTENERS NATIVOS ────────────────────────────────────────── */
buscaImoveis.addEventListener("input", filtrarImoveis);
tipoImovel.addEventListener("change", filtrarImoveis);
operacaoImovel.addEventListener("change", filtrarImoveis);

/* ── DROPDOWNS CUSTOMIZADOS ──────────────────────────────────── */
document.querySelectorAll(".filtro-custom").forEach((dropdown) => {
  const selectId = dropdown.dataset.select;
  const selectReal = document.getElementById(selectId);
  const botao = dropdown.querySelector(".filtro-custom-btn");
  const textoEl = dropdown.querySelector(".filtro-custom-text");
  const opcoes = dropdown.querySelectorAll(".filtro-custom-menu button");
  const labelPadrao = selectId === "tipoImovel" ? LABEL_TIPO : LABEL_OPERACAO;

  if (!selectReal || !botao || !textoEl) return;

  botao.addEventListener("click", (e) => {
    e.stopPropagation();
    const estaAberto = dropdown.classList.contains("ativo");

    document.querySelectorAll(".filtro-custom").forEach((d) => {
      d.classList.remove("ativo");
      const btn = d.querySelector(".filtro-custom-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    if (!estaAberto) {
      dropdown.classList.add("ativo");
      botao.setAttribute("aria-expanded", "true");
    }
  });

  opcoes.forEach((opcao) => {
    opcao.addEventListener("click", (e) => {
      e.stopPropagation();
      const valor = opcao.dataset.value;

      selectReal.value = valor;
      textoEl.textContent = valor ? opcao.textContent.trim() : labelPadrao;

      opcoes.forEach((btn) => btn.classList.remove("selecionado"));
      opcao.classList.add("selecionado");

      dropdown.classList.remove("ativo");
      botao.setAttribute("aria-expanded", "false");

      filtrarImoveis();
    });
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".filtro-custom").forEach((d) => {
    d.classList.remove("ativo");
    const btn = d.querySelector(".filtro-custom-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".filtro-custom").forEach((d) => {
      d.classList.remove("ativo");
    });
  }
});

/* ── CHIPS RÁPIDOS ───────────────────────────────────────────── */
document.querySelectorAll(".chip-filtro").forEach((chip) => {
  chip.addEventListener("click", () => {
    const tipo = chip.dataset.tipo || null;
    const operacao = chip.dataset.operacao || null;

    if (tipo !== null) {
      // Toggle: clica no mesmo chip ativo → limpa o filtro
      const novoValor = tipoImovel.value === tipo ? "" : tipo;
      tipoImovel.value = novoValor;
      sincronizarDropdown("tipoImovel", LABEL_TIPO);
    }

    if (operacao !== null) {
      const novoValor = operacaoImovel.value === operacao ? "" : operacao;
      operacaoImovel.value = novoValor;
      sincronizarDropdown("operacaoImovel", LABEL_OPERACAO);
    }

    filtrarImoveis();
  });
});

/* ── RENDER INICIAL ──────────────────────────────────────────── */
renderizarImoveis(IMOVEIS);
