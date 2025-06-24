import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State variables for form inputs
  const [receivedCash, setReceivedCash] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [term, setTerm] = useState(''); // Term in months

  // State for monthly interest list
  const [monthlyInterestList, setMonthlyInterestList] = useState([]);

  // Simple in-memory database for client names
  const [clientNames, setClientNames] = useState(() => {
    // Load client names from localStorage if available
    const savedNames = localStorage.getItem('clientNames');
    return savedNames ? JSON.parse(savedNames) : ['John Doe', 'Jane Smith'];
  });

  // Save client names to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clientNames', JSON.stringify(clientNames));
  }, [clientNames]);

  // Add a new client name if it's not already in the list
  const addClientName = (newName) => {
    if (newName.trim() !== '' && !clientNames.includes(newName.trim())) {
      setClientNames([...clientNames, newName.trim()]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Add the current name to the client names list
    addClientName(name);

    // Basic validation
    if (!creditAmount || !term) {
      // Using a custom message box instead of alert in a real app
      // For this example, we'll keep it simple, but for production, consider a modal.
      alert('Credit Amount and Term are required.');
      return;
    }

    // Convert inputs to numbers
    const principal = parseFloat(creditAmount);
    const months = parseInt(term, 10);

    // --- Simple Interest Calculation (example, adjust as per your business logic) ---
    // Assuming an annual interest rate of 10% (0.10)
    const annualInterestRate = 0.10;
    const monthlyInterestRate = annualInterestRate / 12;

    const calculatedInterestList = [];
    let remainingBalance = principal;

    // Calculate fixed monthly payment (Principal + Total Interest) / Term
    const totalInterest = principal * annualInterestRate * (months / 12);
    const totalAmountDue = principal + totalInterest;
    const monthlyPayment = totalAmountDue / months;

    for (let i = 1; i <= months; i++) {
      // For simplicity, we'll show a fixed monthly payment and remaining balance decreasing
      // In a real lending app, this would involve more complex amortization
      const interestForMonth = principal * monthlyInterestRate; // Simple interest on original principal

      // For this simplified example, we'll just track remaining principal decreasing
      // and show the fixed monthly payment.
      remainingBalance -= (monthlyPayment - interestForMonth); // This is an approximation for principal reduction

      calculatedInterestList.push({
        month: i,
        // For a simple display, we'll show the fixed monthly payment
        monthlyPayment: monthlyPayment.toFixed(2),
        // And an approximate remaining balance
        remainingBalance: Math.max(0, remainingBalance).toFixed(2),
        interestComponent: interestForMonth.toFixed(2), // The fixed interest portion for display
      });
    }
    setMonthlyInterestList(calculatedInterestList);
  };

  // Clear form fields
  const handleClear = () => {
    setReceivedCash('');
    setName('');
    setAddress('');
    setCreditAmount('');
    setDate('');
    setDueDate('');
    setTerm('');
    setMonthlyInterestList([]);
  };

  // Handle print functionality
  const handlePrint = () => {
    // This will open the browser's print dialog, which typically includes
    // an option to 'Save as PDF'.
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter print:bg-white print:p-0">
      {/* Print-specific styles */}
      <style>
        {`
        @media print {
          /* Hide elements not needed for print */
          .print-hide {
            display: none !important;
          }

          /* Ensure full width and no shadows/backgrounds for print */
          .print-container {
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }

          /* Adjust form layout for print to be more compact */
          form {
            display: block !important; /* Make form items stack vertically */
          }

          form > div {
            margin-bottom: 0.5rem; /* Reduce space between form fields */
          }

          label {
            margin-bottom: 0 !important;
            font-size: 0.85em; /* Smaller font for labels */
          }

          input {
            border: 1px dashed #ccc !important; /* Dotted line for input fields */
            padding: 2px 5px !important;
            height: auto !important; /* Allow height to adjust */
            background-color: transparent !important;
            box-shadow: none !important;
          }

          h1, h2 {
            text-align: left !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-bottom: 5px !important;
            border-bottom: 1px solid #ccc !important; /* Lighter border for print */
            font-size: 1.5em !important; /* Adjust font size for print */
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 1rem !important;
          }

          th, td {
            border: 1px solid #ddd !important;
            padding: 8px !important;
            text-align: left !important;
            font-size: 0.8em; /* Smaller font for table content */
          }

          thead {
            background-color: #f2f2f2 !important;
          }
        }
        `}
      </style>

      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200 print-container">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 border-b-2 pb-2">
          Lending Business Application
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Form Group: Received Cash */}
          <div className="col-span-1">
            <label htmlFor="receivedCash" className="block text-sm font-medium text-gray-700 mb-1">
              RECEIVED CASH:
            </label>
            <input
              type="number"
              id="receivedCash"
              value={receivedCash}
              onChange={(e) => setReceivedCash(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 1000"
            />
          </div>

          {/* Form Group: Name */}
          <div className="col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              list="clientNamesList"
              placeholder="e.g., Jane Doe"
            />
            <datalist id="clientNamesList">
              {clientNames.map((client, index) => (
                <option key={index} value={client} />
              ))}
            </datalist>
          </div>

          {/* Form Group: Address */}
          <div className="col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address:
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 123 Main St, Anytown"
            />
          </div>

          {/* Form Group: Credit Amount */}
          <div className="col-span-1">
            <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Credit Amount:
            </label>
            <input
              type="number"
              id="creditAmount"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 5000"
            />
          </div>

          {/* Form Group: Date */}
          <div className="col-span-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Form Group: Due Date */}
          <div className="col-span-1">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date:
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Form Group: Term */}
          <div className="col-span-1">
            <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
              Term (months):
            </label>
            <input
              type="number"
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 12"
            />
          </div>

          {/* Action Buttons - These will be hidden on print */}
          <div className="col-span-2 flex justify-end space-x-4 mt-4 print-hide">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Calculate Interest
            </button>
            {monthlyInterestList.length > 0 && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                Print / Save PDF
              </button>
            )}
          </div>
        </form>

        {/* List of Monthly Interest */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b-2 pb-2">
          LIST OF MONTHLY INTEREST
        </h2>
        {monthlyInterestList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Monthly Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Interest Component
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Remaining Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyInterestList.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ₱{item.monthlyPayment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ₱{item.interestComponent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ₱{item.remainingBalance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Enter credit details and click "Calculate Interest" to see the monthly breakdown.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
