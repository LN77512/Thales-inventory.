// URL da API do Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwtYpNoU1FvhZGCayh9BVICBfoZUJbXENpc4bJz6NrdAbEPQ-jJ80ZoVeNGLL8kGQk5/exec";

// Elementos do DOM
const form = document.getElementById("inventory-form");
const tableBody = document.getElementById("inventory-body");

// Função de Login Segura (Validada no Servidor)
async function tentarLogin(event) {
  if (event) event.preventDefault();
  
  const userInput = document.getElementById("login-user")?.value.trim() || "";
  const passInput = document.getElementById("login-pass")?.value.trim() || "";

  try {
    const response = await fetch(`${API_URL}?action=login&user=${encodeURIComponent(userInput)}&pass=${encodeURIComponent(passInput)}`);
    const resultado = await response.json();

    if (resultado.status === "sucesso") {
      const modalLogin = document.getElementById("login-modal") || document.querySelector(".login-box")?.parentElement;
      if (modalLogin) modalLogin.style.display = "none";
      
      const appContainer = document.getElementById("app-container");
      if (appContainer) appContainer.style.display = "block";
      
      carregarEquipamentos();
    } else {
      alert("Credenciais incorretas.");
    }
  } catch (error) {
    console.error("Erro ao validar login:", error);
    alert("Erro de conexão ao tentar fazer login.");
  }
}

// Função para carregar os equipamentos da folha de cálculo
async function carregarEquipamentos() {
  if (!tableBody) return;
  try {
    const response = await fetch(`${API_URL}?action=ler`);
    const dados = await response.json();
    
    tableBody.innerHTML = ""; // Limpa a tabela antes de preencher

    if (!dados || dados.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #777;">Nenhum equipamento registado.</td></tr>`;
      return;
    }

    dados.forEach((item) => {
      const row = document.createElement("tr");
      row.id = `row-${item.id}`;
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${item.quantidade}</td>
        <td>${item.status}</td>
        <td>${item.responsavel}</td>
        <td>
          <button class="btn-edit" onclick="prepararEdicao(${item.id}, '${item.nome}', '${item.quantidade}', '${item.status}', '${item.responsavel}')">Editar</button>
          <button class="btn-delete" onclick="removerEquipamento(${item.id})">Remover</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

// Função para preencher o formulário com os dados para edição
function prepararEdicao(id, nome, quantidade, status, responsavel) {
  document.getElementById("nome").value = nome;
  document.getElementById("quantidade").value = quantidade;
  document.getElementById("status").value = status;
  document.getElementById("responsavel").value = responsavel;

  form.dataset.editId = id;
  const btnSubmit = form.querySelector("button[type='submit']");
  if (btnSubmit) btnSubmit.textContent = "Atualizar";
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para adicionar ou atualizar um equipamento
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editId = form.dataset.editId;
    const nome = document.getElementById("nome").value;
    const quantidade = document.getElementById("quantidade").value;
    const status = document.getElementById("status").value;
    const responsavel = document.getElementById("responsavel").value;

    const acao = editId ? "atualizar" : "adicionar";
    
    const dadosEquipamento = {
      action: acao,
      id: editId ? Number(editId) : undefined,
      nome,
      quantidade,
      status,
      responsavel
    };

    // Reseta o formulário e limpa o estado de edição imediatamente
    form.reset();
    delete form.dataset.editId;
    const btnSubmit = form.querySelector("button[type='submit']");
    if (btnSubmit) btnSubmit.textContent = "Adicionar";

    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(dadosEquipamento)
      });

      setTimeout(carregarEquipamentos, 1000);
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error);
      carregarEquipamentos();
    }
  });
}

// Função para remover um equipamento
async function removerEquipamento(id) {
  if (!confirm("Tem a certeza de que deseja remover este equipamento?")) return;

  const rowTarget = document.getElementById(`row-${id}`);
  if (rowTarget) rowTarget.style.opacity = "0.3";

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "remover", id: id })
    });

    setTimeout(carregarEquipamentos, 1000);
  } catch (error) {
    console.error("Erro ao remover equipamento:", error);
    carregarEquipamentos();
  }
}