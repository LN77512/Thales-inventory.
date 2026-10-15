const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtYpNoU1FvhZGCayh9BVICBfoZUJbXENpc4bJz6NrdAbEPQ-jJ80ZoVeNGLL8kGQk5/exec";

function tentarLogin(event) {
  event.preventDefault();
  
  const usuario = document.getElementById("login-user").value;
  const palavraPasse = document.getElementById("login-pass").value;

  if (usuario.trim() !== "" && palavraPasse.trim() !== "") {
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("app-container").style.display = "block";
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

  const nome = document.getElementById("nome").value;
  const quantidade = document.getElementById("quantidade").value;
  const status = document.getElementById("status").value;
  const responsavel = document.getElementById("responsavel").value;

  // Usa parâmetro URL para contornar restrições de CORS no envio de formulários simples
  const urlEnvio = `${SCRIPT_URL}?nome=${encodeURIComponent(nome)}&quantidade=${encodeURIComponent(quantidade)}&status=${encodeURIComponent(status)}&responsavel=${encodeURIComponent(responsavel)}`;

  fetch(urlEnvio, { method: "GET", mode: "no-cors" })
    .then(() => {
      document.getElementById("inventory-form").reset();
      setTimeout(carregarItens, 1000);
    })
    .catch(error => console.error("Erro ao salvar item:", error));
}

function removerItem(index) {
  if (confirm("Tem certeza que deseja remover este item?")) {
    const urlRemover = `${SCRIPT_URL}?acao=remover&index=${index}`;
    fetch(urlRemover, { method: "GET", mode: "no-cors" })
      .then(() => setTimeout(carregarItens, 1000))
      .catch(error => console.error("Erro ao remover item:", error));
  }
}