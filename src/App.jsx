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
  const [term, setTerm] = useState(''); // Term in days for new calculation

  // State for daily payment list
  const [dailyPaymentList, setDailyPaymentList] = useState([]);

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
      alert('Credit Amount and Term (in days) are required.');
      return;
    }

    // Convert inputs to numbers
    const principal = parseFloat(creditAmount);
    const totalDays = parseInt(term, 10);

    // --- NEW Lending Rule: 10% interest for the whole term (e.g., 60 days) ---
    const flatInterestRate = 0.10; // 10% for the entire term (e.g., 60 days)
    const totalInterest = principal * flatInterestRate;
    const totalAmountDue = principal + totalInterest;

    // Calculate fixed daily payment
    const dailyPayment = totalAmountDue / totalDays;
    const dailyInterestComponent = totalInterest / totalDays; // Portion of total interest per day
    const dailyPrincipalComponent = principal / totalDays; // Portion of principal per day

    const calculatedDailyPayments = [];
    let remainingPrincipal = principal;

    for (let i = 1; i <= totalDays; i++) {
      // Deduct the principal component from the remaining principal for display
      remainingPrincipal = Math.max(0, remainingPrincipal - dailyPrincipalComponent);

      calculatedDailyPayments.push({
        day: i,
        dailyPayment: dailyPayment.toFixed(2),
        interestComponent: dailyInterestComponent.toFixed(2),
        // The remaining balance here strictly reflects the principal
        remainingBalance: remainingPrincipal.toFixed(2),
      });
    }
    setDailyPaymentList(calculatedDailyPayments);
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
    setDailyPaymentList([]); // Clear daily payment list
  };

  // Handle print functionality
  const handlePrint = () => {
    // This will open the browser's print dialog, which typically includes
    // an option to 'Save as PDF'.
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4 font-inter print:bg-white print:p-0">
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

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200 print-container">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-indigo-700 mb-4 sm:mb-6 border-b-2 pb-2">
          Connie's Pautang Application
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Form Group: Received Cash */}
          <div className="col-span-full sm:col-span-1 flex flex-col">
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
          <div className="col-span-full sm:col-span-1 flex flex-col">
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
          <div className="col-span-full sm:col-span-2 flex flex-col">
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
          <div className="col-span-full sm:col-span-1 flex flex-col">
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
          <div className="col-span-full sm:col-span-1 flex flex-col">
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
          <div className="col-span-full sm:col-span-1 flex flex-col">
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

          {/* Form Group: Term (now in Days) */}
          <div className="col-span-full sm:col-span-1 flex flex-col">
            <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
              Term (days): {/* Label changed to reflect 'days' */}
            </label>
            <input
              type="number"
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 60" /* Placeholder updated */
            />
          </div>

          {/* Action Buttons - These will be hidden on print */}
          <div className="col-span-full sm:col-span-2 flex justify-end space-x-2 sm:space-x-4 mt-2 sm:mt-4 print-hide">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 sm:px-6 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Calculate Interest
            </button>
            {dailyPaymentList.length > 0 && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 sm:px-6 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                Print / Save PDF
              </button>
            )}
          </div>
        </form>

        {/* List of Daily Payments */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4 border-b-2 pb-2">
          LIST OF DAILY PAYMENTS {/* Title changed */}
        </h2>
        {dailyPaymentList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Day {/* Header changed */}
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Daily Payment {/* Header changed */}
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Interest Component
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Remaining Principal {/* Header changed */}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyPaymentList.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {item.day} {/* Data point changed */}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                      ₱{item.dailyPayment}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                      ₱{item.interestComponent}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                      ₱{item.remainingBalance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6 sm:py-8 text-sm">
            Enter credit details and click "Calculate Interest" to see the daily payment breakdown.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
