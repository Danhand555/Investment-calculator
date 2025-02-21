import React, { useState, useEffect } from 'react';
import { Calculator, PlusCircle, Trash2, RefreshCw, DollarSign } from 'lucide-react';

const InvestmentCalculator = () => {
  const [rows, setRows] = useState([
    { id: 1, date: '', pricePerUnit: '', quantity: '', totalPrice: 0 },
    { id: 2, date: '', pricePerUnit: '', quantity: '', totalPrice: 0 }
  ]);
  
  const [totalValue, setTotalValue] = useState({ totalUnits: 0, totalInvestment: 0, averageCostPerUnit: 0 });
  const [language, setLanguage] = useState('th');
  
  const translations = {
    en: {
      title: "Investment Average Cost Calculator",
      date: "Date",
      pricePerUnit: "Price Per Unit",
      quantity: "Quantity",
      totalPrice: "Total Price",
      totalUnits: "Total Units",
      totalInvestment: "Total Investment",
      averageCost: "Average Cost Per Unit",
      calculate: "Calculate",
      reset: "Reset",
      addRow: "Add Row",
      deleteRow: "Delete",
      currency: "$"
    },
    th: {
      title: "เว็บคำนวณค่าเฉลี่ยต้นทุนการลงทุน",
      date: "วันที่",
      pricePerUnit: "ราคาต่อหน่วย",
      quantity: "จำนวน",
      totalPrice: "ราคารวม",
      totalUnits: "จำนวนหน่วยรวม",
      totalInvestment: "มูลค่ารวม",
      averageCost: "ค่าเฉลี่ยต่อหน่วย",
      calculate: "คำนวณ",
      reset: "รีเซ็ต",
      addRow: "เพิ่มแถว",
      deleteRow: "ลบ",
      currency: "฿"
    }
  };
  
  const t = translations[language];
  
  useEffect(() => {
    calculateTotals();
  }, [rows]);
  
  const calculateTotals = () => {
    const validRows = rows.filter(row => 
      row.quantity !== '' && 
      parseFloat(row.quantity) > 0 && 
      row.pricePerUnit !== '' && 
      parseFloat(row.pricePerUnit) > 0
    );
    
    const totalUnits = validRows.reduce((sum, row) => sum + parseFloat(row.quantity), 0);
    const totalInvestment = validRows.reduce((sum, row) => sum + row.totalPrice, 0);
    const averageCostPerUnit = totalUnits > 0 ? 
      (totalInvestment / totalUnits).toFixed(2) : 0;
    
    setTotalValue({ totalUnits, totalInvestment, averageCostPerUnit });
  };
  
  const handleCalculate = () => {
    calculateTotals();
  };
  
  const handleReset = () => {
    setRows([
      { id: 1, date: '', pricePerUnit: '', quantity: '', totalPrice: 0 },
      { id: 2, date: '', pricePerUnit: '', quantity: '', totalPrice: 0 }
    ]);
  };
  
  const addRow = () => {
    const newId = Math.max(...rows.map(row => row.id)) + 1;
    setRows([...rows, { id: newId, date: '', pricePerUnit: '', quantity: '', totalPrice: 0 }]);
  };
  
  const deleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };
  
  const updateRow = (id, field, value) => {
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-calculate total price when price or quantity changes
        if (field === 'pricePerUnit' || field === 'quantity') {
          const price = field === 'pricePerUnit' ? value : row.pricePerUnit;
          const quantity = field === 'quantity' ? value : row.quantity;
          
          // Calculate total price only if both values are numbers
          if (price !== '' && quantity !== '') {
            updatedRow.totalPrice = (parseFloat(price) * parseFloat(quantity));
          } else {
            updatedRow.totalPrice = 0;
          }
        }
        
        return updatedRow;
      }
      return row;
    });
    
    setRows(updatedRows);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center">
            <Calculator className="mr-3 h-8 w-8 text-yellow-300" />
            {t.title}
          </h1>
          <p className="mt-2 text-blue-200">คำนวณต้นทุนเฉลี่ยได้อย่างง่ายดาย</p>
        </div>
        
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-indigo-100">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
                  <th className="px-4 py-3 text-left w-12">#</th>
                  <th className="px-4 py-3 text-left">{t.date}</th>
                  <th className="px-4 py-3 text-right">{t.pricePerUnit}</th>
                  <th className="px-4 py-3 text-right">{t.quantity}</th>
                  <th className="px-4 py-3 text-right">{t.totalPrice}</th>
                  <th className="px-4 py-3 text-center w-16"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <input
                        type="date"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={row.date}
                        onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-end">
                        <span className="text-gray-500 mr-1">{t.currency}</span>
                        <input
                          type="number"
                          className="w-24 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          min="0"
                          step="0.01"
                          value={row.pricePerUnit}
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : parseFloat(e.target.value) || 0;
                            updateRow(row.id, 'pricePerUnit', value);
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <input
                        type="number"
                        className="w-24 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        min="0"
                        value={row.quantity}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : parseFloat(e.target.value) || 0;
                          updateRow(row.id, 'quantity', value);
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-end">
                        <span className="text-gray-500 mr-1">{t.currency}</span>
                        <span className="font-medium text-gray-900">
                          {row.totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-center">
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        title={t.deleteRow}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Add Row Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={addRow}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <PlusCircle className="h-5 w-5 mr-1" />
              <span>{t.addRow}</span>
            </button>
          </div>
          
          {/* Results Section */}
          <div className="px-6 py-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-t-2 border-indigo-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-indigo-100 transform hover:scale-105 transition-transform duration-300">
                <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-semibold">{t.totalUnits}</span>
                </div>
                <div className="text-2xl font-bold text-indigo-800 text-center mt-2">
                  {totalValue.totalUnits.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-indigo-100 transform hover:scale-105 transition-transform duration-300">
                <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{t.totalInvestment}</span>
                </div>
                <div className="text-2xl font-bold text-indigo-800 flex items-center justify-center mt-2">
                  <span className="text-lg mr-1">{t.currency}</span>
                  {totalValue.totalInvestment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
              </div>
              
              <div className="bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-green-100 transform hover:scale-105 transition-transform duration-300">
                <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">{t.averageCost}</span>
                </div>
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center mt-2">
                  <span className="text-lg mr-1">{t.currency}</span>
                  {Number(totalValue.averageCostPerUnit).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="px-6 py-4 flex justify-between border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center transform hover:scale-105 transition-all duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              {t.reset}
            </button>
            
            <button
              onClick={handleCalculate}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center transform hover:scale-105 transition-all duration-200"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              {t.calculate}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-blue-200 text-sm">
          © 2025 ThaiInvest | เครื่องมือคำนวณการลงทุนมืออาชีพ
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
