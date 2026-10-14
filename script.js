// ATENÇÃO: Substitua pelo link do seu Web App do Google Apps Script
const URL_API = "COLOQUE_AQUI_O_LINK_DO_SEU_WEB_APP_DO_APPS_SCRIPT";

// Função de Login Seguro
function tentarLogin(event) {
    event.preventDefault();
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({ acao: "login", usuario: user, senha: pass })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('app-container').style.display = 'block';
            carregarItens();
        } else {
            alert("Utilizador ou palavra-passe incorretos!");
        }
    })
    .catch(error => {
        console.error("Erro no login:", error);
        alert("Erro ao ligar ao servidor.");
    });
}

// Carregar itens da tabela
function carregarItens() {
    fetch(URL_API + "?acao=listar")
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('inventory-body');
        tbody.innerHTML = "";
        
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>${item.status}</td>
                <td>${item.responsavel}</td>
                <td><button class="btn-remover" onclick="removerItem('${item.id}')">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error("Erro ao carregar itens:", error));
}

// Salvar novo item
function salvarItem(event) {
    event.preventDefault();
    
    const dadosItem = {
        acao: "salvar",
        nome: document.getElementById('nome').value,
        quantidade: document.getElementById('quantidade').value,
        status: document.getElementById('status').value,
        responsavel: document.getElementById('responsavel').value
    };

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify(dadosItem)
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('inventory-form').reset();
            carregarItens();
        } else {
            alert("Erro ao guardar item.");
        }
    })
    .catch(error => console.error("Erro:", error));
}

// Remover item
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

// Função de filtragem em tempo real com a barra de pesquisa
function filtrarTabela() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const tbody = document.getElementById('inventory-body');
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