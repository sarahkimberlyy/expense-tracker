import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import DeleteModal from './components/DeleteModal';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState([]);
  const [allExpensesTotal, setAllExpensesTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // Date range filter for summary
  const [summaryDateRange, setSummaryDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Filter state for expenses list
  const [expenseFilters, setExpenseFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch data on mount
  useEffect(() => {
    fetchExpenses(1, 5);
    fetchCategories();
    fetchSummary();
    fetchTotalExpenses();
  }, []);

  // API Functions
  const fetchExpenses = async (page = 1, limit = 5, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      const response = await fetch(`/api/expenses?${params.toString()}`);
      const data = await response.json();
      
      setExpenses(data.expenses || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      const total = Array.isArray(data.expenses) 
        ? data.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
        : 0;
      setAllExpensesTotal(total);
    } catch (error) {
      console.error('Error fetching total expenses:', error);
      setAllExpensesTotal(0);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSummary = async (startDate = '', endDate = '') => {
    try {
      let url = '/api/expenses/summary';
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSummary(data);
      } else {
        console.error('Summary data is not an array:', data);
        setSummary([]);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary([]);
    }
  };

  // Event Handlers
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const method = editingExpense ? 'PUT' : 'POST';
      const url = editingExpense
        ? `/api/expenses/${editingExpense.id}`
        : '/api/expenses';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setFormData({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });

      setEditingExpense(null);
      await fetchExpenses(1, 5, expenseFilters);
      await fetchSummary(summaryDateRange.startDate, summaryDateRange.endDate);
      setActiveTab('list');
      fetchTotalExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      date: expense.date
    });
    fetchTotalExpenses();
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    const expense = expenses.find(e => e.id === id);
    setExpenseToDelete(expense);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await fetch(`/api/expenses/${expenseToDelete.id}`, {
          method: 'DELETE'
        });
        
        let pageToFetch = pagination.currentPage;
        if (expenses.length === 1 && pagination.currentPage > 1) {
          pageToFetch = pagination.currentPage - 1;
        }
        
        await fetchExpenses(pageToFetch, 5, expenseFilters);
        await fetchSummary(summaryDateRange.startDate, summaryDateRange.endDate);
        fetchTotalExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
    setShowDeleteConfirm(false);
    setExpenseToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setExpenseToDelete(null);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchExpenses(newPage, 5, expenseFilters);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  // Filter handlers
  const applyExpenseFilters = () => {
    fetchExpenses(1, 5, expenseFilters);
  };

  const clearExpenseFilters = () => {
    setExpenseFilters({
      category: '',
      startDate: '',
      endDate: ''
    });
    fetchExpenses(1, 5, {});
  };

  // Summary filter handlers
  const applySummaryFilter = (startDate, endDate) => {
    fetchSummary(startDate, endDate);
  };

  const clearSummaryFilter = () => {
    fetchSummary();
  };

  const totalExpenses = allExpensesTotal;

  return (
    <div className="app">
      <header className="header">
        <h1>Personal Expense Tracker</h1>
        <div className="total-amount">
          Total Spent: <span className="amount">Rp{totalExpenses.toLocaleString('id-ID')}</span>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={`tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          {editingExpense ? 'Edit Expense' : 'Add Expense'}
        </button>
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Expenses List
        </button>
        <button 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'add' && (
          <ExpenseForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === 'list' && (
          <ExpenseList
            expenses={expenses}
            categories={categories}
            loading={loading}
            expenseFilters={expenseFilters}
            setExpenseFilters={setExpenseFilters}
            pagination={pagination}
            onApplyFilters={applyExpenseFilters}
            onClearFilters={clearExpenseFilters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        )}

        {activeTab === 'summary' && (
          <ExpenseSummary
            summary={summary}
            summaryDateRange={summaryDateRange}
            setSummaryDateRange={setSummaryDateRange}
            onApplyFilter={applySummaryFilter}
            onClearFilter={clearSummaryFilter}
          />
        )}
      </main>

      <DeleteModal
        isOpen={showDeleteConfirm}
        expenseToDelete={expenseToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default App;