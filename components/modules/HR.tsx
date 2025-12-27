
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
    saveEmployees(employees.map(emp => {
      if (emp.id === id) {
        const nextIndex = (cycles.indexOf(emp.attendance) + 1) % cycles.length;
        return { ...emp, attendance: cycles[nextIndex] };
      }
      return emp;
    }));
  };

  const toggleEmploymentStatus = (id: string) => {
    saveEmployees(employees.map(emp => {
      if (emp.id === id) {
        return { ...emp, employmentStatus: emp.employmentStatus === 'Leaving' ? 'Active' : 'Leaving' };
      }
      return emp;
    }));
  };

  const deleteEmployee = (id: string) => {
    if (confirm('Permanently remove this employee from workspace?')) {
      saveEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Fleet Directory</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Workforce Distribution & Attendance</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-pink-700 shadow-xl shadow-pink-100 dark:shadow-none transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          + Onboard Employee
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-8 rounded-[2.5rem] border dark:border-zinc-700 shadow-sm">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Departmental Snapshot</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {['Engineering', 'Sales', 'Marketing', 'Human Resources', 'Executive'].map(dept => {
            const count = deptCounts[dept] || 0;
            const percentage = employees.length > 0 ? (count / employees.length) * 100 : 0;
            return (
              <div key={dept} className="min-w-[140px] space-y-3">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-gray-500 uppercase truncate pr-2">{dept}</p>
                   <p className="font-black text-gray-800 dark:text-white">{count}</p>
                </div>
                <div className="h-1.5 w-full bg-slate-50 dark:bg-zinc-900 rounded-full overflow-hidden">
                   <div className="h-full bg-pink-500 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y dark:divide-zinc-700 border-t dark:border-zinc-700">
            {employees.map(emp => (
              <div key={emp.id} className="p-8 hover:bg-slate-50 dark:hover:bg-zinc-700/30 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-3xl font-black text-pink-600 border border-pink-200 shadow-sm">
                    {emp.name[0]}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => toggleAttendance(emp.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                        emp.attendance === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        emp.attendance === 'Absent' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}
                    >
                      {emp.attendance}
                    </button>
                    <button 
                      onClick={() => toggleEmploymentStatus(emp.id)}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                        emp.employmentStatus === 'Leaving' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-100 dark:bg-zinc-900 text-gray-400'
                      }`}
                    >
                      {emp.employmentStatus || 'Active'}
                    </button>
                  </div>
                </div>
                
                <h3 className="font-black text-gray-800 dark:text-white text-xl">{emp.name}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{emp.role}</p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                   <p className="text-xs text-pink-600 font-black uppercase tracking-widest">{emp.department}</p>
                </div>

                <div className="mt-8 pt-4 border-t dark:border-zinc-700 flex justify-between items-center">
                  <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Employee ID: {emp.id}</span>
                  <button onClick={() => deleteEmployee(emp.id)} className="text-gray-300 hover:text-rose-500 transition-colors font-black text-[10px] uppercase">Terminate</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-32 text-center text-gray-400 italic">No team members onboarded.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-3xl font-black mb-8 text-gray-800 dark:text-white tracking-tighter text-center">Hire Talent</h3>
            <form onSubmit={handleOnboard} className="space-y-5">
              <input required placeholder="Full Name" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
              <input required placeholder="Job Role" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} />
              <select className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})}>
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Human Resources</option>
                <option>Executive</option>
              </select>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-400 font-black uppercase hover:bg-slate-100 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-pink-600 text-white font-black rounded-2xl hover:bg-pink-700 shadow-xl transition-all">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
