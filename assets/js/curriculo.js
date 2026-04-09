document.addEventListener("DOMContentLoaded", () => {

  console.log("curriculo.js carregado");

  // =============================
  // ELEMENTOS
  // =============================
  const form         = document.getElementById("form-curriculo");
  const btnAddExp    = document.getElementById("add-exp");
  const btnImprimir  = document.getElementById("btn-imprimir");
  const containerExp = document.getElementById("experiencias");

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
    if (el) {
      el.classList.add("campo-erro");
      el.addEventListener("input", () => el.classList.remove("campo-erro"), { once: true });
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    }
    mostrarAlerta(mensagem);
  }

  function validarDados(dados) {
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
      // Começa invisível para a animação de entrada
      div.style.cssText = [
        "opacity:0",
        "transform:translateY(16px)",
        "transition:opacity .38s ease, transform .38s ease"
      ].join(";");

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
        <div class="field">
          <label>Período</label>
          <input type="text" name="periodo" placeholder="Ex: Jan/2022 – Dez/2023">
        </div>
        <div class="field">
          <label>Descrição das atividades</label>
          <textarea name="descricao" rows="4" placeholder="Uma atividade por linha (cada linha vira um item no currículo)"></textarea>
        </div>
        <button type="button" class="button small btn-remover-exp">&#x1F5D1; Remover experiência</button>
      `;

      div.querySelectorAll("textarea").forEach(t => { t.style.resize = "none"; });
      containerExp.appendChild(div);

      // Anima entrada e rola até o bloco
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          div.style.opacity   = "1";
          div.style.transform = "translateY(0)";
          // Aguarda a transição iniciar antes de scrollar
          setTimeout(() => {
            div.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 180);
        });
      });

      // ✕ — Cancelar: remove sem confirmação
      div.querySelector(".btn-cancelar-exp").addEventListener("click", () => {
        fecharExpItem(div);
      });

      // Remover — pede confirmação se tiver conteúdo
      div.querySelector(".btn-remover-exp").addEventListener("click", async () => {
        const temConteudo = ["empresa", "cargo", "periodo", "descricao"]
          .some(n => div.querySelector(`[name="${n}"]`)?.value?.trim());

        if (temConteudo) {
          const ok = await mostrarConfirmacao("Remover esta experiência?");
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
  return texto
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Nome (cada palavra)
function formatarNome(nome){
  return capitalizarTexto(nome.trim());
}

// Cidade / Estado (ex: tatuí sp → Tatuí - SP)
function formatarCidade(cidade){
  function formatarCidade(cidade){
  if (!cidade) return "";

  let partes = cidade
    .toLowerCase()
    .replace("-", " ")
    .split(" ")
    .filter(p => p);

  if(partes.length >= 2){
    const estado = partes.pop().toUpperCase();
    const cidadeNome = capitalizarTexto(partes.join(" "));
    return `${cidadeNome} - ${estado}`;
  }

  return capitalizarTexto(cidade);
}

  if(partes.length >= 2){
    const estado = partes.pop().toUpperCase();
    const cidadeNome = capitalizarTexto(partes.join(" "));
    return `${cidadeNome} - ${estado}`;
  }

  return capitalizarTexto(cidade);
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

// Formação
function formatarFormacao(texto){
  return capitalizarTexto(texto);
}

// Idiomas (adiciona nível automático)
function formatarIdiomas(texto){

  return texto.split(",").map(i => {
    i = capitalizarTexto(i.trim());

    if(!i.includes("(")){
      return `${i} (Intermediário)`;
    }

    return i;
  }).join(", ");
}

// Texto geral
function formatarTexto(texto){
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

  // =============================
  // SUBMIT — SALVAR PDF
  // =============================
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const dados = coletarDados();
      if (!validarDados(dados)) return;
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
      imprimirPopup(dados);
    });
  }

  // =============================
  // COLETA
  // =============================
  function coletarDados() {
    const get = id => (document.getElementById(id)?.value || "").trim();

    const experiencias = [];
    document.querySelectorAll(".exp-item").forEach(item => {
      const empresa   = item.querySelector('[name="empresa"]')?.value?.trim()   || "";
      const cargo     = item.querySelector('[name="cargo"]')?.value?.trim()     || "";
      const periodo   = item.querySelector('[name="periodo"]')?.value?.trim()   || "";
      const descricao = item.querySelector('[name="descricao"]')?.value?.trim() || "";
      if (empresa || cargo) experiencias.push({
      empresa: capitalizarTexto(empresa),
      cargo: capitalizarTexto(cargo),
      periodo: formatarPeriodo(periodo),
      descricao: formatarTexto(descricao)
    });
    });

    return {
      nome: formatarNome(get("nome")),
      email: get("email"),
      telefone: get("telefone"),
      cidade: formatarCidade(get("cidade")),
      endereco: formatarEndereco(get("endereco")),
      objetivo: formatarTexto(get("objetivo")),
      formacao: formatarFormacao(get("formacao")),
      idiomas: formatarIdiomas(get("idiomas")),
      cursos: formatarTexto(get("cursos")),
      extras: formatarTexto(get("extras")),
      experiencias
    };
  }

  // =============================
  // MONTAGEM — MODELO ROBERT HALF
  // Todos os estilos inline (sem interferência do CSS da página)
  // =============================
  function montarCurriculo(d) {

    const S = {
      root:          "font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#1a1a1a;line-height:1.6;max-width:750px;margin:0 auto;padding:40px 48px;background:#fff;",
      nomeBloco: "text-align:left;margin-bottom:6px;",
      nome:          "font-size:20pt;font-weight:700;color:#000;text-transform:uppercase;letter-spacing:.04em;",
      contatoBloco: "text-align:left;font-size:9.5pt;color:#444;line-height:1.8;margin-bottom:14px;",
      contatoLabel:  "font-weight:700;color:#222;",
      hr:            "border:none;border-top:2px solid #111;margin:16px 0 20px;",
      secaoTitulo:   "font-size:10pt;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:.1em;border-bottom:1.5px solid #bbb;padding-bottom:3px;margin:22px 0 10px;",
      texto:         "font-size:10.5pt;color:#222;text-align:justify;margin:0 0 4px;",
      objetivo:      "font-size:10.5pt;color:#222;margin:0 0 4px;text-align:justify;",
      expBloco:      "margin-bottom:16px;",
      expTitulo:     "font-size:10.5pt;font-weight:700;color:#111;margin:0 0 2px;",
      expPeriodo:    "font-size:9.5pt;color:#555;margin:0 0 5px;",
      ul:            "margin:4px 0 0 0;padding:0;list-style:none;",
      li:            "font-size:10pt;color:#222;margin-bottom:3px;padding-left:18px;position:relative;",
      liSeta:        "position:absolute;left:0;top:0;color:#555;font-size:.85em;",
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
        <div style="${S.nomeBloco}">
          <div style="${S.nome}">${d.nome}</div>
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

  const cvHTML = montarCurriculo(dados);

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "0";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.background = "#fff";
  container.style.zIndex = "9999";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";

  container.innerHTML = cvHTML;
  document.body.appendChild(container);

  const nomeSafe = dados.nome.replace(/\s+/g, "-").toLowerCase();

  html2pdf().set({
    margin: [12, 18, 12, 18],
    filename: `curriculo-${nomeSafe}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff"
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  })
  .from(container)
  .save()
  .then(() => document.body.removeChild(container))
  .catch(() => document.body.removeChild(container));

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

});
