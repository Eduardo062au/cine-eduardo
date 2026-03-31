// ===== VENDA DE INGRESSOS =====
// Este arquivo gerencia o formulário de venda de ingressos.
// CRUD presente neste arquivo:
//   READ   - Carrega sessões disponíveis no select
//   CREATE - Registra a venda de um novo ingresso

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // CRUD - READ: Carrega as sessões disponíveis
  // =============================================
  carregarSessoes();

  // Verifica se a URL contém o parâmetro 'sessao' (vindo da página Em Cartaz)
  // Exemplo de URL: venda-ingressos.html?sessao=1234567890
  const params = new URLSearchParams(window.location.search);
  const sessaoParam = params.get('sessao'); // Extrai o valor do parâmetro 'sessao'

  // Se um ID de sessão foi passado na URL, pré-seleciona a sessão no dropdown
  if (sessaoParam) {
    const select = document.getElementById('sessao');
    if (select) {
      select.value = sessaoParam; // Define o valor selecionado no dropdown
    }
  }

  // Obtém a referência ao formulário e ao elemento de alerta na página
  const form = document.getElementById('form-ingresso');
  const alerta = document.getElementById('alerta');

  // Verifica se o formulário existe na página antes de adicionar o evento
  if (form) {

    // Escuta o evento de envio do formulário
    form.addEventListener('submit', function (e) {

      // Impede o comportamento padrão do formulário (recarregar a página)
      e.preventDefault();

      // Coleta os valores dos campos do formulário
      const sessaoId = document.getElementById('sessao').value;             // ID da sessão selecionada
      const cliente = document.getElementById('cliente').value.trim();      // Nome do cliente
      const cpf = document.getElementById('cpf').value.trim();             // CPF do cliente
      const assento = document.getElementById('assento').value.trim().toUpperCase(); // Converte assento para maiúsculas (ex: a10 -> A10)
      const pagamento = document.getElementById('pagamento').value;        // Forma de pagamento

      // Validação: verifica se todos os campos obrigatórios foram preenchidos
      if (!sessaoId || !cliente || !cpf || !assento || !pagamento) {
        mostrarAlerta(alerta, 'Preencha todos os campos!', 'erro');
        return; // Interrompe a execução se houver campo vazio
      }

      // Valida o formato do CPF antes de prosseguir
      if (!validarCPF(cpf)) {
        mostrarAlerta(alerta, 'CPF inválido! Use o formato 000.000.000-00', 'erro');
        return; // Interrompe se o CPF estiver em formato incorreto
      }

      // =============================================
      // CRUD - READ: Verifica assentos já ocupados
      // =============================================
      // Busca todos os ingressos já vendidos no localStorage
      const ingressos = JSON.parse(localStorage.getItem('ingressos') || '[]');

      // Verifica se o assento já está ocupado na mesma sessão
      // O método find() retorna o primeiro ingresso que atenda às condições
      const assentoDuplicado = ingressos.find(
        i => i.sessaoId == sessaoId && i.assento === assento
      );

      // Se o assento já estiver ocupado, exibe erro e impede a venda
      if (assentoDuplicado) {
        mostrarAlerta(alerta, `Assento ${assento} já está ocupado nessa sessão!`, 'erro');
        return;
      }

      // =============================================
      // CRUD - CREATE: Cria o objeto do novo ingresso
      // =============================================
      const ingresso = {
        id: Date.now(),                       // Gera um ID único baseado no timestamp atual
        sessaoId: parseInt(sessaoId),         // Converte para número inteiro
        cliente,
        cpf,
        assento,
        pagamento,
        dataCompra: new Date().toISOString()  // Registra a data/hora da compra no formato ISO
      };

      // Adiciona o novo ingresso ao array de ingressos
      ingressos.push(ingresso);

      // Tenta salvar a lista atualizada no localStorage
      try {
        // =============================================
        // CRUD - UPDATE (persistência): Salva/atualiza
        // a lista de ingressos no armazenamento local
        // =============================================
        localStorage.setItem('ingressos', JSON.stringify(ingressos));

        // Exibe mensagem de sucesso com nome do cliente e assento
        mostrarAlerta(alerta, `Ingresso para ${cliente} (Assento ${assento}) confirmado!`, 'sucesso');

        // Limpa todos os campos do formulário após a venda
        form.reset();

        // Recarrega o select de sessões para manter os dados atualizados
        carregarSessoes();

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
// CRUD - READ: Carrega as sessões no dropdown
// =============================================
// Busca sessões, filmes e salas no localStorage e monta as opções do select
function carregarSessoes() {
  const select = document.getElementById('sessao');
  if (!select) return; // Sai se o elemento não existir na página

  // Lê as listas de sessões, filmes e salas do armazenamento local
  const sessoes = JSON.parse(localStorage.getItem('sessoes') || '[]');
  const filmes = JSON.parse(localStorage.getItem('filmes') || '[]');
  const salas = JSON.parse(localStorage.getItem('salas') || '[]');

  // Limpa o select e adiciona a opção padrão vazia
  select.innerHTML = '<option value="">Selecione uma sessão</option>';

  // Se não houver sessões cadastradas, informa o usuário
  if (sessoes.length === 0) {
    select.innerHTML = '<option value="">Nenhuma sessão disponível</option>';
    return;
  }

  // Itera sobre cada sessão e cria uma opção no dropdown
  sessoes.forEach(s => {
    // Busca o filme relacionado à sessão pelo filmeId
    const filme = filmes.find(f => f.id === s.filmeId);
    // Busca a sala relacionada à sessão pelo salaId
    const sala = salas.find(r => r.id === s.salaId);

    // Usa nome padrão caso o filme ou sala não seja encontrado
    const nomeFilme = filme ? filme.titulo : 'Filme desconhecido';
    const nomeSala = sala ? sala.nome : 'Sala desconhecida';

    // Formata a data e hora da sessão para exibição amigável
    const dataFormatada = formatarDataHora(s.dataHora);

    const op = document.createElement('option');  // Cria um elemento <option>
    op.value = s.id;                              // Define o valor como o ID da sessão
    op.textContent = `${nomeFilme} — ${nomeSala} — ${dataFormatada} — R$ ${parseFloat(s.preco).toFixed(2)}`;
    select.appendChild(op);                       // Adiciona a opção ao select
  });
}

// Função auxiliar para formatar data e hora no padrão brasileiro
// Parâmetro: dt - string de data/hora no formato ISO ou datetime-local
function formatarDataHora(dt) {
  if (!dt) return ''; // Retorna vazio se a data for nula ou indefinida
  const d = new Date(dt); // Converte a string para objeto Date
  // Formata a data (dd/mm/aaaa) e hora (hh:mm) separadamente e une com espaço
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Função para validar o formato do CPF
// Aceita CPF com ou sem formatação: 000.000.000-00 ou 00000000000
function validarCPF(cpf) {
  // Expressão regular que aceita CPF com ou sem pontuação
  return /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(cpf);
}

// Função auxiliar para exibir mensagens de alerta temporárias na tela
// Parâmetros:
//   el   - elemento HTML onde o alerta será exibido
//   msg  - texto da mensagem
//   tipo - estilo do alerta: 'sucesso', 'erro' ou 'aviso'
function mostrarAlerta(el, msg, tipo) {
  el.textContent = msg; // Define o texto da mensagem
  el.className = 'alerta ativo alerta-' + tipo; // Aplica as classes CSS para mostrar e estilizar

  // Remove o alerta automaticamente após 4 segundos
  setTimeout(() => {
    el.className = 'alerta'; // Remove a classe 'ativo', escondendo o alerta
  }, 4000);
}
