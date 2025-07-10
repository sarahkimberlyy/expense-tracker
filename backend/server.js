// server.js
const express = require('express');
const cors = require('cors');
const { Op } = require('sequelize');

const sequelize = require('./db');
const Expense = require('./models/Expense');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend:3000'],
  credentials: true
}));
app.use(express.json());

// Utilities
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Validation middleware
const validateExpense = (req, res, next) => {
  const { amount, description, category, date } = req.body;
  if (!amount || !description || !category || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (description.trim().length === 0) {
    return res.status(400).json({ error: 'Description cannot be empty' });
  }
  next();
};

// Routes
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'OK', database: 'Connected' });
  } catch {
    res.status(503).json({ status: 'Error', database: 'Disconnected' });
  }
});

app.get('/api/expenses', asyncHandler(async (req, res) => {
  const { page = 1, limit = 100, category, startDate, endDate } = req.query;
  const offset = (page - 1) * limit;
  const where = {};
  
  if (category && category !== 'all') where.category = category;
  if (startDate) where.date = { ...where.date, [Op.gte]: startDate }; // FIXED: Use Op instead of sequelize.Op
  if (endDate) where.date = { ...where.date, [Op.lte]: endDate }; // FIXED: Use Op instead of sequelize.Op

  const { count, rows } = await Expense.findAndCountAll({
    where, 
    limit: parseInt(limit), 
    offset, 
    order: [['date', 'DESC'], ['createdAt', 'DESC']]
  });

  res.json({
    expenses: rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count
    }
  });
}));

app.post('/api/expenses', validateExpense, asyncHandler(async (req, res) => {
  const { amount, description, category, date } = req.body;
  const expense = await Expense.create({ amount, description, category, date });
  res.status(201).json(expense);
}));

app.put('/api/expenses/:id', validateExpense, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findByPk(id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  await expense.update(req.body);
  res.json(expense);
}));

app.delete('/api/expenses/:id', asyncHandler(async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  await expense.destroy();
  res.json({ message: 'Expense deleted', id: expense.id });
}));

app.get('/api/categories', (req, res) => {
  res.json([
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education',
    'Travel', 'Personal Care', 'Other'
  ]);
});

// Enhanced Summary by category with better date filtering
app.get('/api/expenses/summary', asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const where = {};
  
  // Build date filter conditions - FIXED: Use Op instead of sequelize.Op
  if (startDate && endDate) {
    where.date = {
      [Op.between]: [startDate, endDate]
    };
  } else if (startDate) {
    where.date = {
      [Op.gte]: startDate
    };
  } else if (endDate) {
    where.date = {
      [Op.lte]: endDate
    };
  }

  const summary = await Expense.findAll({
    where,
    attributes: [
      'category',
      [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['category'],
    order: [[sequelize.literal('total'), 'DESC']]
  });

  // Return empty array if no data found
  if (!summary || summary.length === 0) {
    return res.json([]);
  }

  // Calculate total for percentage calculation
  const totalSpent = summary.reduce((sum, item) => sum + parseFloat(item.dataValues.total), 0);

  const summaryWithPercentage = summary.map(item => ({
    category: item.category,
    total: parseFloat(item.dataValues.total).toFixed(2),
    count: parseInt(item.dataValues.count),
    percentage: totalSpent > 0 
      ? ((parseFloat(item.dataValues.total) / totalSpent) * 100).toFixed(1)
      : '0.0'
  }));

  // Add debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Summary query filters:', { startDate, endDate });
    console.log('Summary results:', summaryWithPercentage);
  }

  res.json(summaryWithPercentage);
}));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation Error', details: err.errors.map(e => e.message) });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

const startServer = async () => {
  const MAX_RETRIES = 10;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await sequelize.authenticate();
      console.log('DB connected');
      await sequelize.sync();
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server ready at http://localhost:${PORT}`);
      });
      return;
    } catch (err) {
      console.error(`Failed to connect to DB (attempt ${retries + 1}):`, err.message);
      retries++;
      await new Promise(res => setTimeout(res, 3000)); // wait 3s
    }
  }

  console.error('Exceeded max retries. Exiting.');
  process.exit(1);
};

startServer();