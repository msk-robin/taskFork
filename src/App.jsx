import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, dracula, okaidia, solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { saveAs } from 'file-saver'

// Icons
const DeleteIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const CodeIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const CommandIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
  </svg>
)

const ThemeIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
)

const WorkspaceIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h7v7H3z"></path>
    <path d="M14 3h7v7h-7z"></path>
    <path d="M14 14h7v7h-7z"></path>
    <path d="M3 14h7v7H3z"></path>
  </svg>
)

// Themes
const themes = {
  slate: {
    name: 'Slate Dark',
    bg: 'bg-slate-900',
    card: 'bg-slate-800/50',
    text: 'text-slate-100',
    border: 'border-slate-700/50',
    input: 'bg-slate-700/50 border-slate-600/50',
    primary: 'bg-cyan-600 hover:bg-cyan-500',
    highlight: 'text-cyan-400',
    focusRing: 'focus:ring-cyan-500/50 focus:border-cyan-500/50'
  },
  monokai: {
    name: 'Monokai',
    bg: 'bg-[#272822]',
    card: 'bg-[#3E3D32]/70',
    text: 'text-[#F8F8F2]',
    border: 'border-[#75715E]/50',
    input: 'bg-[#3E3D32]/70 border-[#75715E]/50',
    primary: 'bg-[#F92672] hover:bg-[#FD5E90]',
    highlight: 'text-[#FD971F]',
    focusRing: 'focus:ring-[#F92672]/50 focus:border-[#F92672]/50'
  },
  dracula: {
    name: 'Dracula',
    bg: 'bg-[#282A36]',
    card: 'bg-[#44475A]/70',
    text: 'text-[#F8F8F2]',
    border: 'border-[#6272A4]/50',
    input: 'bg-[#44475A]/70 border-[#6272A4]/30',
    primary: 'bg-[#BD93F9] hover:bg-[#D1B0FB] text-[#282A36]',
    highlight: 'text-[#FF79C6]',
    focusRing: 'focus:ring-[#FF79C6]/50 focus:border-[#FF79C6]/50'
  },
  nord: {
    name: 'Nord',
    bg: 'bg-[#2E3440]',
    card: 'bg-[#3B4252]/90',
    text: 'text-[#ECEFF4]',
    border: 'border-[#4C566A]/50',
    input: 'bg-[#3B4252]/90 border-[#4C566A]/50',
    primary: 'bg-[#88C0D0] hover:bg-[#8FBCBB] text-[#2E3440]',
    highlight: 'text-[#88C0D0]',
    focusRing: 'focus:ring-[#88C0D0]/50 focus:border-[#88C0D0]/50'
  }
};

// Custom components for Markdown rendering
const MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const theme = {
      slate: tomorrow,
      monokai: okaidia,
      dracula: dracula,
      nord: solarizedlight
    }
    
    return !inline && match ? (
      <SyntaxHighlighter
        style={theme[currentTheme] || tomorrow}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={`${className || ''} bg-gray-800/50 px-1 rounded text-sm`} {...props}>
        {children}
      </code>
    )
  },
  a({ node, className, children, ...props }) {
    // Check if link is a GitHub URL
    const isGitHubLink = props.href && props.href.includes('github.com')
    return (
      <a 
        className={`${className || ''} ${isGitHubLink ? 'flex items-center gap-1' : ''} text-blue-400 hover:underline`} 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {isGitHubLink && (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        )}
        {children}
      </a>
    )
  }
}

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [categories] = useState(['Development', 'Meetings', 'Product', 'Research', 'Growth', 'Self-care'])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('slate')
  const [workspace, setWorkspace] = useState('work')
  const [workspaces] = useState(['work', 'personal', 'side-projects'])
  const [expandedTask, setExpandedTask] = useState(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false)
  const inputRef = useRef(null)
  const [importance, setImportance] = useState('medium')
  const [urgency, setUrgency] = useState('medium')
  const [viewMode, setViewMode] = useState('list') // list, kanban, matrix
  const [fileInput, setFileInput] = useState(null)
  
  // Active theme
  const theme = themes[currentTheme];

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${workspace}`)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Add sample tasks for first-time users
      const sampleTasks = [
        {
          id: 1,
          text: 'Review MVP feature priorities',
          completed: false,
          category: 'Product',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          priority: 'high',
          importance: 'high',
          urgency: 'high',
          createdAt: new Date().toISOString(),
          description: '- Review user feedback\n- Prioritize by impact vs effort\n- Update roadmap accordingly'
        },
        {
          id: 2,
          text: 'Refactor authentication service',
          completed: false,
          category: 'Development',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          priority: 'medium',
          importance: 'high',
          urgency: 'low',
          createdAt: new Date().toISOString(),
          description: '```js\n// TODO: Implement token refresh\nfunction refreshToken() {\n  // Add implementation\n}\n```'
        },
        {
          id: 3,
          text: 'Schedule 1:1 with designer',
          completed: true,
          category: 'Meetings',
          dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          priority: 'low',
          importance: 'medium',
          urgency: 'medium',
          createdAt: new Date().toISOString(),
          description: 'Discuss:\n- New design system\n- Component library\n- Mobile responsiveness'
        },
        {
          id: 4,
          text: 'Review GitHub issues',
          completed: false,
          category: 'Development',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          priority: 'medium',
          importance: 'low',
          urgency: 'high',
          createdAt: new Date().toISOString(),
          description: 'Check issues at [GitHub](https://github.com/msk-robin/taskFork/issues)'
        }
      ]
      setTasks(sampleTasks)
      localStorage.setItem(`tasks_${workspace}`, JSON.stringify(sampleTasks))
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }

    // Setup keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [workspace])

  useEffect(() => {
    localStorage.setItem(`tasks_${workspace}`, JSON.stringify(tasks))
  }, [tasks, workspace])

  useEffect(() => {
    localStorage.setItem('theme', currentTheme)
  }, [currentTheme])

  const handleKeyDown = (e) => {
    // Command palette toggle with Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setShowShortcuts(prev => !prev)
    }

    // Add new task with Cmd+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (document.activeElement === inputRef.current && newTask.trim()) {
        handleAddTask(e)
      }
    }

    // Toggle theme with Cmd+Shift+T or Ctrl+Shift+T
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
      e.preventDefault()
      cycleTheme()
    }

    // Show shortcuts with ? key
    if (e.key === '?' && !e.metaKey && !e.ctrlKey && 
        document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA' && 
        document.activeElement.tagName !== 'SELECT') {
      e.preventDefault()
      setShowShortcuts(true)
    }

    // Close modals with Escape
    if (e.key === 'Escape') {
      setShowShortcuts(false)
      setShowThemeSelector(false)
      setShowWorkspaceSelector(false)
      setExpandedTask(null)
    }
  }

  const showTaskNotification = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      if (editMode && currentTask) {
        // Update existing task
        const updatedTasks = tasks.map(task => 
          task.id === currentTask.id ? {
            ...task,
            text: newTask,
            category: newCategory,
            dueDate: dueDate,
            priority: priority,
            importance: importance,
            urgency: urgency,
            description: currentTask.description || ''
          } : task
        )
        setTasks(updatedTasks)
        setEditMode(false)
        setCurrentTask(null)
        showTaskNotification('Task updated successfully')
      } else {
        // Add new task
        const task = {
          id: Date.now(),
          text: newTask,
          completed: false,
          category: newCategory,
          dueDate: dueDate,
          priority: priority,
          importance: importance,
          urgency: urgency,
          createdAt: new Date().toISOString(),
          description: ''
        }
        setTasks([...tasks, task])
        showTaskNotification('Task added successfully')
      }
      
      // Reset form
      setNewTask('')
      setNewCategory('')
      setDueDate('')
      setPriority('medium')
      setImportance('medium')
      setUrgency('medium')
    }
  }

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    showTaskNotification('Task removed')
  }

  const editTask = (task) => {
    setCurrentTask(task)
    setNewTask(task.text)
    setNewCategory(task.category)
    setDueDate(task.dueDate || '')
    setPriority(task.priority)
    setImportance(task.importance || 'medium')
    setUrgency(task.urgency || 'medium')
    setEditMode(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const cancelEdit = () => {
    setCurrentTask(null)
    setNewTask('')
    setNewCategory('')
    setDueDate('')
    setPriority('medium')
    setEditMode(false)
  }

  const toggleExpandTask = (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null)
    } else {
      setExpandedTask(taskId)
    }
  }

  const updateTaskDescription = (taskId, description) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, description } : task
    ))
  }

  const cycleTheme = () => {
    const themeKeys = Object.keys(themes)
    const currentIndex = themeKeys.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themeKeys.length
    setCurrentTheme(themeKeys[nextIndex])
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-rose-500 bg-rose-500/5'
      case 'medium': return 'border-amber-500 bg-amber-500/5'
      case 'low': return 'border-emerald-500 bg-emerald-500/5'
      default: return 'border-slate-500 bg-slate-500/5'
    }
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter === 'all') return true
      if (filter === 'completed') return task.completed
      if (filter === 'active') return !task.completed
      if (filter === 'category') return task.category === newCategory
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'importance') {
        const importanceOrder = { high: 3, medium: 2, low: 1 }
        return importanceOrder[b.importance || 'medium'] - importanceOrder[a.importance || 'medium']
      }
      if (sortBy === 'urgency') {
        const urgencyOrder = { high: 3, medium: 2, low: 1 }
        return urgencyOrder[b.urgency || 'medium'] - urgencyOrder[a.urgency || 'medium']
      }
      if (sortBy === 'due') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return 0
    })

  const handleWorkspaceClick = () => {
    setShowWorkspaceSelector(prev => !prev);
    setShowThemeSelector(false); // Close theme selector when workspace selector opens
  };

  const handleThemeClick = () => {
    setShowThemeSelector(prev => !prev);
    setShowWorkspaceSelector(false); // Close workspace selector when theme selector opens
  };

  // Export tasks to JSON
  const exportTasks = () => {
    try {
      const exportData = {
        tasks: tasks,
        workspace: workspace,
        timestamp: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"})
      saveAs(blob, `taskfork-${workspace}-${new Date().toISOString().slice(0,10)}.json`)
      showTaskNotification("Tasks exported successfully")
    } catch (error) {
      console.error("Export failed:", error)
      showTaskNotification("Export failed: " + error.message)
    }
  }

  // Import tasks from JSON
  const importTasks = (event) => {
    try {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (Array.isArray(data.tasks)) {
            if (window.confirm(`Import ${data.tasks.length} tasks? This will replace your current tasks.`)) {
              setTasks(data.tasks)
              showTaskNotification(`Imported ${data.tasks.length} tasks successfully`)
            }
          } else {
            throw new Error("Invalid task data format")
          }
        } catch (parseError) {
          console.error("Parsing failed:", parseError)
          showTaskNotification("Import failed: Invalid JSON format")
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error("Import failed:", error)
      showTaskNotification("Import failed: " + error.message)
    }
    // Reset file input
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <CodeIcon />
            <h1 className="text-3xl font-semibold text-center ml-2 tracking-tight">
              <span className={theme.text}>Task</span>
              <span className={theme.highlight}>Tracker</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleWorkspaceClick} 
              className={`p-2 ${theme.card} rounded-lg hover:${theme.border.replace('border-', 'bg-')} transition-colors relative flex gap-1 items-center`}
              aria-label="Select workspace"
            >
              <WorkspaceIcon />
              <span className="text-sm font-medium capitalize hidden sm:inline">{workspace}</span>
              
              {showWorkspaceSelector && (
                <div className={`absolute top-full right-0 mt-2 w-52 ${theme.bg} border-2 ${theme.border} rounded-lg shadow-2xl z-50 backdrop-blur-lg overflow-hidden`}>
                  <div className="px-3 py-2 border-b-2 border-gray-700">
                    <h3 className="text-sm font-semibold">Workspaces</h3>
                  </div>
                  <div className="p-2">
                    {workspaces.map(ws => (
                      <button
                        key={ws}
                        onClick={() => {
                          setWorkspace(ws)
                          setShowWorkspaceSelector(false)
                        }}
                        className={`w-full text-left rounded-md px-3 py-2 text-sm flex items-center ${
                          workspace === ws 
                            ? `${theme.primary} font-medium` 
                            : `hover:bg-white/10`
                        }`}
                      >
                        <WorkspaceIcon className="mr-2 inline" />
                        {ws.charAt(0).toUpperCase() + ws.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </button>

            <button 
              onClick={handleThemeClick} 
              className={`p-2 ${theme.card} rounded-lg hover:${theme.border.replace('border-', 'bg-')} transition-colors relative`}
              aria-label="Select theme"
            >
              <ThemeIcon />
              
              {showThemeSelector && (
                <div className={`absolute top-full right-0 mt-2 w-52 ${theme.bg} border-2 ${theme.border} rounded-lg shadow-2xl z-50 backdrop-blur-lg overflow-hidden`}>
                  <div className="px-3 py-2 border-b-2 border-gray-700">
                    <h3 className="text-sm font-semibold">Select Theme</h3>
                  </div>
                  <div className="p-2">
                    {Object.entries(themes).map(([key, t]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setCurrentTheme(key)
                          setShowThemeSelector(false)
                        }}
                        className={`w-full text-left rounded-md px-3 py-2 text-sm flex items-center ${
                          currentTheme === key 
                            ? `${theme.primary} font-medium` 
                            : `hover:bg-white/10`
                        }`}
                      >
                        <ThemeIcon className="mr-2 inline" />
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </button>

            <button 
              onClick={() => setShowShortcuts(true)} 
              className={`p-2 ${theme.card} rounded-lg hover:${theme.border.replace('border-', 'bg-')} transition-colors flex gap-1 items-center`}
              aria-label="Show keyboard shortcuts"
            >
              <CommandIcon />
              <span className="text-sm font-medium hidden sm:inline">Shortcuts</span>
            </button>
          </div>
        </div>

        <div className={`${theme.card} backdrop-blur-sm rounded-xl p-6 mb-8 shadow-xl border ${theme.border}`}>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder={editMode ? "Update task..." : "What needs to be done? (Ctrl+Enter to save)"}
                className={`w-full ${theme.input} ${theme.text} px-4 py-3 rounded-lg border ${theme.focusRing} transition-all duration-200 placeholder-gray-400`}
                ref={inputRef}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`w-full ${theme.input} ${theme.text} px-4 py-3 rounded-lg border ${theme.focusRing} transition-all duration-200`}
                required
              >
                <option value="">Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full ${theme.input} ${theme.text} px-4 py-3 rounded-lg border ${theme.focusRing} transition-all duration-200`}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full ${theme.input} ${theme.text} px-4 py-3 rounded-lg border ${theme.focusRing} transition-all duration-200`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                className={`w-full ${theme.input} ${theme.text} px-4 py-3 rounded-lg border ${theme.focusRing} transition-all duration-200`}
              >
                <option value="low">Low Importance</option>
                <option value="medium">Medium Importance</option>
                <option value="high">High Importance</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className={`w-full ${theme.input} ${theme.text} px-4 py-3 rounded-lg border ${theme.focusRing} transition-all duration-200`}
              >
                <option value="low">Low Urgency</option>
                <option value="medium">Medium Urgency</option>
                <option value="high">High Urgency</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className={`flex-1 ${theme.primary} text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg`}
              >
                {editMode ? 'Update' : 'Add Task'}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className={`px-4 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all duration-200`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={`${theme.card} backdrop-blur-sm rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4 border ${theme.border}`}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`flex-1 ${theme.input} ${theme.text} px-4 py-2 rounded-lg border ${theme.focusRing} transition-all duration-200`}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
            <option value="category">By Category</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`flex-1 ${theme.input} ${theme.text} px-4 py-2 rounded-lg border ${theme.focusRing} transition-all duration-200`}
          >
            <option value="date">Sort by Date Added</option>
            <option value="priority">Sort by Priority</option>
            <option value="due">Sort by Due Date</option>
            <option value="importance">Sort by Importance</option>
            <option value="urgency">Sort by Urgency</option>
          </select>
          
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className={`flex-1 ${theme.input} ${theme.text} px-4 py-2 rounded-lg border ${theme.focusRing} transition-all duration-200`}
          >
            <option value="list">List View</option>
            <option value="matrix">Matrix View</option>
          </select>

          <div className="flex gap-2">
            <button 
              onClick={exportTasks} 
              className={`px-4 py-2 ${theme.card} rounded-lg hover:${theme.border.replace('border-', 'bg-')} transition-colors`}
              title="Export tasks as JSON"
            >
              Export
            </button>
            
            <label 
              className={`px-4 py-2 ${theme.card} rounded-lg hover:${theme.border.replace('border-', 'bg-')} transition-colors cursor-pointer`}
              title="Import tasks from JSON"
            >
              Import
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={importTasks}
                ref={ref => setFileInput(ref)}
              />
            </label>
          </div>
        </div>

        {/* Task Views */}
        {viewMode === 'list' ? (
          // List View
          <div className="space-y-3">
            {filteredAndSortedTasks.map(task => (
              <div key={task.id} className="space-y-1">
                <div
                  className={`${theme.card} backdrop-blur-sm rounded-lg p-4 flex items-center gap-4 border-l-4 ${getPriorityColor(task.priority)} transition-all duration-200 hover:bg-slate-750 border ${theme.border}`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded-md border-2 border-slate-500 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
                  />
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpandTask(task.id)}>
                    <h3 className={`text-base font-medium truncate ${
                      task.completed ? 'line-through text-slate-500' : theme.text
                    }`}>
                      {task.text}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        task.priority === 'high' ? 'bg-rose-500/10 text-rose-400' :
                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <span className="bg-slate-700/70 px-2 py-1 rounded-md text-xs text-slate-300">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className={`flex items-center gap-1 text-xs ${
                          new Date(task.dueDate) < new Date() && !task.completed 
                            ? 'text-rose-400' 
                            : 'text-slate-400'
                        }`}>
                          <CalendarIcon />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.importance && task.urgency && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          Matrix: {task.importance.charAt(0).toUpperCase()}/{task.urgency.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => editTask(task)}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors duration-200"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors duration-200"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>

                {expandedTask === task.id && (
                  <div className={`${theme.card} rounded-lg p-4 border ${theme.border} mt-1`}>
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTaskDescription(task.id, e.target.value)}
                      placeholder="Add Markdown description here... Use ```code``` for code blocks, * for lists, etc."
                      className={`w-full mb-3 ${theme.input} ${theme.text} px-4 py-2 rounded-lg border ${theme.focusRing} transition-all duration-200 h-32`}
                    />
                    {task.description && (
                      <div className={`${theme.input} rounded-lg p-4 prose prose-invert max-w-none`}>
                        <ReactMarkdown components={MarkdownComponents}>
                          {task.description}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {filteredAndSortedTasks.length === 0 && (
              <div className={`text-center py-12 ${theme.card} backdrop-blur-sm rounded-xl border ${theme.border}`}>
                <p className="text-slate-400">No tasks found</p>
                <p className="text-sm text-slate-500 mt-1">Time to add some structure to your day</p>
              </div>
            )}
          </div>
        ) : (
          // Eisenhower Matrix View
          <div className={`grid grid-cols-2 gap-4 mb-8`}>
            {/* Quadrant Headers */}
            <div className="col-span-2 grid grid-cols-2 gap-4 mb-2">
              <div className="col-start-2 text-center font-medium text-slate-300">Urgent</div>
              <div className="col-start-2 text-center font-medium text-slate-300">Not Urgent</div>
            </div>
            
            {/* Row 1: Important */}
            <div className="row-span-2 flex items-center justify-center">
              <div className="transform -rotate-90 text-slate-300 font-medium">Important</div>
            </div>
            
            {/* Q1: Important & Urgent */}
            <div className={`${theme.card} rounded-lg p-4 border-2 border-rose-500/30 min-h-[200px] max-h-[300px] overflow-y-auto`}>
              <h3 className="text-rose-400 mb-3 font-medium border-b border-rose-500/30 pb-1">Do First</h3>
              {filteredAndSortedTasks
                .filter(task => task.importance === 'high' && task.urgency === 'high' && !task.completed)
                .map(task => (
                  <div key={task.id} className="mb-2 p-2 bg-rose-500/5 rounded">
                    <div className="flex gap-2 items-start">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-4 h-4 rounded-sm border-2 border-slate-500 text-rose-500"
                      />
                      <div onClick={() => editTask(task)} className="cursor-pointer flex-1">
                        <div className="font-medium text-sm">{task.text}</div>
                        <div className="text-xs text-slate-400">{task.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Q2: Important & Not Urgent */}
            <div className={`${theme.card} rounded-lg p-4 border-2 border-blue-500/30 min-h-[200px] max-h-[300px] overflow-y-auto`}>
              <h3 className="text-blue-400 mb-3 font-medium border-b border-blue-500/30 pb-1">Schedule</h3>
              {filteredAndSortedTasks
                .filter(task => task.importance === 'high' && task.urgency === 'low' && !task.completed)
                .map(task => (
                  <div key={task.id} className="mb-2 p-2 bg-blue-500/5 rounded">
                    <div className="flex gap-2 items-start">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-4 h-4 rounded-sm border-2 border-slate-500 text-blue-500"
                      />
                      <div onClick={() => editTask(task)} className="cursor-pointer flex-1">
                        <div className="font-medium text-sm">{task.text}</div>
                        <div className="text-xs text-slate-400">{task.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Row 2: Not Important */}
            <div className="row-span-2 flex items-center justify-center">
              <div className="transform -rotate-90 text-slate-300 font-medium">Not Important</div>
            </div>
            
            {/* Q3: Not Important & Urgent */}
            <div className={`${theme.card} rounded-lg p-4 border-2 border-yellow-500/30 min-h-[200px] max-h-[300px] overflow-y-auto`}>
              <h3 className="text-yellow-400 mb-3 font-medium border-b border-yellow-500/30 pb-1">Delegate</h3>
              {filteredAndSortedTasks
                .filter(task => task.importance === 'low' && task.urgency === 'high' && !task.completed)
                .map(task => (
                  <div key={task.id} className="mb-2 p-2 bg-yellow-500/5 rounded">
                    <div className="flex gap-2 items-start">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-4 h-4 rounded-sm border-2 border-slate-500 text-yellow-500"
                      />
                      <div onClick={() => editTask(task)} className="cursor-pointer flex-1">
                        <div className="font-medium text-sm">{task.text}</div>
                        <div className="text-xs text-slate-400">{task.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Q4: Not Important & Not Urgent */}
            <div className={`${theme.card} rounded-lg p-4 border-2 border-green-500/30 min-h-[200px] max-h-[300px] overflow-y-auto`}>
              <h3 className="text-green-400 mb-3 font-medium border-b border-green-500/30 pb-1">Eliminate</h3>
              {filteredAndSortedTasks
                .filter(task => task.importance === 'low' && task.urgency === 'low' && !task.completed)
                .map(task => (
                  <div key={task.id} className="mb-2 p-2 bg-green-500/5 rounded">
                    <div className="flex gap-2 items-start">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-4 h-4 rounded-sm border-2 border-slate-500 text-green-500"
                      />
                      <div onClick={() => editTask(task)} className="cursor-pointer flex-1">
                        <div className="font-medium text-sm">{task.text}</div>
                        <div className="text-xs text-slate-400">{task.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {showNotification && (
          <div className={`