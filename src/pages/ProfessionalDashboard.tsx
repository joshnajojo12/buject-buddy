import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Calculator,
  ArrowLeft,
  Bell,
  AlertTriangle,
  CheckCircle,
  Home,
  Car,
  Zap,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { GroupExpenseSplit } from "@/components/GroupExpenseSplit";
import { WalletDisplay } from "@/components/WalletDisplay";
import { IncomeForm } from "@/components/IncomeForm";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  paid: boolean;
}

interface EMICalculation {
  principal: number;
  rate: number;
  tenure: number;
  emi: number;
}

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { balance: walletBalance, deductExpense } = useWallet();
  const [salary] = useState(85000);
  const [totalExpenses] = useState(62000);
  const [investments] = useState(15000);
  const [savings] = useState(8000);

  const [bills, setBills] = useState<Bill[]>([
    { id: '1', name: 'Electricity Bill', amount: 3200, dueDate: '2024-09-30', category: 'Utilities', paid: false },
    { id: '2', name: 'House Rent', amount: 25000, dueDate: '2024-10-01', category: 'Housing', paid: false },
    { id: '3', name: 'Car EMI', amount: 15000, dueDate: '2024-10-05', category: 'Transportation', paid: true },
    { id: '4', name: 'Insurance Premium', amount: 8500, dueDate: '2024-10-10', category: 'Insurance', paid: false }
  ]);

  const [emiCalc, setEmiCalc] = useState<EMICalculation>({
    principal: 500000,
    rate: 8.5,
    tenure: 60,
    emi: 0
  });

  const expenseData = [
    { month: 'May', expenses: 58000, income: 85000 },
    { month: 'Jun', expenses: 61000, income: 85000 },
    { month: 'Jul', expenses: 59000, income: 85000 },
    { month: 'Aug', expenses: 63000, income: 85000 },
    { month: 'Sep', expenses: 62000, income: 85000 }
  ];

  const predictionData = [
    { month: 'Oct', predicted: 64000, confidence: 85 },
    { month: 'Nov', predicted: 61000, confidence: 78 },
    { month: 'Dec', predicted: 68000, confidence: 72 }
  ];

  const categoryBreakdown = [
    { category: 'Housing', amount: 25000, color: '#00A8FF' },
    { category: 'Transportation', amount: 18000, color: '#00D2D3' },
    { category: 'Food', amount: 8000, color: '#FF9F43' },
    { category: 'Utilities', amount: 5000, color: '#05A854' },
    { category: 'Entertainment', amount: 6000, color: '#A55EEA' }
  ];

  const calculateEMI = () => {
    const { principal, rate, tenure } = emiCalc;
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    setEmiCalc({ ...emiCalc, emi: Math.round(emi) });
    toast({
      title: "EMI Calculated! ðŸ’°",
      description: `Your monthly EMI is ₹${Math.round(emi).toLocaleString()}`,
    });
  };

  const markBillPaid = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      const success = deductExpense(bill.amount, `Bill payment: ${bill.name}`);
      if (success) {
        setBills(bills.map(b => 
          b.id === billId ? { ...b, paid: true } : b
        ));
        toast({
          title: "Bill Paid! âœ…",
          description: `₹${bill.amount} paid for ${bill.name}`,
        });
      } else {
        toast({
          title: "Insufficient Balance! âŒ",
          description: "Please add money to your wallet first.",
        });
      }
    }
  };

  const savingsRate = ((salary - totalExpenses) / salary) * 100;
  const investmentRate = (investments / salary) * 100;

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
              <h1 className="text-3xl font-bold">Professional Dashboard</h1>
              <p className="text-muted-foreground">Advanced financial management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="animate-pulse">
              <Bell className="w-4 h-4 mr-1" />
              5 alerts
            </Badge>
            <Badge variant="outline">
              <Shield className="w-4 h-4 mr-1" />
              Fraud Protection Active
            </Badge>
          </div>
        </motion.div>

        {/* Group Expense Split */}
        <GroupExpenseSplit />

        {/* Wallet Display */}
        <WalletDisplay />

        {/* Income Form */}
        <IncomeForm userType="professional" />

        {/* Financial Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-glass p-6 hover-glow">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-success/20 rounded-2xl animate-glow">
                <DollarSign className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <h2 className="text-2xl font-bold">₹{salary.toLocaleString()}</h2>
                <p className="text-xs text-success">+5% from last month</p>
              </div>
            </div>
          </Card>

          <Card className="card-glass p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold text-balance-negative">₹{totalExpenses.toLocaleString()}</p>
              </div>
              <CreditCard className="w-6 h-6 text-balance-negative" />
            </div>
            <Progress value={(totalExpenses / salary) * 100} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {((totalExpenses / salary) * 100).toFixed(0)}% of salary
            </p>
          </Card>

          <Card className="card-glass p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="text-xl font-bold text-chart-primary">₹{investments.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-chart-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {investmentRate.toFixed(1)}% of salary invested
            </p>
          </Card>

          <Card className="card-glass p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <p className="text-xl font-bold text-balance-positive">{savingsRate.toFixed(1)}%</p>
              </div>
              <Badge variant={savingsRate > 20 ? "default" : "destructive"}>
                {savingsRate > 20 ? "Good" : "Low"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ₹{savings.toLocaleString()} saved this month
            </p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Income vs Expenses Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-xl font-semibold flex items-center mb-6">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Income vs Expenses Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
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
                      dataKey="income" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={3}
                      name="Income"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={3}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* EMI Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-xl font-semibold flex items-center mb-6">
                  <Calculator className="w-5 h-5 mr-2 text-primary" />
                  EMI Calculator
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="principal">Loan Amount (₹)</Label>
                    <Input
                      id="principal"
                      type="number"
                      value={emiCalc.principal}
                      onChange={(e) => setEmiCalc({...emiCalc, principal: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Interest Rate (%)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.1"
                      value={emiCalc.rate}
                      onChange={(e) => setEmiCalc({...emiCalc, rate: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenure">Tenure (months)</Label>
                    <Input
                      id="tenure"
                      type="number"
                      value={emiCalc.tenure}
                      onChange={(e) => setEmiCalc({...emiCalc, tenure: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button onClick={calculateEMI} className="w-full mb-4">
                  Calculate EMI
                </Button>

                {emiCalc.emi > 0 && (
                  <motion.div
                    className="p-4 bg-primary/10 border border-primary/20 rounded-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Monthly EMI</p>
                      <p className="text-3xl font-bold text-primary">₹{emiCalc.emi.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Total Amount: ₹{(emiCalc.emi * emiCalc.tenure).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Interest: ₹{((emiCalc.emi * emiCalc.tenure) - emiCalc.principal).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>

            {/* Expense Prediction */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-xl font-semibold flex items-center mb-6">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  AI Expense Prediction
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={predictionData}>
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
                    <Bar dataKey="predicted" fill="hsl(var(--chart-primary))" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {predictionData.map((item, index) => (
                    <div key={index} className="text-center p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm font-medium">{item.month}</p>
                      <p className="text-lg font-bold">₹{item.predicted.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.confidence}% confidence</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Bill Payments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Upcoming Bills
                </h3>
                <div className="space-y-3">
                  {bills.filter(bill => !bill.paid).map((bill) => {
                    const daysUntilDue = Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntilDue <= 3;
                    
                    return (
                      <motion.div
                        key={bill.id}
                        className={`p-3 rounded-lg border ${isUrgent ? 'bg-destructive/10 border-destructive/20' : 'bg-secondary/30 border-border/30'}`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{bill.name}</h4>
                          {isUrgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold">₹{bill.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              Due in {daysUntilDue} days
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markBillPaid(bill.id)}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Fraud Detection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-success" />
                  Fraud Detection
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Suspicious Transaction</p>
                        <p className="text-xs text-muted-foreground">
                          SMS asking for OTP detected. Do not share!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Lottery Scam Alert</p>
                        <p className="text-xs text-muted-foreground">
                          "Congratulations you won ₹50L" - This is a scam!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">All Clear</p>
                        <p className="text-xs text-muted-foreground">
                          No fraudulent activity detected in last 24h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Category Spending */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Spending by Category</h3>
                <div className="space-y-3">
                  {categoryBreakdown.map((category, index) => {
                    const percentage = (category.amount / totalExpenses) * 100;
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm">₹{category.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-secondary/30 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {percentage.toFixed(0)}% of total expenses
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;




