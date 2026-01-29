// ========= Tema (auto/dark/light) + troca do gráfico =========

// ================= API GOOGLE =================
const API_URL = "https://script.google.com/macros/s/SEU_ID_AQUI/exec";

/* ==========================================================
   TEMA
========================================================== */
(() => {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'crv_disc_theme';

  const applyTheme = (mode) => {
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', mode);
    }
    localStorage.setItem(STORAGE_KEY, mode);
  };

  applyTheme(localStorage.getItem(STORAGE_KEY) || 'auto');

  if (btn) {
    btn.addEventListener('click', () => {
      const current = localStorage.getItem(STORAGE_KEY) || 'auto';
      const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
      applyTheme(next);
    });
  }

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener?.('change', () => {
    if ((localStorage.getItem(STORAGE_KEY) || 'auto') === 'auto') applyTheme('auto');
  });
})();

/* ==========================================================
   ÂNCORAS COM ROLAGEM SUAVE
========================================================== */
(() => {
  const headerOffset = 72;
  const smoothScrollTo = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    const el = document.querySelector(hash);
    if (!el) return;

    ev.preventDefault();
    smoothScrollTo(el);
    history.pushState(null, '', hash);
  });
})();

/* ==========================================================
   BOTÃO "VOLTAR AO TOPO"
========================================================== */
(() => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ==========================================================
   PERGUNTAS DISC (DADOS APENAS)
========================================================== */
window.DISC_QUESTOES = [
  {
    texto: "Quando estou em um novo desafio, eu costumo:",
    opcoes: [
      { texto: "Assumir a liderança e partir para ação", valor: "D" },
      { texto: "Motivar os outros e criar entusiasmo", valor: "I" },
      { texto: "Manter a calma e apoiar o grupo", valor: "S" },
      { texto: "Planejar cada detalhe antes de agir", valor: "C" }
    ]
  },
  {
    texto: "No trabalho em equipe, minha maior força é:",
    opcoes: [
      { texto: "Tomar decisões rápidas", valor: "D" },
      { texto: "Comunicar e engajar pessoas", valor: "I" },
      { texto: "Ser paciente e colaborativo", valor: "S" },
      { texto: "Analisar e organizar processos", valor: "C" }
    ]
  },
  {
    texto: "Quando surge um problema, eu:",
    opcoes: [
      { texto: "Busco resolver de forma direta", valor: "D" },
      { texto: "Converso com os outros para achar soluções", valor: "I" },
      { texto: "Procuro manter a harmonia", valor: "S" },
      { texto: "Investigo profundamente antes de agir", valor: "C" }
    ]
  },
  {
    texto: "Meus colegas provavelmente me descrevem como:",
    opcoes: [
      { texto: "Determinado e competitivo", valor: "D" },
      { texto: "Sociável e comunicativo", valor: "I" },
      { texto: "Confiável e paciente", valor: "S" },
      { texto: "Cuidadoso e preciso", valor: "C" }
    ]
  }
];

/* ==========================================================
   ENVIO PARA GOOGLE (PLANILHA + EMAIL)
========================================================== */
function enviarResultadoParaGoogle(resultado) {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resultado)
  })
  .then(r => r.json())
  .then(resp => {
    console.log("✅ Resultado enviado:", resp);
  })
  .catch(err => {
    console.error("❌ Erro ao enviar:", err);
  });
}

/* ==========================================================
   FUNÇÃO DE FINALIZAÇÃO (GANCHO SEGURO)
========================================================== */
/*
  ⚠️ ESTA FUNÇÃO NÃO EXISTIA ANTES
  Ela NÃO quebra nada.
  Ela serve para você CHAMAR quando o teste terminar.
*/
function finalizarTesteDISC(dados) {
  /*
    dados deve conter:
    {
      nome,
      email,
      D,
      I,
      S,
      C,
      perfilPredominante,
      areasRecomendadas
    }
  */

  const payload = {
    nome: dados.nome || '',
    email: dados.email || '',
    D: dados.D || 0,
    I: dados.I || 0,
    S: dados.S || 0,
    C: dados.C || 0,
    perfilPredominante: dados.perfilPredominante || '',
    areasRecomendadas: dados.areasRecomendadas || '',
    origem: "Santa Casa"
  };

  enviarResultadoParaGoogle(payload);
}
