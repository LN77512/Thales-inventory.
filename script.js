// ATENÇÃO: Mantenha aqui o link do seu Web App do Google Apps Script
const URL_API = "COLOQUE_AQUI_O_LINK_DO_SEU_WEB_APP_DO_APPS_SCRIPT";

// Função de Login Seguro via Servidor
function realizarLogin(event) {
    event.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');

    errorMsg.textContent = "A validar acesso...";

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({ acao: "login", usuario: user, senha: pass })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            carregarItens();
        } else {
            errorMsg.textContent = "Utilizador ou palavra-passe incorretos!";
        }
    })
    .catch(error => {
        console.error("Erro no login:", error);
        errorMsg.textContent = "Erro ao ligar ao servidor.";
    });
}

function realizarLogout() {
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').textContent = "";
}

// Carregar dados da tabela do inventário
function carregarItens() {
    fetch(URL_API + "?acao=listar")
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = "";
        
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>${item.status}</td>
                <td>${item.responsavel}</td>
                <td>
                    <button class="btn-editar" onclick="preencherEdicao('${item.id}', '${item.nome}', '${item.quantidade}', '${item.status}', '${item.responsavel}')">Editar</button>
                    <button class="btn-remover" onclick="removerItem('${item.id}')">Remover</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error("Erro ao carregar itens:", error));
}

// Guardar ou atualizar um item
function salvarItem(event) {
    event.preventDefault();
    
    const dadosItem = {
        acao: "salvar",
        id: document.getElementById('itemId').value,
        nome: document.getElementById('itemNome').value,
        quantidade: document.getElementById('itemQtd').value,
        status: document.getElementById('itemStatus').value,
        responsavel: document.getElementById('itemResp').value
    };

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify(dadosItem)
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('inventoryForm').reset();
            document.getElementById('itemId').readOnly = false;
            carregarItens();
        } else {
            alert("Erro ao guardar item.");
        }
    })
    .catch(error => console.error("Erro:", error));
}

// Preencher o formulário para edição rápida
function preencherEdicao(id, nome, quantidade, status, responsavel) {
    document.getElementById('itemId').value = id;
    document.getElementById('itemId').readOnly = true;
    document.getElementById('itemNome').value = nome;
    document.getElementById('itemQtd').value = quantidade;
    document.getElementById('itemStatus').value = status;
    document.getElementById('itemResp').value = responsavel;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Remover um item
function removerItem(id) {
    if (!confirm("Tem certeza que deseja remover este item?")) return;

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({ acao: "remover", id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            carregarItens();
        } else {
            alert("Erro ao remover item.");
        }
    })
    .catch(error => console.error("Erro:", error));
}

// Função para filtrar a tabela em tempo real com a barra de pesquisa
function filtrarTabela() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const tbody = document.getElementById('tableBody');
    const linhas = tbody.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const colunas = linhas[i].getElementsByTagName('td');
        let encontrou = false;

        for (let j = 0; j < colunas.length - 1; j++) { // Ignora a coluna de ações
            if (colunas[j]) {
                const textoColuna = colunas[j].textContent || colunas[j].innerText;
                if (textoColuna.toLowerCase().indexOf(filter) > -1) {
                    encontrou = true;
                    break;
                }
            }
        }

        linhas[i].style.display = encontrou ? "" : "none";
    }
}