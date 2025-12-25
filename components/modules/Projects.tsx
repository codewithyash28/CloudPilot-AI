
import React, { useState, useEffect } from 'react';
import { Task } from '../../types';

const Projects: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', project: '', assignee: '', status: 'Todo' as const });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      // Initial empty state or default tasks for first-time use
      const initial: Task[] = [
        { id: 'T1', title: 'Setup CI/CD Pipeline', project: 'Cloud Migration', assignee: 'Jane Doe', status: 'In Progress' },
        { id: 'T2', title: 'Security hardening', project: 'Security Audit', assignee: 'John Smith', status: 'Todo' },
      ];
      setTasks(initial);
      localStorage.setItem('cloudpilot_tasks', JSON.stringify(initial));
    }
  }, []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project) return;

    const task: Task = {
      id: `T${Math.floor(Math.random() * 9000 + 1000)}`,
      title: newTask.title,
      project: newTask.project,
      assignee: newTask.assignee || 'Unassigned',
      status: newTask.status
    };

    const updated = [...tasks, task];
    setTasks(updated);
    localStorage.setItem('cloudpilot_tasks', JSON.stringify(updated));
    setShowModal(false);
    setNewTask({ title: '', project: '', assignee: '', status: 'Todo' });
  };

  const removeTask = (id: string) => {
    if (confirm('Are you sure you want to remove this task?')) {
      const updated = tasks.filter(t => t.id !== id);
      setTasks(updated);
      localStorage.setItem('cloudpilot_tasks', JSON.stringify(updated));
    }
  };

  const updateStatus = (id: string, newStatus: 'Todo' | 'In Progress' | 'Done') => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTasks(updated);
    localStorage.setItem('cloudpilot_tasks', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white">Project Pipeline</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 shadow-md transition-all active:scale-95"
        >
          + Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['Todo', 'In Progress', 'Done'] as const).map(status => (
          <div key={status} className="bg-gray-100/50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-gray-200 dark:border-zinc-700 min-h-[400px]">
            <h3 className="font-black text-gray-500 dark:text-gray-400 uppercase text-xs tracking-widest mb-6 flex justify-between items-center px-2">
              {status}
              <span className="bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full text-[10px]">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div 
                  key={task.id} 
                  className="group bg-white dark:bg-zinc-800 p-5 rounded-xl border dark:border-zinc-700 shadow-sm hover:border-orange-300 dark:hover:border-orange-900 transition-all relative"
                >
                  <button 
                    onClick={() => removeTask(task.id)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remove Task"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>

                  <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-2">{task.project}</p>
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-4 leading-tight">{task.title}</h4>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{task.assignee}</span>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {status !== 'Todo' && (
                         <button onClick={() => updateStatus(task.id, 'Todo')} className="text-[10px] bg-gray-100 dark:bg-zinc-700 p-1 rounded hover:bg-gray-200" title="Move to Todo">⏪</button>
                       )}
                       {status !== 'In Progress' && (
                         <button onClick={() => updateStatus(task.id, 'In Progress')} className="text-[10px] bg-gray-100 dark:bg-zinc-700 p-1 rounded hover:bg-gray-200" title="Move to In Progress">⏺️</button>
                       )}
                       {status !== 'Done' && (
                         <button onClick={() => updateStatus(task.id, 'Done')} className="text-[10px] bg-gray-100 dark:bg-zinc-700 p-1 rounded hover:bg-gray-200" title="Move to Done">⏩</button>
                       )}
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="py-10 text-center text-gray-400 text-xs italic border-2 border-dashed dark:border-zinc-700 rounded-xl">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">New Task Entry</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Task Title</label>
                <input 
                  required 
                  className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                  placeholder="What needs to be done?" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Project Name</label>
                <input 
                  required 
                  className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                  value={newTask.project} 
                  onChange={e => setNewTask({...newTask, project: e.target.value})} 
                  placeholder="Internal project reference" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Assignee</label>
                <input 
                  className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                  value={newTask.assignee} 
                  onChange={e => setNewTask({...newTask, assignee: e.target.value})} 
                  placeholder="Who is responsible?" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Initial Status</label>
                <select 
                  className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold" 
                  value={newTask.status} 
                  onChange={e => setNewTask({...newTask, status: e.target.value as any})}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-100 dark:shadow-none">Confirm Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
