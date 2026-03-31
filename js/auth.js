// ===== VERIFICAÇÃO DE AUTENTICAÇÃO =====
// Este arquivo deve ser incluído em todas as páginas protegidas (exceto login.html).
// Garante que apenas usuários autenticados possam acessar o sistema.

// IIFE (Immediately Invoked Function Expression): executa imediatamente ao carregar o arquivo
// O uso de (function(){})() evita poluir o escopo global com variáveis
(function () {
  // Verifica se existe a chave 'logado' com valor 'true' no localStorage
  // Se o usuário não estiver logado, redireciona imediatamente para a tela de login
  if (localStorage.getItem('logado') !== 'true') {
    window.location.href = 'login.html'; // Redireciona para o login
  }
})();

// Função de logout: remove a sessão e redireciona para a tela de login
// É chamada pelo link "Sair" no menu de navegação
function logout() {
  localStorage.removeItem('logado'); // Remove o registro de sessão do armazenamento local
  window.location.href = 'login.html'; // Redireciona para a tela de login
}
