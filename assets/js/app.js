// ========= Tema (auto/dark/light) + troca do gráfico =========
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

// ========= Âncoras com rolagem suave =========
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

// ========= Botão "Voltar ao topo" =========
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

// ========= Perguntas DISC =========
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
  },
  {
    texto: "Quando recebo uma nova tarefa, eu:",
    opcoes: [
      { texto: "Vou direto à execução", valor: "D" },
      { texto: "Busco envolver a equipe", valor: "I" },
      { texto: "Organizo meu tempo com calma", valor: "S" },
      { texto: "Analiso instruções detalhadamente", valor: "C" }
    ]
  },
  {
    texto: "Em uma reunião, eu costumo:",
    opcoes: [
      { texto: "Defender meu ponto de vista com firmeza", valor: "D" },
      { texto: "Usar humor e entusiasmo", valor: "I" },
      { texto: "Ouvir e apoiar os demais", valor: "S" },
      { texto: "Trazer dados e lógica para discussão", valor: "C" }
    ]
  },
  {
    texto: "Diante de mudanças inesperadas, eu:",
    opcoes: [
      { texto: "Reajo rapidamente para ajustar", valor: "D" },
      { texto: "Busco manter a motivação do grupo", valor: "I" },
      { texto: "Prefiro manter estabilidade", valor: "S" },
      { texto: "Avalio riscos e impacto antes", valor: "C" }
    ]
  },
  {
    texto: "Minha maior motivação é:",
    opcoes: [
      { texto: "Vencer desafios", valor: "D" },
      { texto: "Ganhar reconhecimento social", valor: "I" },
      { texto: "Ajudar e apoiar pessoas", valor: "S" },
      { texto: "Fazer algo com qualidade e precisão", valor: "C" }
    ]
  },
  {
    texto: "Quando preciso tomar uma decisão difícil, eu:",
    opcoes: [
      { texto: "Decido de forma firme e rápida", valor: "D" },
      { texto: "Busco ouvir várias opiniões", valor: "I" },
      { texto: "Penso nos impactos nas pessoas", valor: "S" },
      { texto: "Analiso os fatos com cautela", valor: "C" }
    ]
  },
  {
    texto: "Quando alguém discorda de mim, eu:",
    opcoes: [
      { texto: "Defendo meu ponto com força", valor: "D" },
      { texto: "Uso carisma para convencer", valor: "I" },
      { texto: "Procuro evitar conflito", valor: "S" },
      { texto: "Trago regras e dados objetivos", valor: "C" }
    ]
  },
  {
    texto: "Para mim, sucesso significa:",
    opcoes: [
      { texto: "Alcançar grandes resultados", valor: "D" },
      { texto: "Ter bons relacionamentos", valor: "I" },
      { texto: "Construir estabilidade", valor: "S" },
      { texto: "Fazer tudo com excelência", valor: "C" }
    ]
  },
  {
    texto: "Costumo ser mais:",
    opcoes: [
      { texto: "Competitivo e direto", valor: "D" },
      { texto: "Comunicativo e animado", valor: "I" },
      { texto: "Calmo e paciente", valor: "S" },
      { texto: "Cauteloso e detalhista", valor: "C" }
    ]
  }
];
