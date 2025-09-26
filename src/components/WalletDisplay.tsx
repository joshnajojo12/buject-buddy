import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

export const WalletDisplay = () => {
  const { balance, transactions } = useWallet();
  
  const recentTransactions = transactions.slice(0, 5);
  const todayTransactions = transactions.filter(t => 
    new Date(t.timestamp).toDateString() === new Date().toDateString()
  );
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayExpenses = todayTransactions
    .filter(t => t.type === 'expense' || t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="card-glass p-6 hover-glow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-primary" />
            Digital Wallet
          </h3>
          <Badge variant="outline" className="animate-pulse">Live Balance</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
              <h2 className="text-4xl font-bold text-balance-positive mb-4">
                ₹{balance.toLocaleString()}
              </h2>
              <div className="flex justify-center md:justify-start space-x-4">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-success mr-1" />
                  <span className="text-success">+₹{todayIncome.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-1">today</span>
                </div>
                <div className="flex items-center text-sm">
                  <ArrowDownRight className="w-4 h-4 text-destructive mr-1" />
                  <span className="text-destructive">-₹{todayExpenses.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-1">today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-1">
            <h4 className="font-medium mb-3 text-sm">Recent Transactions</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span className="truncate max-w-20">{transaction.description}</span>
                    </div>
                    <span className={`font-medium ${
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};




