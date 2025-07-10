import React from 'react';

const ExpenseSummary = ({ 
  summary, 
  summaryDateRange, 
  setSummaryDateRange, 
  onApplyFilter, 
  onClearFilter 
}) => {
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSummaryDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilter = () => {
    if (!summaryDateRange.startDate || !summaryDateRange.endDate) {
      alert('Please select both start and end dates to filter the summary.');
      return;
    }
    onApplyFilter(summaryDateRange.startDate, summaryDateRange.endDate);
  };

  const handleClearFilter = () => {
    setSummaryDateRange({ startDate: '', endDate: '' });
    onClearFilter();
  };

  const summaryTotal = Array.isArray(summary) 
    ? summary.reduce((sum, item) => sum + parseFloat(item.total), 0)
    : 0;

  return (
    <div className="card">
      <h2>Spending Summary</h2>
      
      {/* Date Range Filter */}
      <div className="summary-filters">
        <div className="date-range-filter">
          <div className="date-input-group">
            <label htmlFor="startDate">From</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={summaryDateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="endDate">To</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={summaryDateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="filter-actions">
            <button 
              onClick={handleApplyFilter}
              className="btn btn-primary btn-sm"
              disabled={!summaryDateRange.startDate || !summaryDateRange.endDate}
            >
              Apply Filter
            </button>
            <button 
              onClick={handleClearFilter}
              className="btn btn-secondary btn-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Summary Results */}
      {summary.length === 0 ? (
        <div className="empty-state">
          <p>No spending data available for the selected period.</p>
        </div>
      ) : (
        <div className="summary-results">
          <div className="summary-header">
            <h3>
              {summaryDateRange.startDate || summaryDateRange.endDate ? (
                <>
                  Summary for {summaryDateRange.startDate && new Date(summaryDateRange.startDate).toLocaleDateString('id-ID')}
                  {summaryDateRange.startDate && summaryDateRange.endDate && ' - '}
                  {summaryDateRange.endDate && new Date(summaryDateRange.endDate).toLocaleDateString('id-ID')}
                </>
              ) : (
                'All Time Summary'
              )}
            </h3>
            <div className="summary-total">
              Total: Rp{summaryTotal.toLocaleString('id-ID')}
            </div>
          </div>
          
          <div className="summary-grid">
            {summary.map(item => (
              <div key={item.category} className="summary-item">
                <div className="summary-category">{item.category}</div>
                <div className="summary-details">
                  <div className="summary-amount">Rp{parseFloat(item.total).toLocaleString('id-ID')}</div>
                  <div className="summary-count">{item.count} transactions</div>
                  <div className="summary-percentage">{item.percentage}%</div>
                </div>
                <div className="summary-bar">
                  <div 
                    className="summary-bar-fill" 
                    style={{
                      width: `${item.percentage}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;