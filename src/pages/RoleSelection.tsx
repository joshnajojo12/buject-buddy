import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'student' | 'professional') => {
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="p-4 bg-primary/20 rounded-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="w-12 h-12 text-primary" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            FinanceSecure Pro
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Smart finance management with AI-powered security. Choose your profile to get started with personalized financial insights.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10 }}
            className="group"
          >
            <Card className="card-glass p-8 h-full hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    className="p-6 bg-primary/10 rounded-3xl"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <GraduationCap className="w-16 h-16 text-primary" />
                  </motion.div>
                </div>
                
                <h2 className="text-3xl font-bold text-center mb-4">Student</h2>
                <p className="text-muted-foreground text-center mb-8 text-lg">
                  Perfect for managing pocket money, part-time earnings, and achieving your academic financial goals.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Pocket Money Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Savings Goals & Progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Smart Spending Insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Student Leaderboard</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleRoleSelect('student')}
                  className="w-full btn-hero text-lg py-6"
                >
                  Get Started as Student
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Professional Card */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -10 }}
            className="group"
          >
            <Card className="card-glass p-8 h-full hover:border-accent/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    className="p-6 bg-accent/10 rounded-3xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Briefcase className="w-16 h-16 text-accent" />
                  </motion.div>
                </div>
                
                <h2 className="text-3xl font-bold text-center mb-4">Professional</h2>
                <p className="text-muted-foreground text-center mb-8 text-lg">
                  Advanced tools for salary management, investments, EMI calculations, and comprehensive financial planning.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm">Salary & Investment Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm">EMI & Loan Calculator</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm">Fraud Detection System</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm">Expense Prediction AI</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleRoleSelect('professional')}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold px-8 py-6 rounded-xl hover:shadow-[0_0_30px_hsl(var(--accent)/0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg"
                >
                  Get Started as Professional
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Security Badge */}
        <motion.div
          className="flex items-center justify-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 px-6 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">
              Protected by AI-powered security & fraud detection
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;




