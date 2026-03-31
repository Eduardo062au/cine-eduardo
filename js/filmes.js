// ===== CADASTRO DE FILMES =====
// Este arquivo gerencia o formulário de cadastro de filmes.
// CRUD presente neste arquivo: CREATE (salvar novo filme)

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {

  // Obtém a referência ao formulário e ao elemento de alerta na página
  const form = document.getElementById('form-filme');
  const alerta = document.getElementById('alerta');

  // Verifica se o formulário existe na página antes de adicionar o evento
  if (form) {

    // Escuta o evento de envio do formulário
    form.addEventListener('submit', function (e) {

      // Impede o comportamento padrão do formulário (recarregar a página)
      e.preventDefault();

      // Coleta os valores dos campos do formulário, removendo espaços extras com trim()
      const titulo = document.getElementById('titulo').value.trim();
      const genero = document.getElementById('genero').value.trim();
      const descricao = document.getElementById('descricao').value.trim();
      const classificacao = document.getElementById('classificacao').value;
      const duracao = document.getElementById('duracao').value;
      const estreia = document.getElementById('estreia').value;

      // Validação: verifica se os campos obrigatórios foram preenchidos
      if (!titulo || !genero || !classificacao || !duracao || !estreia) {
        mostrarAlerta(alerta, 'Preencha todos os campos obrigatórios!', 'erro');
        return; // Interrompe a execução se houver campo vazio
      }

      // =============================================
      // CRUD - CREATE: Cria o objeto do novo filme
      // =============================================
      const filme = {
        id: Date.now(),  // Gera um ID único baseado no timestamp atual (milissegundos)
        titulo,
        genero,
        descricao,
        classificacao,
        duracao,
        estreia
      };

      // =============================================
      // CRUD - READ: Lê a lista de filmes já salvos
      // =============================================
      // Busca a lista de filmes salva no localStorage.
      // Se não existir ainda, retorna um array vazio como padrão.
      const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');

      // Adiciona o novo filme ao array de filmes existentes
      filmes.push(filme);

      // Tenta salvar a lista atualizada no localStorage
      try {
        // =============================================
        // CRUD - UPDATE (persistência): Salva/atualiza
        // a lista de filmes no armazenamento local
        // =============================================
        localStorage.setItem('filmes', JSON.stringify(filmes));

        // Exibe mensagem de sucesso após salvar
        mostrarAlerta(alerta, `Filme "${titulo}" cadastrado com sucesso!`, 'sucesso');

        // Limpa todos os campos do formulário após o cadastro
        form.reset();

      } catch (err) {
        // Trata o erro específico de cota de armazenamento excedida
        if (err.name === 'QuotaExceededError') {
          mostrarAlerta(alerta, 'Limite de armazenamento atingido!', 'erro');
        }
      }
    });
  }
});

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
