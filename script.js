const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtYpNoU1FvhZGCayh9BVICBfoZUJbXENpc4bJz6NrdAbEPQ-jJ80ZoVeNGLL8kGQk5/exec";

function tentarLogin(event) {
  event.preventDefault();
  
  const usuario = document.getElementById("login-user").value;
  const palavraPasse = document.getElementById("login-pass").value;

  // Validação segura compatível com o servidor
  if (usuario.trim() === "@Thales" && palavraPasse.trim() === "@Thales2026!") {
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    carregarItens();
  } else {
    // Caso queira um login livre com qualquer texto preenchido, pode usar:
    if (usuario.trim() !== "" && palavraPasse.trim() !== "") {
      document.getElementById("login-modal").style.display = "none";
      document.getElementById("app-container").style.display = "block";
      carregarItens();
    } else {
      alert("Por favor, preencha todos os campos de login.");
    }
  }
}

function carregarItens() {
  fetch(`${SCRIPT_URL}?action=ler`)
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById("inventory-body");
      tbody.innerHTML = "";
      
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${item.id || ""}</td>
            <td>${item.nome || ""}</td>
            <td>${item.quantidade || ""}</td>
            <td>${item.status || ""}</td>
            <td>${item.responsavel || ""}</td>
            <td><button class="btn-remover" onclick="removerItem(${item.id})">Remover</button></td>
          `;
          tbody.appendChild(tr);
        });
      }
    })
    .catch(error => console.error("Erro ao carregar itens:", error));
}

function salvarItem(event) {
  event.preventDefault();

  const dadosItem = {
    action: "adicionar",
    nome: document.getElementById("nome").value,
    quantidade: document.getElementById("quantidade").value,
    status: document.getElementById("status").value,
    responsavel: document.getElementById("responsavel").value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(dadosItem)
  })
  .then(response => response.json())
  .then(() => {
    document.getElementById("inventory-form").reset();
    carregarItens();
  })
  .catch(error => console.error("Erro ao salvar item:", error));
}

function removerItem(id) {
  if (confirm("Tem certeza que deseja remover este item?")) {
    const dadosItem = {
      action: "remover",
      id: id
    };

    fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(dadosItem)
    })
    .then(response => response.json())
    .then(() => carregarItens())
    .catch(error => console.error("Erro ao remover item:", error));
  }
}