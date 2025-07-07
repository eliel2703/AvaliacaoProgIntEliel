document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email')
    const logradouroInput = document.getElementById('logradouro');
    const numeroInput = document.getElementById('numero')
    const bairroInput = document.getElementById('bairro');
    const localidadeInput = document.getElementById('localidade');
    const ufInput = document.getElementById('uf');
    const buscarInput = document.getElementById('buscar')
    const salvarBtn = document.getElementById('salvar');
    const removerBtn = document.getElementById('remover');
    const editarBtn = document.getElementById('editar')
    const listaEnderecos = document.getElementById('lista-enderecos');

    carregarEnderecos();

    function limparCampos() {
        logradouroInput.value = '';
        bairroInput.value = '';
        localidadeInput.value = '';
        ufInput.value = '';
    }

    function preencherCampos(data) {
        logradouroInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        localidadeInput.value = data.localidade || '';
        ufInput.value = data.uf || '';
    }

    function mostrarErro() {
        limparCampos();
        alert('CEP não encontrado ou formato inválido');
    }

    function consultarCEP(cep) {
        limparCampos();
        
        if (cep.length !== 8 || !/^\d+$/.test(cep)) {
            mostrarErro();
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    mostrarErro();
                } else {
                    preencherCampos(data);
                }
            })
            .catch(() => mostrarErro());
    }

    function salvarEndereco() {
        const nome = nomeInput.value.trim();
        const email = emailInput.value;
        const cep = cepInput.value;
        const numero = numeroInput.value;
    
        
        if (!nome) {
            alert('Por favor, digite seu nome completo');
            return;
        }

        if (!email) {
            alert('Por favor, digite seu email');
            return;
        }

        if (!numero) {
            alert('Por favor, digite seu numero');
            return;
        }
        
        if (cep.length !== 8 || !logradouroInput.value) {
            alert('Por favor, consulte um CEP válido primeiro');
            return;
        }
        
        const endereco = {
            nome,
            email,
            cep,
            numero,
            logradouro: logradouroInput.value,
            bairro: bairroInput.value,
            localidade: localidadeInput.value,
            uf: ufInput.value,
        };
        
        const enderecos = JSON.parse(localStorage.getItem('enderecos') || '[]');
        
        enderecos.push(endereco);
        
        localStorage.setItem('enderecos', JSON.stringify(enderecos));
    
        carregarEnderecos();
    }

    function carregarEnderecos() {
        const enderecos = JSON.parse(localStorage.getItem('enderecos') || '[]');
        listaEnderecos.innerHTML = '';
        
        if (enderecos.length === 0) {
            listaEnderecos.innerHTML = '<p>Nenhum endereço salvo ainda.</p>';
            return;
        }
        
        enderecos.forEach((endereco, index) => {
            const enderecoDiv = document.createElement('div');
            enderecoDiv.className = 'endereco-item';
            enderecoDiv.innerHTML = `
                <h3>${endereco.nome}</h3>
                <p><strong>📧 </strong> ${endereco.email}</p>
                <p><strong>📍 </strong> ${endereco.logradouro}, Nº ${endereco.numero}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}</p>
                <p><small> CEP:</strong> ${endereco.cep}</small></p>
            `;
            listaEnderecos.appendChild(enderecoDiv);
        });
    }

    function removerEndereco() {
        if (confirm('Tem certeza que deseja limpar o endereço salvo?')) {
            localStorage.removeItem('enderecos');
            carregarEnderecos();
        }
    }

    cepInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
        
        if (this.value.length === 8) {
            consultarCEP(this.value);
        } else if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }
    });

    function editarEndereco() {
        return null;
    }

    salvarBtn.addEventListener('click', salvarEndereco);
    removerBtn.addEventListener('click', removerEndereco);
    editarBtn.addEventListener('clicl', editarEndereco);
});