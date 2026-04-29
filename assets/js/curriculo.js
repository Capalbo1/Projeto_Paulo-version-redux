document.addEventListener("DOMContentLoaded", () => {

  console.log("curriculo.js carregado");

  // =============================
  // ELEMENTOS
  // =============================
  const form         = document.getElementById("form-curriculo");
  const btnAddExp    = document.getElementById("add-exp");
  const btnImprimir  = document.getElementById("btn-imprimir");
  const containerExp = document.getElementById("experiencias");
  const containerForm = document.getElementById("formacoes");
  const btnAddForm = document.getElementById("add-formacao");

  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function preencherSelects(container){

  // MÊS INÍCIO
  container.querySelectorAll("select[name='mes_inicio']").forEach(sel=>{
    if(sel.options.length > 0) return;
    meses.forEach(m=>{
      const op = document.createElement("option");
      op.value = m;
      op.textContent = m;
      sel.appendChild(op);
    });
  });

  // MÊS FIM
  container.querySelectorAll("select[name='mes_fim']").forEach(sel=>{
    if(sel.options.length > 0) return;
    meses.forEach(m=>{
      const op = document.createElement("option");
      op.value = m;
      op.textContent = m;
      sel.appendChild(op);
    });
  });

  // ANOS
  const anoAtual = new Date().getFullYear();
  const anoMax = anoAtual + 50;
  const anoMin = 1950;

  // ANO INÍCIO
  container.querySelectorAll("select[name='ano_inicio']").forEach(sel=>{
    if(sel.options.length > 0) return;

    for(let i = anoMax; i >= anoMin; i--){
      const op = document.createElement("option");
      op.value = i;
      op.textContent = i;
      sel.appendChild(op);
    }
  });

// ANO FIM
container.querySelectorAll("select[name='ano_fim']").forEach(sel=>{
  if(sel.options.length > 1) return; // já tem "Atual" + anos

  for(let i = anoMax; i >= anoMin; i--){
    const op = document.createElement("option");
    op.value = i;
    op.textContent = i;
    sel.appendChild(op);
  }
});

  // 🔥 COMPORTAMENTO "ATUAL"
  container.querySelectorAll("select[name='ano_fim']").forEach(sel=>{
    sel.addEventListener("change", () => {

      const wrapper = sel.closest(".exp-item"); // só experiência
      if (!wrapper) return;

      const mesFim = wrapper.querySelector("select[name='mes_fim']");

      if (sel.value === "atual") {
        if (mesFim) {
          mesFim.selectedIndex = 0;
          mesFim.disabled = true;
          mesFim.style.opacity = "0.5";
        }
      } else {
        if (mesFim) {
          mesFim.disabled = false;
          mesFim.style.opacity = "1";
        }
      }

    });
  });

}

if(containerExp){
  preencherSelects(containerExp);
}

if(containerForm){
  preencherSelects(containerForm);
}

  if(btnAddForm){
  btnAddForm.addEventListener("click", () => {

    const div = document.createElement("div");
    div.className = "formacao-item exp-item-dinamico";

div.innerHTML = `
  <div class="exp-header">
    <span class="exp-label">Formação</span>
  </div>

  <div class="field">
    <label>Curso / Escolaridade</label>
    <input type="text" name="curso">
  </div>

  <div class="field">
    <label>Instituição</label>
    <input type="text" name="instituicao">
  </div>

  <div class="field-row quadruple">
    <div class="field">
      <label>Mês Início</label>
      <select name="mes_inicio"></select>
    </div>
    <div class="field">
      <label>Ano Início</label>
      <select name="ano_inicio"></select>
    </div>
    <div class="field">
      <label>Mês Fim</label>
      <select name="mes_fim"></select>
    </div>
    <div class="field">
      <label>Ano Fim</label>
      <select name="ano_fim"></select>
    </div>
  </div>

  <button type="button" class="button small btn-remover-formacao">
    🗑 Remover formação
  </button>
`;

containerForm.appendChild(div);

// preencher selects primeiro
preencherSelects(div);

// scroll suave para a nova
requestAnimationFrame(() => {
  setTimeout(() => {
    div.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 120);
});

// 🔥 EVENTO DE REMOVER (OBRIGATÓRIO)
div.querySelector(".btn-remover-formacao").addEventListener("click", () => {

  const temConteudo = ["curso", "instituicao", "mes_inicio"]
    .some(n => div.querySelector(`[name="${n}"]`)?.value?.trim());

  if (temConteudo) {
    const ok = confirm("Remover esta formação?");
    if (!ok) return;
  }

  div.remove();
});
}); // fecha addEventListener
}   // fecha if(btnAddForm)


  let contadorExp = 1;

  // Renomeia botão submit para "Salvar PDF" se ainda vier como "Gerar Currículo"
  const btnSubmit = form?.querySelector('[type="submit"]');
  if (btnSubmit) {
    btnSubmit.innerHTML = btnSubmit.innerHTML.replace(/Gerar Currículo/i, "Salvar PDF");
  }
  // Nota: NÃO há variável cvConfirmado — o card de revisão é só sugestão,
  // os botões nunca ficam bloqueados por ele.

  // =============================
  // CONFIG
  // =============================
  document.querySelectorAll("textarea").forEach(t => { t.style.resize = "none"; });

  // =============================
  // MÁSCARAS
  // =============================
  function aplicarMascaraTelefone(input) {
    input.addEventListener("input", () => {
      let v = input.value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d+)/, "($1) $2");
      }
      input.value = v;
    });
  }

  function aplicarMascaraCidade(input) {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[0-9]/g, "");
    });
  }

  const telInput    = document.getElementById("telefone");
  const cidadeInput = document.getElementById("cidade");
  if (telInput)    aplicarMascaraTelefone(telInput);
  if (cidadeInput) aplicarMascaraCidade(cidadeInput);

  // =============================
  // VALIDAÇÕES
  // =============================
  function nomeValido(nome) {
    const partes = nome.trim().split(/\s+/).filter(p => p.length > 1);
    return partes.length >= 2;
  }

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function emailFake(email) {
    return ["teste", "test", "abc", "123"].some(p => email.toLowerCase().includes(p));
  }

  function telefoneValido(tel) {
    return tel.replace(/\D/g, "").length >= 10;
  }

  // Destaca campo inválido + scroll até ele + mensagem via app.js
function erroNoCampo(id, mensagem) {
  const el = document.getElementById(id);
  if (!el) return;

  // Borda vermelha + shake
  el.classList.add("campo-erro");
  el.addEventListener("input", () => {
    el.classList.remove("campo-erro");
    el.parentElement.querySelector(".msg-erro")?.remove();
  }, { once: true });

  // Remove aviso anterior do mesmo campo (se houver)
  el.parentElement.querySelector(".msg-erro")?.remove();

  // Insere mensagem EMBAIXO do campo, dentro do .field
  const span = document.createElement("span");
  span.className = "msg-erro";
  span.textContent = mensagem;
  el.insertAdjacentElement("afterend", span);

  // Scroll até o campo
  setTimeout(() => {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 80);
}

function validarDados(dados) {

  // ===== validações básicas =====
  if (!nomeValido(dados.nome)) {
    erroNoCampo("nome", "Digite nome e sobrenome válidos (mínimo 2 palavras).");
    return false;
  }

  if (!emailValido(dados.email) || emailFake(dados.email)) {
    erroNoCampo("email", "Digite um e-mail válido.");
    return false;
  }

  if (!telefoneValido(dados.telefone)) {
    erroNoCampo("telefone", "Digite um telefone válido: (XX) XXXXX-XXXX.");
    return false;
  }

  const estado = document.getElementById("estado")?.value;
  if (!estado) {
    erroNoCampo("estado", "Selecione um estado (UF).");
    return false;
  }

  const idiomasFormatados = formatarIdiomas(dados.idiomas);
  if (!idiomasFormatados) {
    erroNoCampo("idiomas", "Informe idioma com nível (ex: Inglês avançado).");
    return false;
  }

  // ===== VALIDAÇÃO DE DATAS =====
  const mapaMes = {
    Jan:1, Fev:2, Mar:3, Abr:4, Mai:5, Jun:6,
    Jul:7, Ago:8, Set:9, Out:10, Nov:11, Dez:12
  };

  function validarPeriodo(item) {
    const mi = item.querySelector('[name="mes_inicio"]')?.value;
    const ai = item.querySelector('[name="ano_inicio"]')?.value;
    const mf = item.querySelector('[name="mes_fim"]')?.value;
    const af = item.querySelector('[name="ano_fim"]')?.value;

    if (!mi || !ai || !mf || !af) {
      mostrarAlerta("Preencha todas as datas (início e fim).");
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    const inicio = parseInt(ai) * 100 + mapaMes[mi];
    const fim = parseInt(af) * 100 + (mapaMes[mf] || 0);

    if (fim < inicio) {
      item.querySelector('[name="ano_fim"]').classList.add("campo-erro");
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      mostrarAlerta("Data final não pode ser menor que a inicial.");
      return false;
    }

    return true;
  }

  // valida experiências
  const exps = document.querySelectorAll(".exp-item");
  for (let item of exps) {
    if (!validarPeriodo(item)) return false;
  }

  // valida formações
  const forms = document.querySelectorAll(".formacao-item");
  for (let item of forms) {
    if (!validarPeriodo(item)) return false;
  }

  return true;
}

  // =============================
  // ANIMAÇÕES — REVELAÇÃO PROGRESSIVA
  // =============================
  function obterEtapas() {
    const etapasPorAtributo = form.querySelectorAll("[data-etapa]");
    if (etapasPorAtributo.length > 0) {
      const mapa = {};
      etapasPorAtributo.forEach(el => {
        const idx = parseInt(el.dataset.etapa, 10);
        if (!mapa[idx]) mapa[idx] = [];
        mapa[idx].push(el);
      });
      return Object.keys(mapa).sort((a, b) => a - b).map(k => mapa[k]);
    }
    // Fallback: divide pelos h2
    const titulos = Array.from(form.querySelectorAll("h2"));
    return titulos.map(h2 => {
      const items = [h2];
      let next = h2.nextElementSibling;
      while (next && next.tagName !== "H2") {
        items.push(next);
        next = next.nextElementSibling;
      }
      return items;
    });
  }

  const etapas   = obterEtapas();
  let etapaAtiva = 0;

  function scrollSuave(px = 80) {
    window.scrollBy({ top: px, behavior: "smooth" });
  }

  function revelarElemento(el, delayMs = 0) {
    setTimeout(() => {
      el.classList.remove("etapa-oculta");
      void el.offsetHeight;
      el.classList.add("etapa-visivel");
    }, delayMs);
  }

  function revelarProximaEtapa(idxProxima) {
    if (idxProxima >= etapas.length) return;
    if (!etapas[idxProxima][0].classList.contains("etapa-oculta")) return;
    etapas[idxProxima].forEach((el, i) => revelarElemento(el, i * 100));
    setTimeout(() => scrollSuave(80), 180);
  }

  function prepararEtapas() {
    etapas.forEach((grupo, idx) => {
      grupo.forEach((el, fieldIdx) => {
        el.classList.add("etapa-campo");
        el.dataset.etapaIdx = idx;
        el.dataset.fieldIdx = fieldIdx;
        if (idx === 0) {
          revelarElemento(el, 60 + fieldIdx * 90);
        } else {
          el.classList.add("etapa-oculta");
        }
      });
    });
  }

  prepararEtapas();

  form.addEventListener("input", e => {
    const campo = e.target;
    let etapaDosCampo = -1;
    for (let i = 0; i < etapas.length; i++) {
      if (etapas[i].some(el => el === campo || el.contains(campo))) {
        etapaDosCampo = i;
        break;
      }
    }
    if (etapaDosCampo === -1) return;
    if (campo.value && campo.value.trim().length >= 1) {
      revelarProximaEtapa(etapaDosCampo + 1);
      etapaAtiva = Math.max(etapaAtiva, etapaDosCampo + 1);
    }
  });

  // =============================
  // CARD DE REVISÃO (sugestão, não bloqueio)
  // =============================
  function iniciarRevisao() {
    const formActions =
      form.querySelector(".form-actions") ||
      document.querySelector(".form-actions");
    if (!formActions) return;

    const card = document.createElement("div");
    card.id = "revisao-card";
    card.innerHTML = `
      <div class="revisao-inner">
        <div class="revisao-topo">
          <span class="revisao-icone" aria-hidden="true">📋</span>
          <div class="revisao-texto">
            <strong>Deseja revisar alguma informação?</strong>
            <span>Recomendamos conferir seus dados antes de gerar o currículo.</span>
          </div>
        </div>
        <div class="revisao-acoes">
          <button type="button" id="btn-revisar">✏️ Sim, revisar</button>
          <button type="button" id="btn-pular-revisao">✓ Não, está tudo certo</button>
        </div>
      </div>
    `;

    formActions.parentNode.insertBefore(card, formActions);

    // Sim → scroll suave ao topo do form
    document.getElementById("btn-revisar").addEventListener("click", () => {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Não → dispensa o card suavemente (botões já estão livres)
    document.getElementById("btn-pular-revisao").addEventListener("click", () => {
      card.classList.add("revisao-dispensada");
      setTimeout(() => card.remove(), 500);
    });
  }

  iniciarRevisao();

// =============================
// EXPERIÊNCIA DINÂMICA
// =============================
if (btnAddExp) {
  btnAddExp.addEventListener("click", () => {
    contadorExp++;

    const div = document.createElement("div");
    div.className = "exp-item exp-item-dinamico";

    // estado inicial da animação
    div.style.opacity = "0";
    div.style.transform = "translateY(16px)";
    div.style.transition = "all .35s ease";

    div.innerHTML = `
      <div class="exp-header">
        <span class="exp-label">Experiência ${contadorExp}</span>
        <button type="button" class="btn-cancelar-exp" title="Remover">&#x2715;</button>
      </div>

      <div class="field">
        <label>Empresa</label>
        <input type="text" name="empresa" placeholder="Nome da empresa">
      </div>

      <div class="field">
        <label>Cargo</label>
        <input type="text" name="cargo" placeholder="Seu cargo">
      </div>

      <div class="field-row quadruple">
        <div class="field">
          <label>Mês Início</label>
          <select name="mes_inicio"></select>
        </div>
        <div class="field">
          <label>Ano Início</label>
          <select name="ano_inicio"></select>
        </div>
        <div class="field">
          <label>Mês Fim</label>
          <select name="mes_fim"></select>
        </div>
        <div class="field">
          <label>Ano Fim</label>
            <select name="ano_fim">
              <option value="atual">Atual</option>
            </select>
        </div>
      </div>

      <div class="field">
        <label>Descrição das atividades</label>
        <textarea name="descricao" rows="4" placeholder="Uma atividade por linha (cada linha vira um item no currículo)"></textarea>
      </div>

      <button type="button" class="button small btn-remover-exp">
        🗑 Remover experiência
      </button>
    `;

    // textarea sem resize
    div.querySelectorAll("textarea").forEach(t => {
      t.style.resize = "none";
    });

    // adiciona no DOM
    containerExp.appendChild(div);

    // preenche selects (IMPORTANTE vir antes do scroll)
    preencherSelects(div);

    // animação + scroll
    requestAnimationFrame(() => {
      div.style.opacity = "1";
      div.style.transform = "translateY(0)";

      setTimeout(() => {
        div.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 120);
    });

    // botão X (sem confirmação)
    div.querySelector(".btn-cancelar-exp").addEventListener("click", () => {
      fecharExpItem(div);
    });

    // botão remover com confirmação
    div.querySelector(".btn-remover-exp").addEventListener("click", () => {
      const temConteudo = ["empresa", "cargo", "descricao", "mes_inicio"]
        .some(n => div.querySelector(`[name="${n}"]`)?.value?.trim());

      if (temConteudo) {
        const ok = confirm("Remover esta experiência?");
        if (!ok) return;
      }

      fecharExpItem(div);
    });
  });
}

  // Animação de saída + remoção do DOM
  function fecharExpItem(div) {
    // Mede altura atual antes de animar
    const alturaAtual = div.offsetHeight;

    div.style.overflow   = "hidden";
    div.style.transition = [
      "opacity .3s ease",
      "transform .3s ease",
      "max-height .38s cubic-bezier(.4,0,.2,1)",
      "margin-top .38s ease",
      "margin-bottom .38s ease",
      "padding-top .38s ease",
      "padding-bottom .38s ease"
    ].join(", ");
    div.style.maxHeight = alturaAtual + "px";

    requestAnimationFrame(() => {
      div.style.opacity       = "0";
      div.style.transform     = "translateY(-8px) scale(.98)";
      div.style.maxHeight     = "0";
      div.style.marginTop     = "0";
      div.style.marginBottom  = "0";
      div.style.paddingTop    = "0";
      div.style.paddingBottom = "0";
    });

    setTimeout(() => {
      div.remove();
      // Ajusta contador (evita número negativo)
      if (contadorExp > 1) contadorExp--;
    }, 420);
  }

// =============================
// FORMATAÇÃO PROFISSIONAL
// =============================

// Primeira letra maiúscula em cada palavra
function capitalizarTexto(texto){
  if (!texto) return "";

  const minusculas = ["de","da","do","das","dos","e","em","para","por","com","sem","a","o"];

  return texto
    .toLowerCase()
    .split(" ")
    .map((palavra, i) => {
      if (i > 0 && minusculas.includes(palavra)) {
        return palavra;
      }
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(" ");
}

// Nome (cada palavra)
function formatarNome(nome){
  return capitalizarTexto(nome.trim());
}

// Cidade / Estado (ex: tatuí sp → Tatuí - SP)
function formatarCidade(valor) {
  if (!valor) return '';

  valor = valor.toLowerCase().trim();

  let partes = valor.split(/\s+/);

  if (partes.length < 2) {
    return capitalizarTexto(valor);
  }

  const estado = partes.pop().toUpperCase();
  const cidade = partes.join(' ');

  return `${capitalizarTexto(cidade)} - ${estado}`;
}

// Endereço
function formatarEndereco(endereco){
  return capitalizarTexto(endereco);
}

// Período (ex: jan2022 dez2024 → Jan/2022 – Dez/2024)
function formatarPeriodo(periodo){

  periodo = periodo.toLowerCase();

  const meses = {
    jan: "Jan", fev: "Fev", mar: "Mar", abr: "Abr",
    mai: "Mai", jun: "Jun", jul: "Jul", ago: "Ago",
    set: "Set", out: "Out", nov: "Nov", dez: "Dez"
  };

  return periodo.replace(
    /(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s*\/?\s*(\d{4})/g,
    (_, m, a) => `${meses[m]}/${a}`
  ).replace(/\s*-\s*/g, " – ")
}

function statusFormacao(ai, mi, af, mf) {
  const mesesIdx = {
    Jan:0, Fev:1, Mar:2, Abr:3, Mai:4, Jun:5,
    Jul:6, Ago:7, Set:8, Out:9, Nov:10, Dez:11
  };

  const hoje = new Date();

  const fim = new Date(parseInt(af), mesesIdx[mf], 1);

  return fim >= hoje ? "Cursando" : "Completo";
}

// Formação
function formatarFormacao(texto){
  return capitalizarTexto(texto);
}

// Idiomas (formatação automática)
function formatarIdiomas(texto){
  if (!texto) return "";

  const resultado = [];

  texto.split(",").forEach(i => {

    let item = i.trim().toLowerCase();

    item = item
      .replace(/avancado/g, "avançado")
      .replace(/intermediario/g, "intermediário")
      .replace(/basico/g, "básico");

    let nivel = "";
    if (item.includes("avançado")) nivel = "Avançado";
    else if (item.includes("intermediário")) nivel = "Intermediário";
    else if (item.includes("básico")) nivel = "Básico";

    let idioma = item
      .replace("avançado", "")
      .replace("intermediário", "")
      .replace("básico", "")
      .trim();

    idioma = capitalizarTexto(idioma);

    // ❌ BLOQUEIA idioma sem nível
    if (!idioma || !nivel) return;

    resultado.push(`${idioma} (${nivel})`);

  });

  return resultado.join(", ");
}

// Texto geral
function formatarTexto(texto){
  if (!texto) return "";

  return texto
    .toLowerCase()
    .replace(/^\s*\w/, l => l.toUpperCase());
}

  // =============================
  // SUBMIT — SALVAR PDF
  // =============================
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const dados = coletarDados();
    if (!validarDados(dados)) return;

    // 🔒 evita duplicado
    if (!sessionStorage.getItem("curriculo_enviado")) {
      sessionStorage.setItem("curriculo_enviado", "1");
      enviarCurriculo(dados);
    }

    salvarPDF(dados);
  });
}

  // =============================
  // IMPRIMIR
  // =============================
if (btnImprimir) {
  btnImprimir.addEventListener("click", () => {
    const dados = coletarDados();
    if (!validarDados(dados)) return;

    // 🔒 evita duplicado
    if (!sessionStorage.getItem("curriculo_enviado")) {
      sessionStorage.setItem("curriculo_enviado", "1");
      enviarCurriculo(dados);
    }

    imprimirPopup(dados);
  });
}

  // =============================
  // COLETA
  // =============================
  function coletarDados() {
    const get = id => (document.getElementById(id)?.value || "").trim();


  // FOTO
      const fotoInput = document.getElementById("foto");
      let fotoBase64 = "";

      if (fotoInput && fotoInput.files && fotoInput.files[0]) {
        fotoBase64 = URL.createObjectURL(fotoInput.files[0]);
      }
  // EXPERIÊNCIAS
    const experiencias = [];
    document.querySelectorAll(".exp-item").forEach(item => {
      const empresa   = item.querySelector('[name="empresa"]')?.value?.trim()   || "";
      const cargo     = item.querySelector('[name="cargo"]')?.value?.trim()     || "";
      const mi = item.querySelector('[name="mes_inicio"]')?.value || "";
      const ai = item.querySelector('[name="ano_inicio"]')?.value || "";
      const mf = item.querySelector('[name="mes_fim"]')?.value || "";
      const af = item.querySelector('[name="ano_fim"]')?.value || "";
      const descricao = item.querySelector('[name="descricao"]')?.value?.trim() || "";
      if (empresa || cargo || mi) experiencias.push({
      empresa: capitalizarTexto(empresa),
      cargo: capitalizarTexto(cargo),
      periodo: (af === "atual")
        ? `${mi}/${ai} – Atual`
        : (mf && af)
          ? `${mi}/${ai} – ${mf}/${af}`
          : `${mi}/${ai}`,
      descricao: formatarTexto(descricao)
    });
    });

const formacoes = [];

document.querySelectorAll(".formacao-item").forEach(item=>{
  const curso = item.querySelector('[name="curso"]')?.value || "";
  const inst  = item.querySelector('[name="instituicao"]')?.value || "";
  const mi    = item.querySelector('[name="mes_inicio"]')?.value || "";
  const ai    = item.querySelector('[name="ano_inicio"]')?.value || "";
  const mf    = item.querySelector('[name="mes_fim"]')?.value || "";
  const af    = item.querySelector('[name="ano_fim"]')?.value || "";

  if (curso.trim()) {

    const status = statusFormacao(ai, mi, af, mf);

    formacoes.push(
  `${capitalizarTexto(curso)} – ${capitalizarTexto(inst)} – ${mi}/${ai} – ${mf}/${af} (${status})`
);

  }
});

const cidade = get("cidade");
const estado = document.getElementById("estado")?.value || "";

return {
  nome: formatarNome(get("nome")),
  email: get("email"),
  telefone: get("telefone"),

  cidade: cidade && estado
    ? `${capitalizarTexto(cidade)} - ${estado}`
    : capitalizarTexto(cidade),
  endereco: formatarEndereco(get("endereco")),
  objetivo: formatarTexto(get("objetivo")),
  formacao: formacoes.join("<br>"),
  idiomas: formatarIdiomas(get("idiomas")),
  cursos: formatarTexto(get("cursos")),
  extras: formatarTexto(get("extras")),
  foto: fotoBase64,
  experiencias
};

}
  // =============================
  // MONTAGEM — MODELO ROBERT HALF
  // Todos os estilos inline (sem interferência do CSS da página)
  // =============================
  function montarCurriculo(d) {

const S = {
  root:         "font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#1a1a1a;line-height:1.6;max-width:750px;width:100%;margin:0 auto;padding:40px 48px;background:#fff;word-break:break-word;overflow-wrap:break-word;",
  nomeBloco:    "text-align:left;margin-bottom:6px;",
  nome:         "font-size:20pt;font-weight:700;color:#000;text-transform:uppercase;letter-spacing:.04em;word-break:break-word;",
  contatoBloco: "text-align:left;font-size:9.5pt;color:#444;line-height:1.8;margin-bottom:14px;word-break:break-word;",
  contatoLabel: "font-weight:700;color:#222;",
  hr:           "border:none;border-top:2px solid #111;margin:16px 0 20px;",
  secaoTitulo:  "font-size:10pt;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:.1em;border-bottom:1.5px solid #bbb;padding-bottom:3px;margin:22px 0 10px;",
  texto:        "font-size:10.5pt;color:#222;text-align:justify;margin:0 0 4px;word-break:break-word;overflow-wrap:break-word;",
  objetivo:     "font-size:10.5pt;color:#222;margin:0 0 4px;text-align:justify;word-break:break-word;overflow-wrap:break-word;",
  expBloco:     "margin-bottom:16px;",
  expTitulo:    "font-size:10.5pt;font-weight:700;color:#111;margin:0 0 2px;word-break:break-word;",
  expPeriodo:   "font-size:9.5pt;color:#555;margin:0 0 5px;",
  ul:           "margin:4px 0 0 0;padding:0;list-style:none;",
  li:           "font-size:10pt;color:#222;margin-bottom:3px;padding-left:18px;position:relative;word-break:break-word;overflow-wrap:break-word;",
  liSeta:       "position:absolute;left:0;top:0;color:#555;font-size:.85em;",
};

    function bullets(txt) {
      if (!txt) return "";
      const linhas = txt.split("\n").map(l => l.trim()).filter(Boolean);
      if (!linhas.length) return "";
      return `<ul style="${S.ul}">${
        linhas.map(l => `<li style="${S.li}"><span style="${S.liSeta}">&#x276F;</span>${l}</li>`).join("")
      }</ul>`;
    }

    function secao(titulo, conteudo) {
      if (!conteudo.replace(/<[^>]+>/g, "").trim()) return "";
      return `<div><div style="${S.secaoTitulo}">${titulo}</div>${conteudo}</div>`;
    }

    function p(txt) {
      return txt ? `<p style="${S.texto}">${txt}</p>` : "";
    }

    // Experiências
    let expHTML = "";
    d.experiencias.forEach(exp => {
      if (!(exp.empresa || exp.cargo)) return;
      const titulo = [exp.empresa, exp.cargo].filter(Boolean).join(" — ");
      expHTML += `
        <div style="${S.expBloco}">
          <p style="${S.expTitulo}">${titulo}</p>
          ${exp.periodo ? `<p style="${S.expPeriodo}">${exp.periodo}</p>` : ""}
          ${bullets(exp.descricao)}
        </div>`;
    });

    // Contato no cabeçalho
    const linhasContato = [
      d.endereco ? `<span style="${S.contatoLabel}">Endereço:</span> ${d.endereco}` : "",
      d.cidade   ? `<span style="${S.contatoLabel}">Cidade/Estado:</span> ${d.cidade}` : "",
      d.telefone ? `<span style="${S.contatoLabel}">Telefone:</span> ${d.telefone}` : "",
      d.email    ? `<span style="${S.contatoLabel}">E-mail:</span> ${d.email}` : "",
    ].filter(Boolean);

    const objetivoHTML = d.objetivo
      ? `<p style="${S.objetivo}"><strong>OBJETIVO:</strong> ${d.objetivo}</p>`
      : "";

    return `
      <div style="${S.root}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">

          <div style="${S.nomeBloco}">
            <div style="${S.nome}">${d.nome}</div>
          </div>

          ${d.foto ? `
            <img src="${d.foto}"
              style="
                width:110px;
                height:140px;
                object-fit:cover;
                border-radius:6px;
                border:1px solid #ccc;
              ">
          ` : ""}

        </div>
        <div style="${S.contatoBloco}">${linhasContato.join("<br>")}</div>
        <hr style="${S.hr}">
        ${objetivoHTML}
        ${secao("Experiência Profissional", expHTML)}
        ${secao("Formação Acadêmica",     p(d.formacao))}
        ${secao("Idiomas",               p(d.idiomas))}
        ${secao("Cursos",                p(d.cursos))}
        ${secao("Informações Adicionais", p(d.extras))}
      </div>`;
  }

  // =============================
  // DOCUMENTO HTML COMPLETO (popup/PDF)
  // =============================
  function gerarDocumentoHTML(conteudoCV) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Currículo</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff; }
    @page { size: A4; margin: 15mm 18mm 15mm 18mm; }
    @media print { html, body { width: 210mm; } }
    @page {
  size: A4;
  margin: 15mm 18mm;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
  }
}
  </style>
</head>
<body>${conteudoCV}</body>
</html>`;
  }

  // =============================
  // SALVAR PDF
  // =============================
function salvarPDF(dados) {
  const cvHTML  = montarCurriculo(dados);
  const docHTML = gerarDocumentoHTML(cvHTML);

  const blob    = new Blob([docHTML], { type: "text/html;charset=utf-8" });
  const blobURL = URL.createObjectURL(blob);

  const aba = window.open(blobURL, "_blank");

  if (!aba) {
    mostrarAlerta("O navegador bloqueou a nova aba. Permita popups para este site.");
    URL.revokeObjectURL(blobURL);
    return;
  }

  aba.addEventListener("load", () => {
    setTimeout(() => {
      aba.print();
      aba.addEventListener("afterprint", () => {
        URL.revokeObjectURL(blobURL);
        aba.close();
      });
    }, 400);
  });
}

  // =============================
  // IMPRIMIR — popup isolado
  // =============================
  function imprimirPopup(dados) {
    const docHTML = gerarDocumentoHTML(montarCurriculo(dados));

    const popup = window.open("", "_blank", "width=900,height=750,scrollbars=yes");
    if (!popup) {
      mostrarAlerta("O navegador bloqueou o popup. Permita popups para este site e tente novamente.");
      return;
    }

    popup.document.open();
    popup.document.write(docHTML);
    popup.document.close();
    popup.focus();

    popup.onload = () => {
      setTimeout(() => {
        popup.print();
        popup.addEventListener("afterprint", () => popup.close());
      }, 350);
    };
  }

  // =============================
  // EMAIL (preparado para EmailJS)
  // =============================
  function enviarEmailSimples(email) {
    console.log("Envio simulado para:", email);
  }

function enviarCurriculo(dados) {
  console.log("🔥 ENVIAR CURRICULO DISPARADO", dados);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWSaOvWrh5N0Rbr9kVs_iDE9B4Aqvb5A_3WyINoRXWTCcUe2Vsbn7-YIiI4mfB8Ijv/exec";

  const params = new URLSearchParams();
  params.append("nome",   dados.nome  || "");
  params.append("email",  dados.email || "");
  params.append("origem", "Curriculo");

  fetch(`${SCRIPT_URL}?${params.toString()}`, {
    method: "GET",
    mode:   "no-cors"
  }).then(() => {
    console.log("✅ Enviado para planilha");
  }).catch(err => {
    console.warn("⚠️ Erro:", err);
  });
}

document.addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    const tag = document.activeElement.tagName;

    // permite enter apenas em textarea
    if(tag !== "TEXTAREA"){
      e.preventDefault();
    }
  }
});

});