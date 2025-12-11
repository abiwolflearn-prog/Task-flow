// State
let tasks = JSON.parse(localStorage.getItem('taskflow-data')) || [];
let darkMode = JSON.parse(localStorage.getItem('taskflow-theme')) || false;
let searchQuery = '';
let filterCategory = 'All';
let sortOption = 'newest';

// Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const categorySelect = document.getElementById('categorySelect');
const taskListEl = document.getElementById('taskList');
const emptyStateEl = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterCategory');
const sortSelect = document.getElementById('sortOption');

// Colors matching React version
const categoryColors = {
    Personal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Work: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    School: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Shopping: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

// --- Initialization ---

function init() {
    applyTheme();
    renderTasks();
    lucide.createIcons();

    // Input listeners
    taskInput.addEventListener('input', () => {
        addBtn.disabled = taskInput.value.trim() === '';
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value, categorySelect.value);
        taskInput.value = '';
        addBtn.disabled = true;
    });

    themeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        localStorage.setItem('taskflow-theme', JSON.stringify(darkMode));
        applyTheme();
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTasks();
    });

    filterSelect.addEventListener('change', (e) => {
        filterCategory = e.target.value;
        renderTasks();
    });

    sortSelect.addEventListener('change', (e) => {
        sortOption = e.target.value;
        renderTasks();
    });
}

// --- Logic ---

function applyTheme() {
    if (darkMode) {
        document.documentElement.classList.add('dark');
        themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

function addTask(text, category) {
    if (!text.trim()) return;
    const newTask = {
        id: crypto.randomUUID(),
        text: text.trim(),
        category,
        completed: false,
        createdAt: Date.now()
    };
    tasks.unshift(newTask);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
}

function editTask(id, newText) {
    tasks = tasks.map(t => t.id === id ? { ...t, text: newText } : t);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('taskflow-data', JSON.stringify(tasks));
    renderTasks();
}

// --- Rendering ---

function renderTasks() {
    // Filter
    let filtered = tasks.filter(t => {
        const matchesCat = filterCategory === 'All' || t.category === filterCategory;
        const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    // Sort
    filtered.sort((a, b) => {
        if (sortOption === 'newest') return b.createdAt - a.createdAt;
        if (sortOption === 'oldest') return a.createdAt - b.createdAt;
        if (sortOption === 'a-z') return a.text.localeCompare(b.text);
        if (sortOption === 'z-a') return b.text.localeCompare(a.text);
        return 0;
    });

    // Stats
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    document.getElementById('pendingCount').textContent = total - completed;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = total;

    // HTML Gen
    taskListEl.innerHTML = '';
    
    if (filtered.length === 0) {
        emptyStateEl.classList.remove('hidden');
        emptyStateEl.classList.add('flex');
    } else {
        emptyStateEl.classList.add('hidden');
        emptyStateEl.classList.remove('flex');
        
        filtered.forEach(task => {
            const el = createTaskElement(task);
            taskListEl.appendChild(el);
        });
    }

    lucide.createIcons();
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `group flex flex-col sm:flex-row items-center gap-4 p-4 mb-3 rounded-xl border transition-all duration-300 ${
        task.completed 
        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-75' 
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900'
    }`;

    div.innerHTML = `
        <div class="flex items-center w-full gap-3">
            <button onclick="toggleTask('${task.id}')" class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
            }">
                ${task.completed ? '<i data-lucide="check" class="w-4 h-4"></i>' : ''}
            </button>
            
            <div class="flex-grow min-w-0">
                <div class="flex flex-col gap-1">
                    <span class="text-base font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}">${task.text}</span>
                    <div class="flex items-center gap-2">
                        <span class="text-xs px-2 py-0.5 rounded-md font-medium ${categoryColors[task.category]}">${task.category}</span>
                        <span class="flex items-center text-xs text-slate-400">
                            <i data-lucide="calendar" class="w-3 h-3 mr-1"></i>
                            ${new Date(task.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button onclick="promptEdit('${task.id}', '${task.text}')" class="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                <i data-lucide="edit-2" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteTask('${task.id}')" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    return div;
}

// Expose to window for inline onclicks
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.promptEdit = (id, oldText) => {
    const newText = prompt("Edit task:", oldText);
    if (newText !== null && newText.trim()) {
        editTask(id, newText.trim());
    }
};

// Start
init();
