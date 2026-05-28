const listaImoveis = document.getElementById("listaImoveis");
const buscaImoveis = document.getElementById("buscaImoveis");
const tipoImovel = document.getElementById("tipoImovel");
const operacaoImovel = document.getElementById("operacaoImovel");
const resetTipo = document.getElementById("resetTipo");
const resetOperacao = document.getElementById("resetOperacao");

/* ── MONTA A IMAGEM DO CARD ─────────────────────── */
function montarImagem(imovel) {
  if (imovel.fotos.length > 0) {
    return `<img src="${imovel.fotos[0]}" alt="${imovel.titulo}" />`;
  }
  return `
    <div class="sem-foto">
      <span>Foto em breve</span>
    </div>
  `;
}

/* ── MONTA OS DADOS DO CARD ─────────────────────── */
function montarDados(imovel) {
  const itens = [];
  if (imovel.area) itens.push(`<span>${imovel.area}</span>`);
  if (imovel.dormitorios)
    itens.push(`<span>${imovel.dormitorios} dorm.</span>`);
  if (imovel.banheiros) itens.push(`<span>${imovel.banheiros} banheiro</span>`);
  if (imovel.vagas) itens.push(`<span>${imovel.vagas} vaga(s)</span>`);
  return itens.join("");
}

/* ── RENDERIZA A LISTA ───────────────────────────── */
function renderizarImoveis(imoveis) {
  if (imoveis.length === 0) {
    listaImoveis.innerHTML = `
      <div class="resultado-vazio">
        <h3>Nenhum imóvel encontrado</h3>
        <p>Tente buscar por outro bairro, rua ou tipo de imóvel.</p>
      </div>
    `;
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

        <div class="dados-imovel">
          ${montarDados(imovel)}
        </div>

        <strong class="preco-imovel">${imovel.preco}</strong>

        <div class="botoes-card">
          <a class="btn-principal" href="${imovel.pagina}">Ver detalhes</a>
          <a class="btn-secundario" href="https://wa.me/5551995483061?text=${encodeURIComponent(`Olá, tenho interesse no imóvel ${imovel.codigo} - ${imovel.titulo}`)}" target="_blank">
            Tenho interesse
          </a>
        </div>
      </div>
    </article>
  `,
    )
    .join("");
}

/* ── ATUALIZA OS BOTÕES DE RESET ─────────────────── */
function atualizarResets() {
  // Mostra o × apenas quando um valor real está selecionado
  resetTipo.style.display = tipoImovel.value ? "flex" : "none";
  resetOperacao.style.display = operacaoImovel.value ? "flex" : "none";
}

/* ── FILTRA OS IMÓVEIS ───────────────────────────── */
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
      tipoSelecionado === "" || imovel.tipoFiltro === tipoSelecionado;

    const combinaOperacao =
      operacaoSelecionada === "" || imovel.operacao === operacaoSelecionada;

    return combinaTexto && combinaTipo && combinaOperacao;
  });

  atualizarResets();
  renderizarImoveis(filtrados);
}

/* ── RESET DOS SELECTS ───────────────────────────── */
resetTipo.addEventListener("click", () => {
  tipoImovel.value = "";
  filtrarImoveis();
});

resetOperacao.addEventListener("click", () => {
  operacaoImovel.value = "";
  filtrarImoveis();
});

/* ── LISTENERS ───────────────────────────────────── */
buscaImoveis.addEventListener("input", filtrarImoveis);
tipoImovel.addEventListener("change", filtrarImoveis);
operacaoImovel.addEventListener("change", filtrarImoveis);

/* ── RENDER INICIAL ──────────────────────────────── */
renderizarImoveis(IMOVEIS);
