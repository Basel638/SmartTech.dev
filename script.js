
let projects = [];
let selectedProjectId = null; 
let currentSender = 'self'; 

const defaultProjects = [
    { 
        id: 1, 
        title: "Platform Requirements (SDLC Phase 1)", 
        description: "Stakeholder interviews, drafting the Software Requirements Specification (SRS), and finalizing technical architecture.",
        tasks: [
            { id: 101, name: "Interview department heads (Scope confirmation)", priority: "High", completed: true },
            { id: 102, name: "Draft SRS for Project Module", priority: "High", completed: false },
            { id: 103, name: "Finalize database schema (MongoDB)", priority: "Medium", completed: false },
        ],
        documents: [
            { id: 1, name: "Requirement_Specs_v1.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { id: 2, name: "Stakeholder_Meeting_Notes.docx", url: "https://example.com/notes.docx" }
        ]
    },
    { 
        id: 2, 
        title: "Core System Implementation (SDLC Phase 3)", 
        description: "Development of the Node.js backend API and the primary front-end components.",
        tasks: [
            { id: 201, name: "Set up Node/Express server environment", priority: "High", completed: true },
            { id: 202, name: "Implement User Authentication endpoints (API)", priority: "High", completed: false },
            { id: 203, name: "Develop frontend Task Card component (JS)", priority: "Medium", completed: false },
        ],
        documents: [
            { id: 3, name: "API_Design_Doc.json", url: "https://example.com/api.json" },
            { id: 4, name: "Budget_Spreadsheet.xlsx", url: "https://example.com/budget.xlsx" }
        ]
    }
];

function loadData() {
    const storedProjects = localStorage.getItem('smartTechProjects');
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    } else {
        projects = defaultProjects;
        saveData();
    }
    selectedProjectId = projects.length > 0 ? projects[0].id : null;
}

function saveData() {
    localStorage.setItem('smartTechProjects', JSON.stringify(projects));
}

function renderProjectList() {
    const projectListElement = document.getElementById('project-list');
    projectListElement.innerHTML = ''; 

    projects.forEach(project => {
        const listItem = document.createElement('li');
        listItem.textContent = project.title;
        listItem.dataset.id = project.id;
        listItem.onclick = () => selectProject(project.id);
        
        if (project.id === selectedProjectId) {
            listItem.classList.add('active');
        }
        
        projectListElement.appendChild(listItem);
    });
}

function selectProject(projectId) {
    selectedProjectId = projectId;
    const project = projects.find(p => p.id === projectId);

    if (project) {
        document.querySelector('#current-project-header h2').textContent = project.title;
        document.querySelector('#current-project-header .description').textContent = project.description;

        document.getElementById('task-form').classList.remove('hidden');

        renderProjectList();
        renderTaskList(project);
        renderDocumentList(project); 
    }
}


function calculateProgress(project) {
    if (!project || project.tasks.length === 0) return 0;
    
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.completed).length;
    
    return Math.round((completedTasks / totalTasks) * 100);
}

function renderProjectProgress(project) {
    const headerContainer = document.getElementById('project-progress').parentNode;
    const progressContainer = document.getElementById('project-progress');
    const percentage = calculateProgress(project);
    
    const existingText = headerContainer.querySelector('.progress-text');
    if (existingText) existingText.remove();
    
    progressContainer.innerHTML = `
        <div class="progress-bar" style="width: ${percentage}%;"></div>
    `;
    
    const progressText = document.createElement('span');
    progressText.classList.add('progress-text');
    progressText.textContent = `${percentage}% Complete`;
    progressText.style.fontSize = '0.9em';
    progressText.style.marginLeft = '10px';
    progressText.style.color = '#2c3e50';
    
    headerContainer.insertBefore(progressText, progressContainer.nextSibling);
}

function renderTaskList(project) {
    const taskListElement = document.getElementById('task-list');
    taskListElement.innerHTML = ''; 

    if (!project) {
        taskListElement.innerHTML = '<p style="text-align:center; color:#6c757d;">Please select a project from the sidebar.</p>';
        return;
    }

    project.tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; 
        }
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    project.tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        if (task.completed) listItem.classList.add('completed');

        const taskName = document.createElement('span');
        taskName.textContent = task.name;
        
        const priorityTag = document.createElement('span');
        priorityTag.classList.add('priority-tag', task.priority);
        priorityTag.textContent = task.priority;
        
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('complete-btn');
        completeBtn.innerHTML = task.completed ? '<i class="far fa-undo"></i>' : '<i class="far fa-circle-check"></i>';
        completeBtn.title = task.completed ? 'Mark Incomplete' : 'Mark Complete';
        completeBtn.onclick = () => toggleTaskCompletion(project.id, task.id);

        listItem.appendChild(taskName);
        listItem.appendChild(priorityTag);
        listItem.appendChild(completeBtn);
        taskListElement.appendChild(listItem);
    });
    
    renderProjectProgress(project);
}