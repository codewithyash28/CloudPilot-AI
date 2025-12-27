
import React, { useState, useEffect } from 'react';
import { Task } from '../../types';

const Projects: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    project: '', 
    assignee: '', 
    status: 'Todo' as const,
    priority: 'Medium' as const,
    dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem('cloudpilot_tasks', JSON.stringify(updated));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project) return;

    const task: Task = {
      id: `T${Math.floor(Math.random() * 9000 + 1000)}`,
      title: newTask.title,
      project: newTask.project,
      assignee: newTask.assignee || 'Unassigned',
      status: newTask.status,
      priority: newTask.priority,
      dueDate: newTask.dueDate
    };

    saveTasks([...tasks, task]);
    setShowModal(false);
    setNewTask({ title: '', project: '', assignee: '', status: 'Todo', priority: 'Medium', dueDate: new Date().toISOString().split('T')[0] });
  };

  const removeTask = (id: string) => {
    if (confirm('Permanently delete this task?')) {
      saveTasks(tasks.filter(t => t.id !== id));
    }
  };

  const updateStatus = (id: string, newStatus: Task['status']) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Project Hub</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Task Prioritization & Deadlines</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-700 shadow-xl shadow-orange-100 dark:shadow-none transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          + Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['Todo', 'In Progress', 'Done'] as const).map(status => (
          <div key={status} className="bg-slate-50/50 dark:bg-zinc-800/50 rounded-[2.5rem] p-6 border border-slate-100 dark:border-zinc-700 min-h-[500px] flex flex-col">
            <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-8 flex justify-between items-center px-2">
              {status}
              <span className="bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border dark:border-zinc-700">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div className="space-y-4 flex-1">
              {tasks.filter(t => t.status === status).map(task => (
                <div 
                  key={task.id} 
                  className="group bg-white dark:bg-zinc-800 p-6 rounded-[1.5rem] border dark:border-zinc-700 shadow-sm hover:border-orange-200 transition-all relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                      task.priority === 'High' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-rose-500 transition-colors">×</button>
                  </div>

                  <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-1">{task.project}</p>
                  <h4 className="font-black text-gray-800 dark:text-white text-sm mb-6 leading-tight">{task.title}</h4>
                  
                  <div className="flex justify-between items-end mt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-black uppercase border dark:border-zinc-700">{task.assignee[0]}</div>
                         <span className="text-[10px] text-gray-400 font-bold">{task.assignee}</span>
                      </div>
                      <p className="text-[9px] text-gray-300 font-black uppercase">Due: {task.dueDate}</p>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {status !== 'Todo' && (
                         <button onClick={() => updateStatus(task.id, 'Todo')} className="p-1.5 bg-slate-50 dark:bg-zinc-700 rounded-lg text-xs" title="Todo">⏪</button>
                       )}
                       {status !== 'In Progress' && (
                         <button onClick={() => updateStatus(task.id, 'In Progress')} className="p-1.5 bg-slate-50 dark:bg-zinc-700 rounded-lg text-xs" title="Work">⏺️</button>
                       )}
                       {status !== 'Done' && (
                         <button onClick={() => updateStatus(task.id, 'Done')} className="p-1.5 bg-slate-50 dark:bg-zinc-700 rounded-lg text-xs" title="Done">⏩</button>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-3xl font-black mb-8 text-gray-800 dark:text-white tracking-tighter">New Task Entry</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input required className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="What needs to be done?" />
              <input required className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} placeholder="Project Reference" />
              <input className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} placeholder="Assignee" />
              <div className="grid grid-cols-2 gap-4">
                <select className="p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <input type="date" className="p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold text-sm" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-black uppercase hover:bg-slate-100 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
