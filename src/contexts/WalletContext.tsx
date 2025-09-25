import React, { createContext, useContext, useState, useCallback } from 'react';

interface WalletContextType {
  balance: number;
  addIncome: (amount: number, description: string) => void;
  deductExpense: (amount: number, description: string) => boolean;
  transferMoney: (amount: number, description: string) => boolean;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  timestamp: Date;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(100000); // Starting balance ₹1,00,000
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = useCallback((type: Transaction['type'], amount: number, description: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      description,
      timestamp: new Date()
    };
    setTransactions(prev => [transaction, ...prev]);
  }, []);

  const addIncome = useCallback((amount: number, description: string) => {
    setBalance(prev => prev + amount);
    addTransaction('income', amount, description);
  }, [addTransaction]);

  const deductExpense = useCallback((amount: number, description: string): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      addTransaction('expense', amount, description);
      return true;
    }
    return false;
  }, [balance, addTransaction]);

  const transferMoney = useCallback((amount: number, description: string): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      addTransaction('transfer', amount, description);
      return true;
    }
    return false;
  }, [balance, addTransaction]);

  return (
    <WalletContext.Provider value={{
      balance,
      addIncome,
      deductExpense,
      transferMoney,
      transactions
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};