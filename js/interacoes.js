// ── CONFIGURAÇÃO ─────────────────────────────────────────────────────────────
// Após publicar o Apps Script como Web App, cole a URL gerada aqui:
const SHEETS_ENDPOINT = "COLE_AQUI_A_URL_DO_SEU_WEB_APP";

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const propertyList = document.getElementById("propertyList");
const contactForm = document.getElementById("contactForm");

const whatsappNumber = "5551995483061";

const properties = [
  {
    title: "Casa ampla em bairro residencial",
    tipo: "Casa",
    negocio: "Venda",
    cidade: "Guaíba",
    bairro: "Centro",
    quartos: 3,
    banheiros: 2,
    garagem: 2,
    valor: "R$ 690.000",
  },
  {
    title: "Apartamento moderno próximo a serviços",
    tipo: "Apartamento",
    negocio: "Aluguel",
    cidade: "Porto Alegre",
    bairro: "Menino Deus",
    quartos: 2,
    banheiros: 1,
    garagem: 1,
    valor: "R$ 2.800/mês",
  },
  {
    title: "Terreno com excelente potencial",
    tipo: "Terreno",
    negocio: "Venda",
    cidade: "Guaíba",
    bairro: "Santa Rita",
    quartos: 0,
    banheiros: 0,
    garagem: 0,
    valor: "R$ 260.000",
  },
  {
    title: "Sala comercial para locação",
    tipo: "Comercial",
    negocio: "Aluguel",
    cidade: "Porto Alegre",
    bairro: "Centro Histórico",
    quartos: 0,
    banheiros: 1,
    garagem: 0,
    valor: "R$ 1.900/mês",
  },
];

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

function renderProperties(lista) {
  if (!propertyList) return;

  propertyList.innerHTML = "";

  lista.forEach((property) => {
    propertyList.innerHTML += `
      <article class="property-card">
        <div class="property-image">
          <span class="property-badge">${property.negocio}</span>
        </div>

        <div class="property-content">
          <h3>${property.title}</h3>

          <p class="property-location">
            ${property.bairro}, ${property.cidade}
          </p>

          <div class="property-details">
            <span>${property.tipo}</span>
            <span>${property.quartos} quartos</span>
            <span>${property.banheiros} banheiros</span>
            <span>${property.garagem} vagas</span>
          </div>

          <strong class="property-price">${property.valor}</strong>

          <a
            class="property-link"
            href="https://wa.me/${whatsappNumber}"
            target="_blank"
          >
            Falar com corretor
          </a>
        </div>
      </article>
    `;
  });
}

if (propertyList) {
  renderProperties(properties);
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome")?.value?.trim() || "";
    const telefone = document.getElementById("telefone")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim() || "";
    const interesse = document.getElementById("interesse")?.value || "";
    const mensagem = document.getElementById("mensagem")?.value?.trim() || "";

    // 1. Abre o WhatsApp imediatamente (antes do await para evitar bloqueio do browser)
    const wppText = encodeURIComponent(
      `Olá! Meu nome é ${nome}.\nTelefone: ${telefone}\nE-mail: ${email}\nTenho interesse em: ${interesse}\nMensagem: ${mensagem}`,
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${wppText}`, "_blank");

    // 2. Salva no Google Sheets em segundo plano
    if (SHEETS_ENDPOINT !== "COLE_AQUI_A_URL_DO_SEU_WEB_APP") {
      try {
        await fetch(SHEETS_ENDPOINT, {
          method: "POST",
          body: JSON.stringify({ nome, telefone, email, interesse, mensagem }),
        });
      } catch (erro) {
        console.error("Sheets: erro ao salvar lead —", erro);
      }
    }

    // 3. Limpa o formulário e mostra feedback visual
    contactForm.reset();
    _mostrarFeedback("✓ Mensagem enviada! Entraremos em contato em breve.");
  });
}

function _mostrarFeedback(texto) {
  // Remove feedback anterior se houver
  const anterior = contactForm.querySelector(".form-feedback");
  if (anterior) anterior.remove();

  const aviso = document.createElement("p");
  aviso.className = "form-feedback";
  aviso.textContent = texto;
  aviso.style.cssText = [
    "background:#d1fae5",
    "color:#065f46",
    "border:1px solid #6ee7b7",
    "border-radius:10px",
    "padding:12px 16px",
    "margin-top:14px",
    "font-size:0.88rem",
    "font-weight:600",
    "text-align:center",
  ].join(";");

  contactForm.appendChild(aviso);
  setTimeout(() => aviso.remove(), 6000);
}
