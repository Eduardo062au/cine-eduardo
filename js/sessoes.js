// ===== CADASTRO DE SESSÕES =====
// Este arquivo gerencia o formulário de cadastro de sessões de cinema.
// CRUD presente neste arquivo: CREATE (salvar nova sessão) e READ (carregar filmes e salas nos selects)

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // CRUD - READ: Carrega filmes e salas nos selects
  // =============================================
  // Preenche os dropdowns de filmes e salas com os dados já cadastrados
  carregarFilmes();
  carregarSalas();

  // Obtém a referência ao formulário e ao elemento de alerta na página
  const form = document.getElementById('form-sessao');
  const alerta = document.getElementById('alerta');

  // Verifica se o formulário existe na página antes de adicionar o evento
  if (form) {

    // Escuta o evento de envio do formulário
    form.addEventListener('submit', function (e) {

      // Impede o comportamento padrão do formulário (recarregar a página)
      e.preventDefault();

      // Coleta os valores dos campos do formulário
      const filmeId = document.getElementById('filme').value;       // ID do filme selecionado
      const salaId = document.getElementById('sala').value;         // ID da sala selecionada
      const dataHora = document.getElementById('dataHora').value;   // Data e hora da sessão
      const preco = document.getElementById('preco').value;         // Preço do ingresso
      const idioma = document.getElementById('idioma').value;       // Dublado ou Legendado
      const formato = document.getElementById('formato').value;     // 2D ou 3D

      // Validação: verifica se todos os campos obrigatórios foram preenchidos
      if (!filmeId || !salaId || !dataHora || !preco || !idioma || !formato) {
        mostrarAlerta(alerta, 'Preencha todos os campos!', 'erro');
        return; // Interrompe a execução se houver campo vazio
      }

      // =============================================
      // CRUD - CREATE: Cria o objeto da nova sessão
      // =============================================
      const sessao = {
        id: Date.now(),              // Gera um ID único baseado no timestamp atual
        filmeId: parseInt(filmeId),  // Converte para número inteiro para garantir comparação correta
        salaId: parseInt(salaId),    // Converte para número inteiro para garantir comparação correta
        dataHora,
        preco: parseFloat(preco),    // Converte para número decimal (ex: 25.50)
        idioma,
        formato
      };

      // =============================================
      // CRUD - READ: Lê a lista de sessões já salvas
      // =============================================
      // Busca a lista de sessões salva no localStorage.
      // Se não existir ainda, retorna um array vazio como padrão.
      const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');

      // Adiciona a nova sessão ao array de sessões existentes
      sessoes.push(sessao);

      // Tenta salvar a lista atualizada no localStorage
      try {
        // =============================================
        // CRUD - UPDATE (persistência): Salva/atualiza
        // a lista de sessões no armazenamento local
        // =============================================
        localStorage.setItem('sessoes', JSON.stringify(sessoes));

        // Exibe mensagem de sucesso após salvar
        mostrarAlerta(alerta, 'Sessão cadastrada com sucesso!', 'sucesso');

        // Limpa todos os campos do formulário após o cadastro
        form.reset();

        // Recarrega os selects de filmes e salas para manter a lista atualizada
        carregarFilmes();
        carregarSalas();

      } catch (err) {
        // Trata o erro específico de cota de armazenamento excedida
        if (err.name === 'QuotaExceededError') {
          mostrarAlerta(alerta, 'Limite de armazenamento atingido!', 'erro');
        }
      }
    });
  }
});

// =============================================
// CRUD - READ: Função para carregar filmes no select
// =============================================
// Busca os filmes salvos no localStorage e preenche o dropdown de filmes
function carregarFilmes() {
  const select = document.getElementById('filme');
  if (!select) return; // Sai se o elemento não existir na página

  // Lê a lista de filmes do armazenamento local
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');

  // Limpa o select e adiciona a opção padrão vazia
  select.innerHTML = '<option value="">Selecione um filme</option>';

  // Itera sobre cada filme e cria uma opção no dropdown
  filmes.forEach(f => {
    const op = document.createElement('option');  // Cria um elemento <option>
    op.value = f.id;                              // Define o valor como o ID do filme
    op.textContent = `${f.titulo} (${f.classificacao})`; // Texto exibido no dropdown
    select.appendChild(op);                       // Adiciona a opção ao select
  });

  // Se não houver filmes cadastrados, exibe mensagem informativa
  if (filmes.length === 0) {
    select.innerHTML = '<option value="">Nenhum filme cadastrado</option>';
  }
}

// =============================================
// CRUD - READ: Função para carregar salas no select
// =============================================
// Busca as salas salvas no localStorage e preenche o dropdown de salas
function carregarSalas() {
  const select = document.getElementById('sala');
  if (!select) return; // Sai se o elemento não existir na página

  // Lê a lista de salas do armazenamento local
  const salas = JSON.parse(localStorage.getItem('salas') || '[]');

  // Limpa o select e adiciona a opção padrão vazia
  select.innerHTML = '<option value="">Selecione uma sala</option>';

  // Itera sobre cada sala e cria uma opção no dropdown
  salas.forEach(s => {
    const op = document.createElement('option');  // Cria um elemento <option>
    op.value = s.id;                              // Define o valor como o ID da sala
    op.textContent = `${s.nome} — ${s.tipo} (${s.capacidade} lugares)`; // Texto exibido
    select.appendChild(op);                       // Adiciona a opção ao select
  });

  // Se não houver salas cadastradas, exibe mensagem informativa
  if (salas.length === 0) {
    select.innerHTML = '<option value="">Nenhuma sala cadastrada</option>';
  }
}

// Função auxiliar para exibir mensagens de alerta temporárias na tela
// Parâmetros:
//   el   - elemento HTML onde o alerta será exibido
//   msg  - texto da mensagem
//   tipo - estilo do alerta: 'sucesso', 'erro' ou 'aviso'
function mostrarAlerta(el, msg, tipo) {
  el.textContent = msg; // Define o texto da mensagem
  el.className = 'alerta ativo alerta-' + tipo; // Aplica as classes CSS para mostrar e estilizar

  // Remove o alerta automaticamente após 3,5 segundos
  setTimeout(() => {
    el.className = 'alerta'; // Remove a classe 'ativo', escondendo o alerta
  }, 3500);
}
