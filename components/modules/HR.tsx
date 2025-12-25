
import React, { useState, useEffect } from 'react';
import { Employee } from '../../types';

const HR: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', department: 'Engineering', role: '' });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    }
  }, []);

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role) return;

    const emp: Employee = {
      id: `E${Math.floor(Math.random() * 9000 + 1000)}`,
      name: newEmp.name,
      department: newEmp.department,
      role: newEmp.role,
      attendance: 'Present'
    };
    const updated = [emp, ...employees];
    setEmployees(updated);
    localStorage.setItem('cloudpilot_employees', JSON.stringify(updated));
    setShowModal(false);
    setNewEmp({ name: '', department: 'Engineering', role: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Directory</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-pink-700 transition-all active:scale-95 shadow-md"
        >
          Onboard Employee
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y dark:divide-zinc-700 border-t dark:border-zinc-700">
            {employees.map(emp => (
              <div key={emp.id} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-2xl font-bold text-pink-600">
                  {emp.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-white">{emp.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mb-2">{emp.role} • {emp.department}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    emp.attendance === 'Present' ? 'bg-green-100 text-green-700' :
                    emp.attendance === 'Absent' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {emp.attendance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center text-gray-400">No employees registered yet.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">Onboard New Talent</h3>
            <form onSubmit={handleOnboard} className="space-y-4">
              <input 
                required placeholder="Full Name"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                value={newEmp.name}
                onChange={e => setNewEmp({...newEmp, name: e.target.value})}
              />
              <input 
                required placeholder="Job Role"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                value={newEmp.role}
                onChange={e => setNewEmp({...newEmp, role: e.target.value})}
              />
              <select 
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                value={newEmp.department}
                onChange={e => setNewEmp({...newEmp, department: e.target.value})}
              >
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Human Resources</option>
                <option>Finance</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-pink-600 text-white font-black rounded-xl hover:bg-pink-700 shadow-xl shadow-pink-100 dark:shadow-none">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
