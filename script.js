const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtYpNoU1FvhZGCayh9BVICBfoZUJbXENpc4bJz6NrdAbEPQ-jJ80ZoVeNGLL8kGQk5/exec";

function tentarLogin(event) {
  event.preventDefault();
  
  const usuario = document.getElementById("login-user").value.trim();
  const palavraPasse = document.getElementById("codigo-secreto").value.trim();

  // Credenciais estritas exigidas para entrar
  if (usuario === "@Thales" && palavraPasse === "@Thales2026!") {
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    carregarItens();
  } else {
    alert("Utilizador ou palavra-passe incorretos. Tente novamente.");
  }
}

// Função global executada pelo JSONP quando o Google Sheets responde
function processarDadosInventario(data) {
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
}

function carregarItens() {
  const oldScript = document.getElementById("jsonp-script");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.id = "jsonp-script";
  script.src = `${SCRIPT_URL}?action=ler&callback=processarDadosInventario`;
  document.body.appendChild(script);
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
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(dadosItem)
  })
  .then(() => {
    document.getElementById("inventory-form").reset();
    setTimeout(carregarItens, 1500);
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
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(dadosItem)
    })
    .then(() => {
      setTimeout(carregarItens, 1500);
    })
    .catch(error => console.error("Erro ao remover item:", error));
  }
}