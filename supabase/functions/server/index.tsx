import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createClient } from '@supabase/supabase-js';
import * as kv from '../../../app/lib/kv_store';

const app = new Hono();

// CORS and logging middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to verify auth token
async function verifyAuth(token: string | null) {
  if (!token) return null;
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.log('Auth verification error:', error);
    return null;
  }
}

// Routes
app.get('/make-server-a2e806c9/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'rentalbiz-server'
  });
});

// User signup endpoint
app.post('/make-server-a2e806c9/signup', async (c) => {
  try {
    const { email, password, name, role, businessType } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        role, 
        business_type: businessType 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ success: false, error: error.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user_${data.user.id}`, {
      name,
      role,
      businessType,
      created_at: new Date().toISOString(),
      status: 'active'
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ success: false, error: 'Signup failed' }, 500);
  }
});

// Deposit endpoints
app.get('/make-server-a2e806c9/deposits', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const deposits = await kv.getByPrefix(`deposit_${user.id}_`);
    return c.json({ deposits });
  } catch (error) {
    console.log('Get deposits error:', error);
    return c.json({ error: 'Failed to fetch deposits' }, 500);
  }
});

app.post('/make-server-a2e806c9/deposits', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { cashAmount, qrisAmount, shift, notes } = await c.req.json();
    
    const depositId = crypto.randomUUID();
    const depositData = {
      id: depositId,
      userId: user.id,
      cashAmount: parseFloat(cashAmount) || 0,
      qrisAmount: parseFloat(qrisAmount) || 0,
      shift,
      notes: notes || '',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    await kv.set(`deposit_${user.id}_${depositId}`, depositData);

    // Update user's last deposit date for login permission
    const userData = await kv.get(`user_${user.id}`) || {};
    userData.lastDeposit = new Date().toISOString().split('T')[0];
    userData.canLogin = true;
    await kv.set(`user_${user.id}`, userData);

    return c.json({ success: true, deposit: depositData });
  } catch (error) {
    console.log('Create deposit error:', error);
    return c.json({ error: 'Failed to create deposit' }, 500);
  }
});

// Manual deposit override (owner only)
app.post('/make-server-a2e806c9/deposits/manual', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user || user.user_metadata.role !== 'owner') {
    return c.json({ error: 'Unauthorized - Owner access required' }, 401);
  }

  try {
    const { operatorId, amount, notes, date } = await c.req.json();
    
    const depositId = crypto.randomUUID();
    const depositData = {
      id: depositId,
      userId: operatorId,
      cashAmount: 0,
      qrisAmount: 0,
      manualAmount: parseFloat(amount),
      shift: 'manual',
      notes: notes || 'Manual override by owner',
      date,
      timestamp: new Date().toISOString(),
      status: 'manual_override'
    };

    await kv.set(`deposit_${operatorId}_${depositId}`, depositData);

    // Update operator's login permission
    const userData = await kv.get(`user_${operatorId}`) || {};
    userData.lastDeposit = date;
    userData.canLogin = true;
    await kv.set(`user_${operatorId}`, userData);

    return c.json({ success: true, deposit: depositData });
  } catch (error) {
    console.log('Manual deposit error:', error);
    return c.json({ error: 'Failed to create manual deposit' }, 500);
  }
});

// Expense endpoints
app.get('/make-server-a2e806c9/expenses', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const expenses = await kv.getByPrefix(`expense_${user.id}_`);
    return c.json({ expenses });
  } catch (error) {
    console.log('Get expenses error:', error);
    return c.json({ error: 'Failed to fetch expenses' }, 500);
  }
});

app.post('/make-server-a2e806c9/expenses', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { name, amount, category, dueDate, isRecurring, frequency, autoReminder, notes } = await c.req.json();
    
    const expenseId = crypto.randomUUID();
    const expenseData = {
      id: expenseId,
      userId: user.id,
      name,
      amount: parseFloat(amount),
      category,
      dueDate,
      isRecurring,
      frequency,
      autoReminder,
      notes: notes || '',
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    await kv.set(`expense_${user.id}_${expenseId}`, expenseData);

    return c.json({ success: true, expense: expenseData });
  } catch (error) {
    console.log('Create expense error:', error);
    return c.json({ error: 'Failed to create expense' }, 500);
  }
});

// Analytics endpoint
app.get('/make-server-a2e806c9/analytics', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const deposits = await kv.getByPrefix(`deposit_${user.id}_`);
    const expenses = await kv.getByPrefix(`expense_${user.id}_`);
    
    // Calculate analytics
    const totalIncome = deposits.reduce((sum: number, deposit: any) => 
      sum + (deposit.cashAmount || 0) + (deposit.qrisAmount || 0) + (deposit.manualAmount || 0), 0
    );
    
    const monthlyExpenses = expenses
      .filter((exp: any) => exp.isRecurring && exp.frequency === 'monthly')
      .reduce((sum: number, exp: any) => sum + exp.amount, 0);
    
    const analytics = {
      totalIncome,
      monthlyExpenses,
      breakEvenPoint: monthlyExpenses,
      depositsCount: deposits.length,
      expensesCount: expenses.length
    };

    return c.json({ analytics });
  } catch (error) {
    console.log('Analytics error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Operator management (owner only)
app.get('/make-server-a2e806c9/operators', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user || user.user_metadata.role !== 'owner') {
    return c.json({ error: 'Unauthorized - Owner access required' }, 401);
  }

  try {
    const users = await kv.getByPrefix('user_');
    const operators = users.filter((userData: any) => userData.role === 'operator');
    
    // Enrich with deposit data
    const enrichedOperators = await Promise.all(operators.map(async (op: any) => {
      const userKey = Object.keys(users).find(key => users[key] === op);
      const userId = userKey ? userKey.replace('user_', '') : '';
      const deposits = await kv.getByPrefix(`deposit_${userId}_`);
      
      return {
        ...op,
        id: userId,
        totalDeposits: deposits.reduce((sum: number, dep: any) => 
          sum + (dep.cashAmount || 0) + (dep.qrisAmount || 0) + (dep.manualAmount || 0), 0
        ),
        depositsCount: deposits.length
      };
    }));

    return c.json({ operators: enrichedOperators });
  } catch (error) {
    console.log('Get operators error:', error);
    return c.json({ error: 'Failed to fetch operators' }, 500);
  }
});

app.put('/make-server-a2e806c9/operators/:id', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = await verifyAuth(token);
  
  if (!user || user.user_metadata.role !== 'owner') {
    return c.json({ error: 'Unauthorized - Owner access required' }, 401);
  }

  try {
    const operatorId = c.req.param('id');
    const updates = await c.req.json();
    
    const userData = await kv.get(`user_${operatorId}`) || {};
    const updatedData = { ...userData, ...updates };
    
    await kv.set(`user_${operatorId}`, updatedData);

    return c.json({ success: true, operator: updatedData });
  } catch (error) {
    console.log('Update operator error:', error);
    return c.json({ error: 'Failed to update operator' }, 500);
  }
});

// Check login permission
app.get('/make-server-a2e806c9/check-login/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const userData = await kv.get(`user_${userId}`) || {};
    
    // Check if user made deposit yesterday or has manual override
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const canLogin = userData.lastDeposit === yesterdayStr || userData.canLogin === true;
    
    return c.json({ canLogin, lastDeposit: userData.lastDeposit });
  } catch (error) {
    console.log('Check login error:', error);
    return c.json({ error: 'Failed to check login permission' }, 500);
  }
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Start server
process.env;