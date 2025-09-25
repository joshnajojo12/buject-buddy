import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";

interface IncomeFormProps {
  userType: 'student' | 'professional';
}

export const IncomeForm = ({ userType }: IncomeFormProps) => {
  const { addIncome } = useWallet();
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeSource, setIncomeSource] = useState("");

  const handleAddIncome = () => {
    if (incomeAmount && incomeSource) {
      const amount = parseInt(incomeAmount);
      addIncome(amount, incomeSource);
      setIncomeAmount("");
      setIncomeSource("");
      toast({
        title: "Income Added! 💰",
        description: `₹${amount.toLocaleString()} added from ${incomeSource}`,
      });
    }
  };

  const placeholderSources = userType === 'student' 
    ? "Pocket money, Part-time job, Freelance work"
    : "Salary, Freelance, Investment returns";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="card-glass p-4">
        <h4 className="font-medium mb-3 flex items-center text-sm">
          <DollarSign className="w-4 h-4 mr-2 text-success" />
          Add Income to Wallet
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="incomeAmount" className="text-xs">Amount</Label>
            <Input
              id="incomeAmount"
              type="number"
              placeholder="5000"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="incomeSource" className="text-xs">Source</Label>
            <Input
              id="incomeSource"
              placeholder={placeholderSources}
              value={incomeSource}
              onChange={(e) => setIncomeSource(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddIncome} className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Income
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};