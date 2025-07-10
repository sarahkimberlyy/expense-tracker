import React from 'react';

const ExpenseList = ({ 
  expenses, 
  categories, 
  loading, 
  expenseFilters, 
  setExpenseFilters,
  pagination,
  onApplyFilters,
  onClearFilters,
  onEdit,
  onDelete,
  onPageChange,
  onPreviousPage,
  onNextPage
}) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setExpenseFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const PaginationControls = () => (
    <div className="pagination-controls">
      <div className="pagination-info">
        <span>
          Showing {expenses.length} of {pagination.totalItems} expenses
          {pagination.totalItems > 0 && (
            <> (Page {pagination.currentPage} of {pagination.totalPages})</>
          )}
        </span>
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="pagination-buttons">
          <button 
            onClick={onPreviousPage}
            disabled={pagination.currentPage === 1}
            className="btn btn-sm btn-secondary"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`btn btn-sm ${pageNum === pagination.currentPage ? 'btn-primary' : 'btn-secondary'}`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button 
            onClick={onNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="btn btn-sm btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="card">
      <h2>Expenses List</h2>
      
      {/* Filter Controls */}
      <div className="expense-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="filterCategory">Category</label>
            <select
              id="filterCategory"
              name="category"
              value={expenseFilters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filterStartDate">From Date</label>
            <input
              type="date"
              id="filterStartDate"
              name="startDate"
              value={expenseFilters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="filterEndDate">To Date</label>
            <input
              type="date"
              id="filterEndDate"
              name="endDate"
              value={expenseFilters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-actions">
            <button 
              onClick={onApplyFilters}
              className="btn btn-primary btn-sm"
            >
              Apply Filters
            </button>
            <button 
              onClick={onClearFilters}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(expenseFilters.category || expenseFilters.startDate || expenseFilters.endDate) && (
        <div className="active-filters">
          <span className="filter-label">Active Filters:</span>
          {expenseFilters.category && (
            <span className="filter-tag">
              Category: {expenseFilters.category}
            </span>
          )}
          {expenseFilters.startDate && (
            <span className="filter-tag">
              From: {new Date(expenseFilters.startDate).toLocaleDateString('id-ID')}
            </span>
          )}
          {expenseFilters.endDate && (
            <span className="filter-tag">
              To: {new Date(expenseFilters.endDate).toLocaleDateString('id-ID')}
            </span>
          )}
        </div>
      )}

      {/* Expense List Content */}
      {loading ? (
        <div className="loading">Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <p>
            {(expenseFilters.category || expenseFilters.startDate || expenseFilters.endDate) 
              ? 'No expenses found matching your filters. Try adjusting your search criteria.'
              : 'No expenses found. Add your first expense to get started!'
            }
          </p>
        </div>
      ) : (
        <div className="expense-list">
          {expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-meta">
                  <span className="expense-category">{expense.category}</span>
                  <span className="expense-date">{expense.date}</span>
                </div>
              </div>
              <div className="expense-amount">Rp{parseFloat(expense.amount).toLocaleString('id-ID')}</div>
              <div className="expense-actions">
                <button 
                  onClick={() => onEdit(expense)}
                  className="btn btn-sm btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(expense.id)}
                  className="btn btn-sm btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <PaginationControls />
        </div>
      )}
    </div>
  );
};

export default ExpenseList;