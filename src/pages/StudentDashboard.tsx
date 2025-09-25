import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Target, 
  TrendingUp, 
  Plus, 
  Bell, 
  Trophy,
  ArrowLeft,
  PieChart,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { GroupExpenseSplit } from "@/components/GroupExpenseSplit";
import { WalletDisplay } from "@/components/WalletDisplay";
import { IncomeForm } from "@/components/IncomeForm";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { balance: walletBalance, addIncome, deductExpense } = useWallet();
  const [balance, setBalance] = useState(walletBalance);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: 'Goa Trip', target: 10000, current: 3500, category: 'Travel' },
    { id: '2', name: 'New Phone', target: 15000, current: 8200, category: 'Electronics' },
    { id: '3', name: 'Emergency Fund', target: 5000, current: 2100, category: 'Savings' }
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', amount: 250, category: 'Food', date: '2024-09-24', description: 'Lunch at cafeteria' },
    { id: '2', amount: 80, category: 'Travel', date: '2024-09-24', description: 'Bus fare' },
    { id: '3', amount: 150, category: 'Fun', date: '2024-09-23', description: 'Movie tickets' }
  ]);

  const [newGoal, setNewGoal] = useState({ name: '', target: '', category: '' });
  const [newExpense, setNewExpense] = useState({ amount: '', category: 'Food', description: '' });
  const [leaderboard] = useState([
    { name: 'You', savings: 85, rank: 2 },
    { name: 'Priya S.', savings: 92, rank: 1 },
    { name: 'Rahul K.', savings: 78, rank: 3 },
    { name: 'Anita M.', savings: 71, rank: 4 }
  ]);

  const expenseData = [
    { month: 'Jul', amount: 2100 },
    { month: 'Aug', amount: 1900 },
    { month: 'Sep', amount: 2300 },
    { month: 'Oct', amount: 1800 }
  ];

  const categoryData = [
    { name: 'Food', value: 40, color: '#00A8FF' },
    { name: 'Travel', value: 25, color: '#00D2D3' },
    { name: 'Fun', value: 20, color: '#FF9F43' },
    { name: 'Study', value: 15, color: '#05A854' }
  ];

  const weeklyAllowance = 1000;
  const weeklySpent = 480;
  const spentPercentage = (weeklySpent / weeklyAllowance) * 100;

  // Sync wallet balance with local balance
  useEffect(() => {
    setBalance(walletBalance);
  }, [walletBalance]);

  const addGoal = () => {
    if (newGoal.name && newGoal.target) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        target: parseInt(newGoal.target),
        current: 0,
        category: newGoal.category || 'General'
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: '', target: '', category: '' });
      toast({
        title: "Goal Added! 🎯",
        description: `Your goal "${goal.name}" has been added successfully.`,
      });
    }
  };

  const addExpense = () => {
    if (newExpense.amount && newExpense.description) {
      const amount = parseInt(newExpense.amount);
      const success = deductExpense(amount, `${newExpense.category}: ${newExpense.description}`);
      
      if (success) {
        const expense: Expense = {
          id: Date.now().toString(),
          amount: amount,
          category: newExpense.category,
          date: new Date().toISOString().split('T')[0],
          description: newExpense.description
        };
        setExpenses([expense, ...expenses]);
        setNewExpense({ amount: '', category: 'Food', description: '' });
        toast({
          title: "Expense Added! 💸",
          description: `₹${expense.amount} spent on ${expense.category}`,
        });
      } else {
        toast({
          title: "Insufficient Balance! ❌",
          description: "Please add money to your wallet first.",
        });
      }
    }
  };

  const daysToRunOut = Math.floor(balance / (weeklySpent / 7));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-muted-foreground">Manage your finances smartly</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="animate-pulse">
              <Bell className="w-4 h-4 mr-1" />
              3 notifications
            </Badge>
          </div>
        </motion.div>

        {/* Group Expense Split */}
        <GroupExpenseSplit />

        {/* Wallet Display */}
        <WalletDisplay />

        {/* Income Form */}
        <IncomeForm userType="student" />

        {/* Balance & Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-glass p-6 col-span-2 hover-glow">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-primary/20 rounded-2xl animate-glow">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <h2 className="text-3xl font-bold text-balance-positive">₹{balance.toLocaleString()}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {daysToRunOut > 0 ? `Will last ${daysToRunOut} days` : 'Consider reducing expenses'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-glass p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">₹{weeklySpent}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-chart-secondary" />
            </div>
            <Progress value={spentPercentage} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {spentPercentage.toFixed(0)}% of weekly allowance
            </p>
          </Card>

          <Card className="card-glass p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-xl font-bold">{goals.length}</p>
              </div>
              <Target className="w-6 h-6 text-chart-tertiary" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {goals.filter(g => g.current / g.target > 0.5).length} near completion
            </p>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Savings Goals */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary" />
                    Savings Goals
                  </h3>
                  <Badge variant="outline">{goals.length} active</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  {goals.map((goal) => {
                    const progress = (goal.current / goal.target) * 100;
                    return (
                      <motion.div
                        key={goal.id}
                        className="p-4 bg-secondary/50 rounded-xl hover-lift"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{goal.name}</h4>
                          <Badge variant="secondary">{goal.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Add New Goal */}
                <div className="border-t border-border/50 pt-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label htmlFor="goalName" className="text-xs">Goal Name</Label>
                      <Input
                        id="goalName"
                        placeholder="e.g., New Laptop"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goalTarget" className="text-xs">Target Amount</Label>
                      <Input
                        id="goalTarget"
                        type="number"
                        placeholder="10000"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button onClick={addGoal} className="w-full" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Expense Tracking */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-xl font-semibold flex items-center mb-6">
                  <PieChart className="w-5 h-5 mr-2 text-primary" />
                  Expense Tracking
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Expense Chart */}
                  <div>
                    <h4 className="font-medium mb-3">Monthly Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={expenseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Breakdown */}
                  <div>
                    <h4 className="font-medium mb-3">Category Breakdown</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <RechartsPieChart data={categoryData} cx="50%" cy="50%" outerRadius={80}>
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {categoryData.map((item, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}: {item.value}%
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add Expense */}
                <div className="border-t border-border/50 pt-4">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <Label htmlFor="expenseAmount" className="text-xs">Amount</Label>
                      <Input
                        id="expenseAmount"
                        type="number"
                        placeholder="250"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expenseCategory" className="text-xs">Category</Label>
                      <select
                        id="expenseCategory"
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                        className="mt-1 w-full p-2 bg-input border border-border rounded-md text-sm"
                      >
                        <option value="Food">🍔 Food</option>
                        <option value="Travel">🚌 Travel</option>
                        <option value="Fun">🎮 Fun</option>
                        <option value="Study">📚 Study</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="expenseDesc" className="text-xs">Description</Label>
                      <Input
                        id="expenseDesc"
                        placeholder="What did you buy?"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button onClick={addExpense} className="w-full" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm">
                      🍟 You've spent 30% of your weekly allowance on snacks. Maybe cut back?
                    </p>
                  </div>
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm">
                      🏆 You saved ₹500 this week — keep it up!
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm">
                      ⏳ At current spending rate, balance will last {daysToRunOut} days.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-primary" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">College Fee Reminder</p>
                      <p className="text-xs text-muted-foreground">Due in 5 days - ₹25,000</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Scam Alert</p>
                      <p className="text-xs text-muted-foreground">Fake internship message detected. Don't pay upfront fees.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-chart-tertiary" />
                  Savings Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1 ? 'bg-chart-tertiary text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {user.rank}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{user.savings}%</p>
                        <p className="text-xs text-muted-foreground">saved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;