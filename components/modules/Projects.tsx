
import React from 'react';
import { Task } from '../../types';

const Projects: React.FC = () => {
  const tasks: Task[] = [
    { id: 'T1', title: 'Setup CI/CD Pipeline', project: 'Cloud Migration', assignee: 'Jane Doe', status: 'In Progress' },
    { id: 'T2', title: 'Security hardening', project: 'Security Audit', assignee: 'John Smith', status: 'Todo' },
    { id: 'T3', title: 'Database optimization', project: 'Cloud Migration', assignee: 'Jane Doe', status: 'Done' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tasks Pipeline</h2>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-700">Create Task</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Todo', 'In Progress', 'Done'].map(status => (
          <div key={status} className="bg-gray-100/50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-4 flex justify-between items-center">
              {status}
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing hover:border-orange-200 transition-colors">
                  <p className="text-xs text-orange-600 font-bold mb-1">{task.project}</p>
                  <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[10px] bg-gray-50 text-gray-400 p-1 rounded font-mono">#{task.id}</span>
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      {task.assignee.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
