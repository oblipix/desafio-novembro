// Definindo a URL da API e o Token
const apiUrl = 'https://ecom-back-strapi.onrender.com/api/products';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMwODM3NTM3LCJleHAiOjE3MzM0Mjk1Mzd9.yzINj9N4KDF-VAdhGuJ83YNm-GFhBYA-CgpAJkySMfI'; // Use sua chave API aqui

// Função para configurar os cabeçalhos
function configurarCabecalhos() {
    return {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
}

// Função para buscar produtos da API
async function buscarProdutos() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: configurarCabecalhos()
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }

        const data = await response.json();
        return data.data; // Retorna os produtos
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        exibirMensagemErro('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        return null; // Em caso de erro
    }
}

// Função para exibir mensagens de erro
function exibirMensagemErro(mensagem) {
    const erroContainer = document.getElementById('erro-container');
    erroContainer.textContent = mensagem;
    erroContainer.style.display = 'block';
}

// Função para exibir produtos na tela
function exibirProdutos(produtos) {
    const produtosContainer = document.getElementById('produtos');
    produtosContainer.innerHTML = '';

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        const imagem = document.createElement('img');
        imagem.src = produto.attributes.imagens[0] || 'placeholder.png'; 
        imagem.alt = produto.attributes.nome;
        imagem.classList.add('produto-imagem');

        const nome = document.createElement('h2');
        nome.textContent = produto.attributes.nome;

        const preco = document.createElement('p');
        preco.textContent = `Preço: R$ ${produto.attributes.preco.toFixed(2)}`;

        const botaoComprar = document.createElement('button');
        botaoComprar.textContent = 'Comprar';
        botaoComprar.onclick = () => {
            abrirModal(produto); // Passa o produto para o modal
        };

        produtoDiv.appendChild(imagem);
        produtoDiv.appendChild(nome);
        produtoDiv.appendChild(preco);
        produtoDiv.appendChild(botaoComprar);
        produtosContainer.appendChild(produtoDiv);
    });
}

// Função principal para executar o fluxo
async function iniciarApp() {
    const produtos = await buscarProdutos();
    if (produtos) {
        exibirProdutos(produtos);
    } else {
        console.error('Nenhum produto encontrado.');
    }
}

// Chame a função principal ao carregar a página
window.onload = iniciarApp;

// Função para abrir o modal e exibir as características do produto ou o formulário de contato
function abrirModal(produto = null) {
    const modal = document.getElementById('modal-caracteristicas');
    const modalContent = document.querySelector('.modal-content');

    // Limpa o conteúdo anterior
    modalContent.innerHTML = '';

    // Criando o botão de fechar (X)
    const fecharModalBtn = document.createElement('span');
    fecharModalBtn.id = 'fechar-modal';
    fecharModalBtn.classList.add('fechar-modal');
    fecharModalBtn.innerHTML = '&times;'; 

    // Função para fechar o modal
    fecharModalBtn.onclick = fecharModal;
    modalContent.appendChild(fecharModalBtn); 

    if (produto) {
        // Exibir características do produto
        const titulo = document.createElement('h2');
        titulo.textContent = `Características de ${produto.attributes.nome}`;
        modalContent.appendChild(titulo);

        const cor = document.createElement('p');
        cor.textContent = `Cor: ${produto.attributes.cor}`;
        modalContent.appendChild(cor);

        const tamanhosDisponiveis = document.createElement('div');
        tamanhosDisponiveis.innerHTML = `<label>Tamanhos Disponíveis:</label>`;
        
        const selectTamanho = document.createElement('select');
        produto.attributes.tamanhosDisponiveis.forEach(tamanho => {
            const option = document.createElement('option');
            option.value = tamanho;
            option.textContent = tamanho;
            selectTamanho.appendChild(option);
        });
        
        tamanhosDisponiveis.appendChild(selectTamanho);
        modalContent.appendChild(tamanhosDisponiveis);

        const botaoConfirmar = document.createElement('button');
        botaoConfirmar.textContent = 'Confirmar Compra';
        botaoConfirmar.onclick = () => {
            const tamanhoSelecionado = selectTamanho.value;
            alert(`Você comprou: ${produto.attributes.nome} - Tamanho: ${tamanhoSelecionado}`);
            fecharModal();
        };
        modalContent.appendChild(botaoConfirmar);

    } 

    modal.style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modal-caracteristicas');
    modal.style.display = 'none';
}

// Funções para manipulação do modal
document.getElementById('fechar-modal').onclick = fecharModal;

// Fecha o modal ao clicar fora do conteúdo do modal
window.onclick = (event) => {
    const modal = document.getElementById('modal-caracteristicas');
    if (event.target === modal) {
        fecharModal();
    }
};



