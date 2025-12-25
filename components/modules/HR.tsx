
import React from 'react';
import { Employee } from '../../types';

const HR: React.FC = () => {
  const employees: Employee[] = [
    { id: 'E1', name: 'Alice Walker', department: 'Engineering', role: 'Fullstack Dev', attendance: 'Present' },
    { id: 'E2', name: 'Bob Marley', department: 'Sales', role: 'Account Manager', attendance: 'Absent' },
    { id: 'E3', name: 'Charlie Day', department: 'HR', role: 'HR Specialist', attendance: 'On Leave' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
        <button className="bg-pink-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-pink-700">Onboard Employee</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y border-t">
          {employees.map(emp => (
            <div key={emp.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-2xl font-bold text-pink-600">
                {emp.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{emp.name}</h3>
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
      </div>
    </div>
  );
};

export default HR;
