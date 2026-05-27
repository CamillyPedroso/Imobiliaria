/*
  imovel-pagina.js  —  versão melhorada
  Substitui o arquivo js/imovel-pagina.js
  Mantém 100% da lógica original; adiciona:
    - faixa visual de características
    - seção "Sobre" com lista de destaques em duas colunas
    - box de código mais elegante
    - botão "Agendar visita"
*/

(function () {
  const slug = document.body.dataset.imovel;
  const imovel = IMOVEIS.find((i) => i.slug === slug);
  const main = document.getElementById("conteudoImovel");

  if (!imovel) {
    main.innerHTML = `
      <div class="imovel-erro">
        <h2>Imóvel não encontrado.</h2>
        <a href="../imoveis.html">← Voltar para imóveis</a>
      </div>`;
    return;
  }

  // Título da aba
  document.title = `${imovel.titulo} | Imóvel`;

  /* ── HELPERS ─────────────────────────────────────────────── */

  function montarTags() {
    const tags = [];
    if (imovel.area)
      tags.push(
        `<span class="tag-dado"><i class="ri-ruler-line"></i> ${imovel.area}</span>`,
      );
    if (imovel.dormitorios)
      tags.push(
        `<span class="tag-dado"><i class="ri-hotel-bed-line"></i> ${imovel.dormitorios} dorm.</span>`,
      );
    if (imovel.banheiros)
      tags.push(
        `<span class="tag-dado"><i class="ri-drop-line"></i> ${imovel.banheiros} banheiro${imovel.banheiros > 1 ? "s" : ""}</span>`,
      );
    if (imovel.vagas)
      tags.push(
        `<span class="tag-dado"><i class="ri-car-line"></i> ${imovel.vagas} vaga${imovel.vagas > 1 ? "s" : ""}</span>`,
      );
    return tags.join("");
  }

  // Faixa horizontal com ícones grandes
  function montarFaixa() {
    const items = [];
    if (imovel.area)
      items.push(`
        <div class="faixa-item">
          <div class="faixa-icone"><i class="ri-ruler-2-line"></i></div>
          <div><span class="faixa-valor">${imovel.area}</span><span class="faixa-label">Área construída</span></div>
        </div>`);
    if (imovel.dormitorios)
      items.push(`
        <div class="faixa-item">
          <div class="faixa-icone"><i class="ri-hotel-bed-line"></i></div>
          <div><span class="faixa-valor">${imovel.dormitorios}</span><span class="faixa-label">Dormitório${imovel.dormitorios > 1 ? "s" : ""}</span></div>
        </div>`);
    if (imovel.banheiros)
      items.push(`
        <div class="faixa-item">
          <div class="faixa-icone"><i class="ri-drop-line"></i></div>
          <div><span class="faixa-valor">${imovel.banheiros}</span><span class="faixa-label">Banheiro${imovel.banheiros > 1 ? "s" : ""}</span></div>
        </div>`);

    // Sempre mostra bairro/cidade como último item
    items.push(`
      <div class="faixa-item">
        <div class="faixa-icone"><i class="ri-map-pin-2-line"></i></div>
        <div><span class="faixa-valor">${imovel.bairro}</span><span class="faixa-label">${imovel.cidade}</span></div>
      </div>`);

    // Se tiver vagas, substitui o quarto item pelo item de vagas e empurra localização
    if (imovel.vagas && items.length >= 4) {
      items.splice(
        3,
        0,
        `
        <div class="faixa-item">
          <div class="faixa-icone"><i class="ri-car-line"></i></div>
          <div><span class="faixa-valor">${imovel.vagas}</span><span class="faixa-label">Vaga${imovel.vagas > 1 ? "s" : ""}</span></div>
        </div>`,
      );
      // mantém só 4 itens — remove o excedente
      items.splice(4);
    }

    // Garante exatamente 4 colunas preenchendo com localização se precisar
    while (items.length < 4) {
      items.push(
        `<div class="faixa-item"><div class="faixa-icone"><i class="ri-map-pin-2-line"></i></div><div><span class="faixa-valor">${imovel.bairro}</span><span class="faixa-label">${imovel.cidade}</span></div></div>`,
      );
    }

    return `<div class="faixa-caracteristicas">${items.slice(0, 4).join("")}</div>`;
  }

  // Galeria de fotos
  function montarGaleria() {
    if (!imovel.fotos || imovel.fotos.length === 0)
      return `<div class="galeria-sem-foto"><span>Fotos em breve</span></div>`;

    const thumbs = imovel.fotos
      .map(
        (foto, i) => `
        <button class="thumb ${i === 0 ? "ativo" : ""}" onclick="trocarFoto(${i})" aria-label="Foto ${i + 1}">
          <img src="${foto}" alt="Foto ${i + 1}" loading="lazy" />
        </button>`,
      )
      .join("");

    const videoBtn = imovel.video
      ? `<button class="thumb thumb-video" onclick="abrirVideo()" aria-label="Ver vídeo">
           <span class="icone-play"><i class="ri-play-circle-line"></i></span>
           <span>Vídeo</span>
         </button>`
      : "";

    const modalVideo = imovel.video
      ? `<div class="modal-video" id="modalVideo" onclick="fecharVideo(event)">
           <div class="modal-video-inner">
             <button class="fechar-modal" onclick="fecharVideo()"><i class="ri-close-line"></i></button>
             <video id="videoPlayer" controls><source src="${imovel.video}" type="video/mp4"></video>
           </div>
         </div>`
      : "";

    return `
      <div class="galeria-wrapper">
        <div class="foto-principal-wrapper">
          <img id="fotoPrincipal" src="${imovel.fotos[0]}" alt="${imovel.titulo}" class="foto-principal" />
          ${
            imovel.fotos.length > 1
              ? `<button class="nav-foto prev" onclick="navegarFoto(-1)" aria-label="Foto anterior"><i class="ri-arrow-left-s-line"></i></button>
               <button class="nav-foto next" onclick="navegarFoto(1)"  aria-label="Próxima foto" ><i class="ri-arrow-right-s-line"></i></button>`
              : ""
          }
          <span class="contador-fotos" id="contadorFotos">1 / ${imovel.fotos.length}</span>
        </div>
        <div class="thumbs-wrapper">${thumbs}${videoBtn}</div>
      </div>
      ${modalVideo}`;
  }

  // Descrição: texto à esquerda + destaques à direita
  function montarDescricao() {
    if (!imovel.descricao || imovel.descricao.length === 0) return "";

    const paragrafos = imovel.descricao.map((p) => `<p>${p}</p>`).join("");

    // Extrai frases-chave de cada parágrafo para montar os destaques
    const destaques = imovel.descricao
      .map((p) => {
        // Pega a primeira frase (até o primeiro ponto ou máx 80 chars)
        const frase = p.split(/[.!?]/)[0].trim();
        return frase.length > 8
          ? `<li><i class="ri-checkbox-circle-line"></i>${frase}</li>`
          : "";
      })
      .filter(Boolean)
      .join("");

    return `
      <div class="descricao-inner">
        <div class="descricao-texto">${paragrafos}</div>
        <div class="descricao-destaques">
          <div class="destaques-titulo">
            <i class="ri-star-line"></i> Destaques do imóvel
          </div>
          <ul class="destaques-lista">${destaques}</ul>
        </div>
      </div>`;
  }

  // Link WhatsApp com mensagem personalizada
  const wppMsg = encodeURIComponent(
    `Olá! Tenho interesse no imóvel ${imovel.codigo} - ${imovel.titulo}`,
  );
  const wppVisita = encodeURIComponent(
    `Olá! Gostaria de agendar uma visita ao imóvel ${imovel.codigo} - ${imovel.titulo}`,
  );
  const wppBase = "https://wa.me/5551995483061?text=";

  /* ── RENDER PRINCIPAL ────────────────────────────────────── */

  main.innerHTML = `
    <div class="pagina-imovel">

      <div class="breadcrumb-imovel">
        <a href="../../index.html">Início</a>
        <i class="ri-arrow-right-s-line"></i>
        <a href="../imoveis.html">Imóveis</a>
        <i class="ri-arrow-right-s-line"></i>
        <span>${imovel.titulo}</span>
      </div>

      <!-- Grid galeria + card info -->
      <div class="imovel-grid">

        <div class="imovel-col-galeria">
          ${montarGaleria()}
        </div>

        <div class="imovel-col-info">

          <!-- Cabeçalho -->
          <div class="imovel-cabecalho">
            <div class="imovel-linha-topo">
              <span class="badge-tipo">${imovel.tipo}</span>
              <span class="badge-operacao">${imovel.operacao}</span>
            </div>
            <h1 class="imovel-titulo">${imovel.titulo}</h1>
            <p class="imovel-endereco">
              <i class="ri-map-pin-line"></i>
              ${imovel.endereco}
            </p>
          </div>

          <!-- Tags de dados -->
          <div class="imovel-tags">${montarTags()}</div>

          <!-- Preço -->
          <div class="imovel-preco-box">
            <span class="label-preco">Valor do imóvel</span>
            <strong class="imovel-preco">${imovel.preco}</strong>
          </div>

          <!-- Chamada curta -->
          <p class="imovel-chamada">${imovel.chamada}</p>

          <!-- Botões de contato -->
          <div class="imovel-cta">
            <a class="btn-whatsapp-imovel"
               href="${wppBase}${wppMsg}"
               target="_blank">
              <i class="ri-whatsapp-line"></i>
              Falar com corretor
            </a>
            <a class="btn-agendar-visita"
               href="${wppBase}${wppVisita}"
               target="_blank">
              <i class="ri-calendar-check-line"></i>
              Agendar visita
            </a>
          </div>

          <!-- Código -->
          <span class="imovel-codigo">Cód. ${imovel.codigo}</span>

        </div>
      </div>

      <!-- Faixa visual de características -->
      ${montarFaixa()}

      <!-- Sobre o imóvel -->
      <div class="imovel-descricao">
        <h2>Sobre o imóvel</h2>
        ${montarDescricao()}
      </div>

      <!-- Botão voltar -->
      <div class="imovel-voltar">
        <a href="../imoveis.html">
          <i class="ri-arrow-left-line"></i> Ver todos os imóveis
        </a>
      </div>

    </div>
  `;

  /* ── CONTROLE DA GALERIA ─────────────────────────────────── */

  let fotoAtual = 0;

  window.trocarFoto = function (index) {
    fotoAtual = index;
    document.getElementById("fotoPrincipal").src = imovel.fotos[index];
    document.getElementById("contadorFotos").textContent =
      `${index + 1} / ${imovel.fotos.length}`;
    document
      .querySelectorAll(".thumb")
      .forEach((t, i) => t.classList.toggle("ativo", i === index));
  };

  window.navegarFoto = function (dir) {
    const total = imovel.fotos.length;
    fotoAtual = (fotoAtual + dir + total) % total;
    trocarFoto(fotoAtual);
  };

  window.abrirVideo = function () {
    document.getElementById("modalVideo").style.display = "flex";
  };

  window.fecharVideo = function (e) {
    if (
      !e ||
      e.target.id === "modalVideo" ||
      e.target.classList.contains("fechar-modal") ||
      e.target.closest(".fechar-modal")
    ) {
      document.getElementById("modalVideo").style.display = "none";
      document.getElementById("videoPlayer").pause();
    }
  };

  // Teclado
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") navegarFoto(-1);
    if (e.key === "ArrowRight") navegarFoto(1);
    if (e.key === "Escape") fecharVideo();
  });
})();
