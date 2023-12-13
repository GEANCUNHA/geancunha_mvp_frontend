document.addEventListener('DOMContentLoaded', function(){
    loadTasks(); // Carrega as tarefas ao carregar a página
    const addTaskBtn = document.getElementById('addTaskBtn');
    addTaskBtn.addEventListener('click', addTask);

    const deleteTaskBtn = document.getElementById('deleteTaskBtn');
    deleteTaskBtn.addEventListener('click', deleteTask);
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const responsavelInput = document.getElementById('responsavelInput');
    const taskList = document.getElementById('taskList');

    // Faz uma requisição POST para adicionar a tarefa
    fetch('/addtasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task: taskInput.value,
            responsavel: responsavelInput.value,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data);

        if (data.success) {
            taskInput.value = ''; 
            responsavelInput.value = '';                        
            console.log('Nova tarefa adicionada com sucesso. Chamando loadTasks...');
            alert('Tarefa adicionada com sucesso');
            loadTasks();
        } else {
            console.error('Falha em adicionar tarefa:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro na requisição. Verifique o console para mais detalhes.');
    });
}

function deleteTask() {
    const taskIdInput = document.getElementById('taskIdInput');
    const taskId = taskIdInput.value;

    // Confirme com o usuário antes de excluir
    if (confirm(`Deseja excluir a tarefa com ID ${taskId}?`)) {
        // Envie uma solicitação DELETE usando fetch
        fetch(`/deletetask/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do servidor:', data);

            if (data.success) {
                console.log('Tarefa excluída com sucesso. Chamando loadTasks...');
                alert('Tarefa excluída com sucesso');
                loadTasks();
            } else {
                console.error('Falha ao excluir tarefa:', data.message);
                alert(`Falha ao excluir tarefa: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro na requisição. Verifique o console para mais detalhes.');
        });
    }
}

function updateTaskList(tasks) {
    const taskList = document.getElementById('taskList');
    
    // Limpar a lista de tarefas existente
    taskList.innerHTML = '';

    // Criar a tabela
    const table = document.createElement('table');
    table.className = 'task-table';

    // Adicionar cabeçalho da tabela
    const headerRow = table.insertRow(0);
    const idHeader = headerRow.insertCell(0);
    idHeader.textContent = 'ID';
    const descriptionHeader = headerRow.insertCell(1);
    descriptionHeader.textContent = 'Descrição';
    const responsavelHeader = headerRow.insertCell(2);
    responsavelHeader.textContent = 'Responsável';

    // Adicionar cada tarefa à tabela
    tasks.forEach(task => {
        const row = table.insertRow(-1);
        
        const idCell = row.insertCell(0);
        idCell.textContent = task.id;

        const descriptionCell = row.insertCell(1);
        descriptionCell.textContent = task.description;

        const responsavelCell = row.insertCell(2);
        responsavelCell.textContent = task.responsavel;
    });

    // Adicionar a tabela à lista
    taskList.appendChild(table);
}

function loadTasks() {
    // Realize uma requisição GET para obter as tarefas existentes
    fetch('/gettasks')
        .then(response => response.json())
        .then(data => {
            console.log('Tarefas carregadas:', data);
            updateTaskList(data.tasks); // Chama a função para atualizar a lista de tarefas
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro na requisição. Verifique o console para mais detalhes.');
        });
}