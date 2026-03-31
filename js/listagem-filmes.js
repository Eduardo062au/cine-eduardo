// ===== LISTAGEM DE FILMES =====
// Exibe todos os filmes cadastrados e permite excluí-los.
// CRUD presente neste arquivo: READ (listar filmes) + DELETE (excluir filme)

// Guarda o ID do filme que está aguardando confirmação de exclusão
let filmeParaExcluir = null;

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {
  renderizarFilmes();

  // Botão "Cancelar" do modal: fecha sem excluir
  document.getElementById('btn-cancelar-exclusao').addEventListener('click', fecharModal);

  // Botão "Confirmar exclusão" do modal: executa o DELETE
  document.getElementById('btn-confirmar-exclusao').addEventListener('click', confirmarExclusaoFilme);
});

// =============================================
// CRUD - READ: Lê e exibe todos os filmes cadastrados
// =============================================
function renderizarFilmes() {
  const container = document.getElementById('lista-filmes');
  if (!container) return;

  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');

  if (filmes.length === 0) {
    container.innerHTML = `
      <div class="vazio">
        <span>🎥</span>
        Nenhum filme cadastrado ainda.<br>
        <a href="cadastro-filmes.html" class="btn btn-primario btn-sm" style="margin-top:1rem; display:inline-block;">Cadastrar Filme</a>
      </div>`;
    return;
  }

  container.innerHTML = '';

  filmes.forEach(filme => {
    // Formata a data de estreia para o padrão brasileiro (dd/mm/aaaa)
    const estreia = filme.estreia
      ? new Date(filme.estreia + 'T00:00:00').toLocaleDateString('pt-BR')
      : '';

    const card = document.createElement('div');
    card.className = 'filme-card';
    card.innerHTML = `
      <div class="filme-card-header">
        <div class="filme-card-titulo">${filme.titulo}</div>
        <span class="badge">${filme.classificacao || ''}</span>
      </div>
      <div class="filme-card-meta">
        <span>🎭 ${filme.genero || 'Gênero não informado'}</span>
        ${filme.duracao ? `<span>⏱️ ${filme.duracao} min</span>` : ''}
        ${estreia ? `<span>📅 ${estreia}</span>` : ''}
      </div>
      ${filme.descricao
        ? `<div class="filme-card-descricao">${filme.descricao}</div>`
        : '<div class="filme-card-descricao" style="color:#bbb;font-style:italic;">Sem descrição cadastrada.</div>'
      }
      <div style="margin-top:0.8rem; text-align:right;">
        <button
          class="btn btn-danger btn-sm"
          onclick="abrirModalExclusao(${filme.id}, '${filme.titulo.replace(/'/g, "\\'")}')"
        >🗑️ Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Abre o modal de confirmação de exclusão para o filme informado
// Verifica se há sessões vinculadas — se houver, bloqueia a exclusão
function abrirModalExclusao(id, titulo) {
  filmeParaExcluir = id; // Guarda o ID para uso na confirmação

  // Verifica se existe alguma sessão que usa este filme
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const temSessao = sessoes.some(s => s.filmeId === id);

  // Preenche o nome do filme no texto do modal
  document.getElementById('modal-filme-nome').textContent = titulo;

  const aviso = document.getElementById('modal-aviso-filme');
  const btnConfirmar = document.getElementById('btn-confirmar-exclusao');

  if (temSessao) {
    // Bloqueia a exclusão: existem sessões vinculadas a este filme
    aviso.textContent = '⚠️ Este filme possui sessões cadastradas. Exclua as sessões primeiro antes de remover o filme.';
    aviso.classList.add('visivel');
    btnConfirmar.disabled = true;  // Desativa o botão de confirmação
    btnConfirmar.style.opacity = '0.4';
  } else {
    // Nenhuma dependência: permite a exclusão normalmente
    aviso.classList.remove('visivel');
    btnConfirmar.disabled = false;
    btnConfirmar.style.opacity = '1';
  }

  // Exibe o modal
  document.getElementById('modal-exclusao-filme').classList.add('ativo');
}

// Fecha o modal sem realizar nenhuma ação
function fecharModal() {
  document.getElementById('modal-exclusao-filme').classList.remove('ativo');
  filmeParaExcluir = null; // Limpa o ID guardado
}

// =============================================
// CRUD - DELETE: Remove o filme do localStorage
// =============================================
function confirmarExclusaoFilme() {
  if (!filmeParaExcluir) return;

  // Lê a lista atual de filmes
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');

  // Filtra removendo o filme cujo ID bate com o selecionado
  // filter() retorna um novo array sem o item excluído
  const filmesFiltrados = filmes.filter(f => f.id !== filmeParaExcluir);

  // Salva a lista atualizada (sem o filme excluído) no localStorage
  localStorage.setItem('filmes', JSON.stringify(filmesFiltrados));

  fecharModal();       // Fecha o modal
  renderizarFilmes();  // Atualiza a listagem na tela
}
