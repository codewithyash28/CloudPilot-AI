
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

  const saveEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    localStorage.setItem('cloudpilot_employees', JSON.stringify(updated));
  };

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role) return;

    const emp: Employee = {
      id: `E${Math.floor(Math.random() * 9000 + 1000)}`,
      name: newEmp.name,
      department: newEmp.department,
      role: newEmp.role,
      attendance: 'Present',
      employmentStatus: 'Active'
    };
    saveEmployees([emp, ...employees]);
    setShowModal(false);
    setNewEmp({ name: '', department: 'Engineering', role: '' });
  };

  const toggleAttendance = (id: string) => {
    const cycles: ('Present' | 'Absent' | 'On Leave')[] = ['Present', 'Absent', 'On Leave'];
    const updated = employees.map(emp => {
      if (emp.id === id) {
        const nextIndex = (cycles.indexOf(emp.attendance) + 1) % cycles.length;
        return { ...emp, attendance: cycles[nextIndex] };
      }
      return emp;
    });
    saveEmployees(updated);
  };

  const toggleEmploymentStatus = (id: string) => {
    const updated = employees.map(emp => {
      if (emp.id === id) {
        return { ...emp, employmentStatus: emp.employmentStatus === 'Leaving' ? 'Active' : 'Leaving' };
      }
      return emp;
    });
    saveEmployees(updated);
  };

  const deleteEmployee = (id: string) => {
    if (confirm('Fired or Quit: Permanently remove this employee from workspace?')) {
      saveEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">Fleet Directory</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">HR Management & Lifecycle</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-pink-700 transition-all active:scale-95 shadow-lg shadow-pink-100 dark:shadow-none"
        >
          + Onboard Employee
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y dark:divide-zinc-700 border-t dark:border-zinc-700">
            {employees.map(emp => (
              <div key={emp.id} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-2xl font-bold text-pink-600 border border-pink-200 dark:border-pink-800 shadow-sm">
                    {emp.name[0]}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button 
                      onClick={() => toggleAttendance(emp.id)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                        emp.attendance === 'Present' ? 'bg-green-50 text-green-700 border-green-100' :
                        emp.attendance === 'Absent' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                      title="Toggle Daily Attendance"
                    >
                      {emp.attendance}
                    </button>
                    <button 
                      onClick={() => toggleEmploymentStatus(emp.id)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                        emp.employmentStatus === 'Leaving' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500 border-slate-200 dark:border-zinc-700'
                      }`}
                      title="Mark as Active or Leaving"
                    >
                      {emp.employmentStatus || 'Active'}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 dark:text-white text-lg">{emp.name}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{emp.role}</p>
                  <p className="text-xs text-indigo-500 font-bold mt-1">{emp.department}</p>
                </div>

                <div className="mt-6 pt-4 border-t dark:border-zinc-700 flex justify-between items-center">
                  <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">ID: {emp.id}</span>
                  <button 
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 font-black text-sm"
                    title="Fire/Remove Employee"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-32 text-center">
            <div className="text-6xl mb-4">👋</div>
            <p className="text-gray-400 font-bold italic">Fleet is empty.</p>
            <p className="text-sm text-gray-300">Onboard your first team member above.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">Hire Talent</h3>
            <form onSubmit={handleOnboard} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                <input required placeholder="Enter name..." className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-pink-500" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Job Role</label>
                <input required placeholder="Lead Developer" className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-pink-500" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Department</label>
                <select className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl outline-none font-bold" value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})}>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Human Resources</option>
                  <option>Executive</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-pink-600 text-white font-black rounded-2xl hover:bg-pink-700 shadow-xl shadow-pink-100">Confirm Hire</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
