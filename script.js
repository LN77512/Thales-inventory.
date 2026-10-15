// URL do Google Apps Script configurada
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtYpNoU1FvhZGCayh9BVICBfoZUJbXENpc4bJz6NrdAbEPQ-jJ80ZoVeNGLL8kGQk5/exec";

// Função para tentar efetuar o login
function tentarLogin(event) {
  event.preventDefault();
  
  const usuario = document.getElementById("login-user").value;
  const palavraPasse = document.getElementById("login-pass").value;

  // Validação simples (pode ajustar conforme as suas credenciais)
  if (usuario.trim() !== "" && palavraPasse.trim() !== "") {
    // Esconde o modal de login e mostra o painel principal do inventário
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    
    // Carrega os dados do inventário
    carregarItens();
  } else {
    alert("Por favor, preencha todos os campos de login.");
  }
}

// Função para carregar os itens do inventário (Google Sheets)
function carregarItens() {
  fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById("inventory-body");
      tbody.innerHTML = "";
      
      data.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.nome || ""}</td>
          <td>${item.quantidade || ""}</td>
          <td>${item.status || ""}</td>
          <td>${item.responsavel || ""}</td>
          <td><button class="btn-remover" onclick="removerItem(${index})">Remover</button></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(error => console.error("Erro ao carregar itens:", error));
}

// Função para salvar um novo item
function salvarItem(event) {
  event.preventDefault();

  const dadosItem = {
    nome: document.getElementById("nome").value,
    quantidade: document.getElementById("quantidade").value,
    status: document.getElementById("status").value,
    responsavel: document.getElementById("responsavel").value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(dadosItem)
  })
  .then(response => response.text())
  .then(() => {
    document.getElementById("inventory-form").reset();
    carregarItens();
  })
  .catch(error => console.error("Erro ao salvar item:", error));
}

// Função para remover um item
function removerItem(index) {
  if (confirm("Tem certeza que deseja remover este item?")) {
    fetch(SCRIPT_URL, {
      method: "DELETE",
      body: JSON.stringify({ index: index })
    })
    .then(() => carregarItens())
    .catch(error => console.error("Erro ao remover item:", error));
  }
}