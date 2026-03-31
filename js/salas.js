// ===== CADASTRO DE SALAS =====
// Este arquivo gerencia o formulário de cadastro de salas do cinema.
// CRUD presente neste arquivo: CREATE (salvar nova sala)

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {

  // Obtém a referência ao formulário e ao elemento de alerta na página
  const form = document.getElementById('form-sala');
  const alerta = document.getElementById('alerta');

  // Verifica se o formulário existe na página antes de adicionar o evento
  if (form) {

    // Escuta o evento de envio do formulário
    form.addEventListener('submit', function (e) {

      // Impede o comportamento padrão do formulário (recarregar a página)
      e.preventDefault();

      // Coleta os valores dos campos do formulário
      const nome = document.getElementById('nome').value.trim();       // Nome da sala
      const capacidade = document.getElementById('capacidade').value;  // Capacidade em lugares
      const tipo = document.getElementById('tipo').value;              // Tipo: 2D, 3D ou IMAX

      // Validação: verifica se todos os campos obrigatórios foram preenchidos
      if (!nome || !capacidade || !tipo) {
        mostrarAlerta(alerta, 'Preencha todos os campos!', 'erro');
        return; // Interrompe a execução se houver campo vazio
      }

      // =============================================
      // CRUD - CREATE: Cria o objeto da nova sala
      // =============================================
      const sala = {
        id: Date.now(),            // Gera um ID único baseado no timestamp atual
        nome,
        capacidade: parseInt(capacidade), // Converte o valor para número inteiro
        tipo
      };

      // =============================================
      // CRUD - READ: Lê a lista de salas já salvas
      // =============================================
      // Busca a lista de salas salva no localStorage.
      // Se não existir ainda, retorna um array vazio como padrão.
      const salas = JSON.parse(localStorage.getItem('salas') || '[]');

      // Adiciona a nova sala ao array de salas existentes
      salas.push(sala);

      // Tenta salvar a lista atualizada no localStorage
      try {
        // =============================================
        // CRUD - UPDATE (persistência): Salva/atualiza
        // a lista de salas no armazenamento local
        // =============================================
        localStorage.setItem('salas', JSON.stringify(salas));

        // Exibe mensagem de sucesso após salvar
        mostrarAlerta(alerta, `Sala "${nome}" cadastrada com sucesso!`, 'sucesso');

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
