import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Calculator, 
  CreditCard,
  Trash2,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";

interface Member {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  paidByName: string;
}

interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export const GroupExpenseSplit = () => {
  const { transferMoney } = useWallet();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    paidBy: ""
  });
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [showSettlements, setShowSettlements] = useState(false);

  const addMember = () => {
    if (newMemberName.trim()) {
      const member: Member = {
        id: Date.now().toString(),
        name: newMemberName.trim()
      };
      setMembers([...members, member]);
      setNewMemberName("");
      toast({
        title: "Member Added! ðŸ‘¥",
        description: `${member.name} has been added to the group.`,
      });
    }
  };

  const removeMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    setExpenses(expenses.filter(e => e.paidBy !== memberId));
  };

  const addExpense = () => {
    if (newExpense.title && newExpense.amount && newExpense.paidBy) {
      const paidByMember = members.find(m => m.id === newExpense.paidBy);
      if (!paidByMember) return;

      const expense: Expense = {
        id: Date.now().toString(),
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
        paidByName: paidByMember.name
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ title: "", amount: "", paidBy: "" });
      toast({
        title: "Expense Added! ðŸ’¸",
        description: `₹${expense.amount} paid by ${expense.paidByName}`,
      });
    }
  };

  const removeExpense = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  const calculateSplit = () => {
    if (members.length === 0 || expenses.length === 0) return;

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const sharePerPerson = totalAmount / members.length;

    // Calculate what each person paid vs what they owe
    const memberBalances: { [key: string]: { name: string; paid: number; owes: number; balance: number } } = {};

    members.forEach(member => {
      memberBalances[member.id] = {
        name: member.name,
        paid: 0,
        owes: sharePerPerson,
        balance: 0
      };
    });

    // Calculate how much each person actually paid
    expenses.forEach(expense => {
      if (memberBalances[expense.paidBy]) {
        memberBalances[expense.paidBy].paid += expense.amount;
      }
    });

    // Calculate net balance (positive means they are owed money, negative means they owe money)
    Object.keys(memberBalances).forEach(memberId => {
      const member = memberBalances[memberId];
      member.balance = member.paid - member.owes;
    });

    // Create settlements
    const newSettlements: Settlement[] = [];
    const creditors = Object.entries(memberBalances).filter(([_, member]) => member.balance > 0);
    const debtors = Object.entries(memberBalances).filter(([_, member]) => member.balance < 0);

    creditors.forEach(([creditorId, creditor]) => {
      let remaining = creditor.balance;

      debtors.forEach(([debtorId, debtor]) => {
        if (remaining > 0 && debtor.balance < 0) {
          const settlementAmount = Math.min(remaining, Math.abs(debtor.balance));
          
          newSettlements.push({
            from: debtorId,
            fromName: debtor.name,
            to: creditorId,
            toName: creditor.name,
            amount: settlementAmount
          });

          remaining -= settlementAmount;
          debtor.balance += settlementAmount;
        }
      });
    });

    setSettlements(newSettlements);
    setShowSettlements(true);

    toast({
      title: "Split Calculated! ðŸ§®",
      description: `Total: ₹${totalAmount.toLocaleString()}, Share per person: ₹${sharePerPerson.toFixed(0)}`,
    });
  };

  const handlePayment = (settlement: Settlement) => {
    const success = transferMoney(settlement.amount, `Group expense payment to ${settlement.toName}`);
    if (success) {
      toast({
        title: "Payment Processed! ðŸ’°",
        description: `₹${settlement.amount} sent to ${settlement.toName}`,
      });
      // In a real app, this would update the settlement status
    } else {
      toast({
        title: "Insufficient Balance! âŒ",
        description: "Please add money to your wallet first.",
      });
    }
  };

  const generateUPILink = (settlement: Settlement) => {
    // Demo UPI link - in real app, this would be actual UPI payment
    return `upi://pay?pa=demo@upi&pn=${encodeURIComponent(settlement.toName)}&am=${settlement.amount}&cu=INR&tn=${encodeURIComponent(`Group expense payment`)}`;
  };

  const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const sharePerPerson = members.length > 0 ? totalExpenseAmount / members.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="card-glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary" />
            Group Expense Split
          </h3>
          <Badge variant="outline">{members.length} members</Badge>
        </div>

        {/* Group Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="groupName">Group/Trip Name</Label>
            <Input
              id="groupName"
              placeholder="e.g., Goa Trip, Office Party"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newMember">Add Member</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="newMember"
                placeholder="Member name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMember()}
              />
              <Button onClick={addMember} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Members List */}
        {members.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Members ({members.length})</h4>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  className="flex items-center space-x-2 bg-secondary/50 rounded-full px-3 py-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm">{member.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                    className="h-5 w-5 p-0 hover:bg-destructive/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Add Expense */}
        {members.length > 0 && (
          <div className="border-t border-border/50 pt-6 mb-6">
            <h4 className="font-medium mb-3">Add Expense</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="expenseTitle" className="text-xs">Title</Label>
                <Input
                  id="expenseTitle"
                  placeholder="Dinner, Travel, etc."
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expenseAmount" className="text-xs">Amount</Label>
                <Input
                  id="expenseAmount"
                  type="number"
                  placeholder="500"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paidBy" className="text-xs">Paid By</Label>
                <select
                  id="paidBy"
                  value={newExpense.paidBy}
                  onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                  className="mt-1 w-full p-2 bg-input border border-border rounded-md text-sm"
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={addExpense} className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List */}
        {expenses.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Expenses</h4>
              <div className="text-sm text-muted-foreground">
                Total: ₹{totalExpenseAmount.toLocaleString()} | Per person: ₹{sharePerPerson.toFixed(0)}
              </div>
            </div>
            <div className="space-y-2">
              {expenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-medium text-sm">{expense.title}</p>
                    <p className="text-xs text-muted-foreground">Paid by {expense.paidByName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">₹{expense.amount}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpense(expense.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Calculate Split Button */}
        {expenses.length > 0 && members.length > 0 && (
          <div className="border-t border-border/50 pt-4">
            <Button onClick={calculateSplit} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Split
            </Button>
          </div>
        )}

        {/* Settlements */}
        {showSettlements && settlements.length > 0 && (
          <motion.div
            className="border-t border-border/50 pt-6 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4 className="font-medium mb-4">Who Owes Whom</h4>
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-medium text-sm">
                      <span className="text-primary">{settlement.fromName}</span> owes{" "}
                      <span className="text-primary">{settlement.toName}</span>
                    </p>
                    <p className="text-2xl font-bold">₹{settlement.amount.toFixed(0)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handlePayment(settlement)}
                      className="flex items-center"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Pay from Wallet
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(generateUPILink(settlement), '_blank')}
                      className="flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Pay via UPI
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};




