// ===== LOGIN =====
// Este arquivo gerencia a autenticação do usuário no sistema.
// As credenciais são fixas (hardcoded) para fins de demonstração.

// Credenciais de acesso ao sistema (fixas para uso didático)
const USUARIO_CORRETO = 'admin'; // Usuário padrão do sistema
const SENHA_CORRETA = '1234';    // Senha padrão do sistema

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {

  // Obtém a referência ao formulário e ao elemento de alerta na página
  const form = document.getElementById('form-login');
  const alerta = document.getElementById('alerta');

  // Se o usuário já estiver logado, redireciona direto para a página inicial
  // Evita que alguém logado acesse a tela de login novamente
  if (localStorage.getItem('logado') === 'true') {
    window.location.href = 'index.html';
    return; // Interrompe a execução, pois já foi redirecionado
  }

  // Verifica se o formulário existe na página antes de adicionar o evento
  if (form) {

    // Escuta o evento de envio do formulário
    form.addEventListener('submit', function (e) {

      // Impede o comportamento padrão do formulário (recarregar a página)
      e.preventDefault();

      // Coleta os valores dos campos de usuário e senha
      const usuario = document.getElementById('usuario').value.trim();
      const senha = document.getElementById('senha').value; // Senha não usa trim() (espaços são válidos)

      // Verifica se o usuário e senha coincidem com as credenciais corretas
      if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {

        // Registra no localStorage que o usuário está logado
        localStorage.setItem('logado', 'true');

        // Redireciona para a página principal do sistema
        window.location.href = 'index.html';

      } else {
        // Exibe mensagem de erro caso as credenciais estejam incorretas
        alerta.textContent = 'Usuário ou senha incorretos!';
        alerta.className = 'alerta ativo alerta-erro'; // Aplica estilo de erro

        // Limpa o campo de senha e coloca o foco nele para nova tentativa
        document.getElementById('senha').value = '';
        document.getElementById('senha').focus();
      }
    });
  }
});
