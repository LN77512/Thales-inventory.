const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtYpNoU1FvhZGCayh9BVICBfoZUJbXENpc4bJz6NrdAbEPQ-jJ80ZoVeNGLL8kGQk5/exec";

function tentarLogin(event) {
  event.preventDefault();
  
  const usuario = document.getElementById("login-user").value;
  const palavraPasse = document.getElementById("login-pass").value;

  if (usuario.trim() !== "" && palavraPasse.trim() !== "") {
    // Entra de imediato no painel sem disparar erros de rede
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    
    // Carrega os dados em segundo plano
    carregarItens();
  } else {
    alert("Por favor, preencha todos os campos de login.");
  }
}

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
    .catch(error => console.log("Aviso de sincronização:", error));
}

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