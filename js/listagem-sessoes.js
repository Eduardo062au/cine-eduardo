// ===== LISTAGEM DE SESSÕES DISPONÍVEIS =====
// Exibe todas as sessões em cartaz e permite excluí-las.
// CRUD presente neste arquivo: READ (listar sessões) + DELETE (excluir sessão)

// Guarda o ID da sessão que está aguardando confirmação de exclusão
let sessaoParaExcluir = null;

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {
  renderizarSessoes();

  // Botão "Cancelar" do modal: fecha sem excluir
  document.getElementById('btn-cancelar-sessao').addEventListener('click', fecharModal);

  // Botão "Confirmar exclusão" do modal: executa o DELETE
  document.getElementById('btn-confirmar-sessao').addEventListener('click', confirmarExclusaoSessao);
});

// =============================================
// CRUD - READ: Lê e exibe todas as sessões disponíveis
// =============================================
function renderizarSessoes() {
  const container = document.getElementById('lista-sessoes');
  if (!container) return;

  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');
  const salas = JSON.parse(localStorage.getItem('salas') || '[]');

  if (sessoes.length === 0) {
    container.innerHTML = `
      <div class="vazio">
        <span>📽️</span>
        Nenhuma sessão cadastrada ainda.<br>
        <a href="cadastro-sessoes.html" class="btn btn-primario btn-sm" style="margin-top:1rem; display:inline-block;">Cadastrar Sessão</a>
      </div>`;
    return;
  }

  container.innerHTML = '';

  // Ordena as sessões pela data/hora (mais próxima primeiro)
  const ordenadas = [...sessoes].sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

  ordenadas.forEach(sessao => {
    const filme = filmes.find(f => f.id === sessao.filmeId);
    const sala = salas.find(s => s.id === sessao.salaId);

    const nomeFilme = filme ? filme.titulo : 'Filme desconhecido';
    const nomeSala = sala ? sala.nome : 'Sala desconhecida';
    const tipoSala = sala ? sala.tipo : '';
    const dataFormatada = formatarDataHora(sessao.dataHora);
    const classificacao = filme ? filme.classificacao : '';
    const genero = filme ? filme.genero : '';
    const descricao = filme && filme.descricao ? filme.descricao : '';
    const duracao = filme && filme.duracao ? `${filme.duracao} min` : '';

    // Conta quantos ingressos já foram vendidos para esta sessão
    const ingressos = JSON.parse(localStorage.getItem('ingressos') || '[]');
    const qtdIngressos = ingressos.filter(i => i.sessaoId === sessao.id).length;

    const card = document.createElement('div');
    card.className = 'sessao-card';
    card.innerHTML = `
      <div class="filme-titulo">${nomeFilme}</div>
      <div>
        <span class="badge">${sessao.formato}</span>
        <span class="badge">${sessao.idioma}</span>
        ${tipoSala ? `<span class="badge">${tipoSala}</span>` : ''}
        ${classificacao ? `<span class="badge">${classificacao}</span>` : ''}
      </div>
      <div class="info-item">🎭 ${genero || 'Gênero não informado'}${duracao ? ' &nbsp;·&nbsp; ⏱️ ' + duracao : ''}</div>
      ${descricao ? `<div class="sessao-descricao">${descricao}</div>` : ''}
      <div class="info-item">🏛️ ${nomeSala}</div>
      <div class="info-item">📅 ${dataFormatada}</div>
      <div class="sessao-rodape">
        <span class="preco">R$ ${parseFloat(sessao.preco).toFixed(2)}</span>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          ${qtdIngressos > 0 ? `<span style="font-size:0.78rem;color:var(--cinza);">🎟️ ${qtdIngressos} vendido(s)</span>` : ''}
          <a href="venda-ingressos.html?sessao=${sessao.id}" class="btn btn-primario btn-sm">🎟️ Comprar</a>
          <button
            class="btn btn-danger btn-sm"
            onclick="abrirModalExclusao(${sessao.id}, '${nomeFilme.replace(/'/g, "\\'")} — ${dataFormatada.replace(/'/g, "\\'")}')"
          >🗑️</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Abre o modal de confirmação de exclusão para a sessão informada
// Verifica se há ingressos vendidos — se houver, bloqueia a exclusão
function abrirModalExclusao(id, descricao) {
  sessaoParaExcluir = id;

  // Verifica se existem ingressos vendidos para esta sessão
  const ingressos = JSON.parse(localStorage.getItem('ingressos') || '[]');
  const temIngresso = ingressos.some(i => i.sessaoId === id);

  document.getElementById('modal-sessao-nome').textContent = descricao;

  const aviso = document.getElementById('modal-aviso-sessao');
  const btnConfirmar = document.getElementById('btn-confirmar-sessao');

  if (temIngresso) {
    // Bloqueia a exclusão: já existem ingressos vendidos para esta sessão
    aviso.textContent = '⚠️ Esta sessão possui ingressos vendidos. Não é possível excluí-la.';
    aviso.classList.add('visivel');
    btnConfirmar.disabled = true;
    btnConfirmar.style.opacity = '0.4';
  } else {
    aviso.classList.remove('visivel');
    btnConfirmar.disabled = false;
    btnConfirmar.style.opacity = '1';
  }

  document.getElementById('modal-exclusao-sessao').classList.add('ativo');
}

// Fecha o modal sem realizar nenhuma ação
function fecharModal() {
  document.getElementById('modal-exclusao-sessao').classList.remove('ativo');
  sessaoParaExcluir = null;
}

// =============================================
// CRUD - DELETE: Remove a sessão do localStorage
// =============================================
function confirmarExclusaoSessao() {
  if (!sessaoParaExcluir) return;

  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');

  // filter() retorna um novo array excluindo a sessão com o ID selecionado
  const sessoesFiltradas = sessoes.filter(s => s.id !== sessaoParaExcluir);

  // Salva a lista atualizada (sem a sessão excluída) no localStorage
  localStorage.setItem('sessoes', JSON.stringify(sessoesFiltradas));

  fecharModal();
  renderizarSessoes();
}

// Formata data e hora no padrão brasileiro com dia da semana
function formatarDataHora(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
