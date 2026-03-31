// ===== LISTAGEM DE SALAS =====
// Exibe todas as salas cadastradas e permite excluí-las.
// CRUD presente neste arquivo: READ (listar salas) + DELETE (excluir sala)

// Guarda o ID da sala que está aguardando confirmação de exclusão
let salaParaExcluir = null;

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {
  renderizarSalas();

  // Botão "Cancelar" do modal: fecha sem excluir
  document.getElementById('btn-cancelar-sala').addEventListener('click', fecharModal);

  // Botão "Confirmar exclusão" do modal: executa o DELETE
  document.getElementById('btn-confirmar-sala').addEventListener('click', confirmarExclusaoSala);
});

// =============================================
// CRUD - READ: Lê e exibe todas as salas cadastradas
// =============================================
function renderizarSalas() {
  const container = document.getElementById('lista-salas');
  if (!container) return;

  const salas = JSON.parse(localStorage.getItem('salas') || '[]');

  if (salas.length === 0) {
    container.innerHTML = `
      <div class="vazio">
        <span>🏛️</span>
        Nenhuma sala cadastrada ainda.<br>
        <a href="cadastro-salas.html" class="btn btn-primario btn-sm" style="margin-top:1rem; display:inline-block;">Cadastrar Sala</a>
      </div>`;
    return;
  }

  container.innerHTML = '';

  salas.forEach(sala => {
    const card = document.createElement('div');
    card.className = 'sala-card';
    card.innerHTML = `
      <div class="sala-card-titulo">🏛️ ${sala.nome}</div>
      <div class="sala-card-meta">
        <span>📺 ${sala.tipo}</span>
        <span>💺 ${sala.capacidade} lugares</span>
      </div>
      <div style="margin-top:0.8rem; text-align:right;">
        <button
          class="btn btn-danger btn-sm"
          onclick="abrirModalExclusao(${sala.id}, '${sala.nome.replace(/'/g, "\\'")}')"
        >🗑️ Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Abre o modal de confirmação de exclusão para a sala informada
// Verifica se há sessões vinculadas — se houver, bloqueia a exclusão
function abrirModalExclusao(id, nome) {
  salaParaExcluir = id;

  // Verifica se existe alguma sessão que usa esta sala
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const temSessao = sessoes.some(s => s.salaId === id);

  document.getElementById('modal-sala-nome').textContent = nome;

  const aviso = document.getElementById('modal-aviso-sala');
  const btnConfirmar = document.getElementById('btn-confirmar-sala');

  if (temSessao) {
    // Bloqueia a exclusão: existem sessões usando esta sala
    aviso.textContent = '⚠️ Esta sala possui sessões cadastradas. Exclua as sessões primeiro antes de remover a sala.';
    aviso.classList.add('visivel');
    btnConfirmar.disabled = true;
    btnConfirmar.style.opacity = '0.4';
  } else {
    aviso.classList.remove('visivel');
    btnConfirmar.disabled = false;
    btnConfirmar.style.opacity = '1';
  }

  document.getElementById('modal-exclusao-sala').classList.add('ativo');
}

// Fecha o modal sem realizar nenhuma ação
function fecharModal() {
  document.getElementById('modal-exclusao-sala').classList.remove('ativo');
  salaParaExcluir = null;
}

// =============================================
// CRUD - DELETE: Remove a sala do localStorage
// =============================================
function confirmarExclusaoSala() {
  if (!salaParaExcluir) return;

  const salas = JSON.parse(localStorage.getItem('salas') || '[]');

  // filter() retorna um novo array excluindo a sala com o ID selecionado
  const salasFiltradas = salas.filter(s => s.id !== salaParaExcluir);

  // Salva a lista atualizada (sem a sala excluída) no localStorage
  localStorage.setItem('salas', JSON.stringify(salasFiltradas));

  fecharModal();
  renderizarSalas();
}
