const listaImoveis = document.getElementById("listaImoveis");
const buscaImoveis = document.getElementById("buscaImoveis");
const tipoImovel = document.getElementById("tipoImovel");

function montarImagem(imovel) {
  if (imovel.fotos.length > 0) {
    return `<img src="${imovel.fotos[0]}" alt="${imovel.titulo}" />`;
  }

  return `
    <div class="sem-foto">c
      <span>Foto em breve</span>
    </div>
  `;
}

function montarDados(imovel) {
  const itens = [];

  if (imovel.area) itens.push(`<span>${imovel.area}</span>`);
  if (imovel.dormitorios)
    itens.push(`<span>${imovel.dormitorios} dorm.</span>`);
  if (imovel.banheiros) itens.push(`<span>${imovel.banheiros} banheiro</span>`);
  if (imovel.vagas) itens.push(`<span>${imovel.vagas} vaga(s)</span>`);

  return itens.join("");
}

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

function filtrarImoveis() {
  const termo = buscaImoveis.value.toLowerCase().trim();
  const tipoSelecionado = tipoImovel.value;

  const filtrados = IMOVEIS.filter((imovel) => {
    const combinaTexto =
      imovel.titulo.toLowerCase().includes(termo) ||
      imovel.bairro.toLowerCase().includes(termo) ||
      imovel.endereco.toLowerCase().includes(termo) ||
      imovel.codigo.toLowerCase().includes(termo);

    const combinaTipo =
      tipoSelecionado === "" || imovel.tipoFiltro === tipoSelecionado;

    return combinaTexto && combinaTipo;
  });

  renderizarImoveis(filtrados);
}

buscaImoveis.addEventListener("input", filtrarImoveis);
tipoImovel.addEventListener("change", filtrarImoveis);

renderizarImoveis(IMOVEIS);
