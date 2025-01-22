import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
// import { useScrollToTop } from '@react-navigation/native';
// import { useSafeAreaFrame } from 'react-native-safe-area-context';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = React.useState([]);
  // const [budgets, setBudgets] = useState({
  //     food: 0,
  //     transport: 0,
  //     shopping: 0,
  //     housing: 0,
  //     others: 0,
  // });
  const [budgets, setBudgets] = useState({});
  const [currency, setCurrency] = useState("RM"); //default currency
  const [hasNotifications, setHasNotifications] = useState(false); //notification state
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchBudgets(userId);
    if (userId) {
      fetchExpenses(userId);
    }
  }, [userId]);

  useEffect(() => {
    // console.log("Fetched Budgets:", budgets);
    // console.log("Expenses:", expenses);
  }, [budgets, expenses]);

  const fetchExpenses = async (userId) => {
    try {
      // console.log(userId);
      const response = await axios.get(
        `http://192.168.0.112/expensepal_api/getExpenses.php?user_id=${userId}`
      );
      // console.log(response.data.expenses);
      // console.log('API Response:', response.data);
      // if (response.data && Array.isArray(response.data.expenses)) {
      //     setExpenses(response.data.expenses);
      // } else {
      //     console.error("Expenses data is not in the expected format.");
      //     setExpenses([]);
      // }
      const fetchedExpenses = Array.isArray(response.data.expenses)
        ? response.data.expenses
        : [];
      // console.log("Fetch expense", fetchedExpenses);
      setExpenses(fetchedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  };

  // const ref = useRef(null);
  // useScrollToTop(ref);

  const addExpense = (expense) => {
    const newExpense = { ...expense, expense_id: Date.now().toString() };
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.expense_id === updatedExpense.expense_id
          ? updatedExpense
          : expense
      )
    );
  };

  const deleteExpense = (expenseId) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((exp) => exp.expense_id !== expenseId)
    );
  };

  const getTotalSpent = () => {
    return Array.isArray(expenses)
      ? expenses.reduce((total, item) => total + item.amount, 0)
      : 0;
  };

  const fetchBudgets = async (userId) => {
    try {
      // console.log(userId);
      const response = await axios.get(
        `http://192.168.0.112/expensepal_api/getBudget.php?user_id=${userId}`
      );
      // const data = await response.json();
      // if (data.success) {
      //   setBudgets(data.budgets);
      // } else {
      //   console.error("Error fetching budgets:", data.message);
      // }
      // console.log(response.data.expenses);
      // console.log('API Response:', response.data);
      // if (response.data && Array.isArray(response.data.expenses)) {
      //     setExpenses(response.data.expenses);
      // } else {
      //     console.error("Expenses data is not in the expected format.");
      //     setExpenses([]);
      // }


      // console.log(response.data.budgets);

      // const fetchedBudgets =
      //   response.data.success && Array.isArray(response.data.budgets)
      //     ? response.data.budgets
      //     : [];
      // console.log("Fetched budget", fetchedBudgets);
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]);
    }
  };

  const addBudget = (newBudget) => {
    // console.log("New Budget:", newBudget);
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    // console.log('Add Budgets:', budgets);
  };

  const updateBudget = (category, amount) => {
    setBudgets((prevBudgets) => {
      const updatedBudgets = prevBudgets.map((budget) => {
        if (budget.budgetName === category) {
          return { ...budget, budgetAmount: amount };
        }
        return budget;
      });
      return updatedBudgets;
    });
  };

  const getCurrentBudgetUsage = (budgetName) => {
    const currentExpenses = expenses.filter(
      (expense) => expense.category === budgetName
    );
    return currentExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  };

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const triggerNotification = () => {
    setHasNotifications(true);
  };

  const clearNotification = () => {
    setHasNotifications(false);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        budgets,
        fetchBudgets,
        addBudget,
        updateBudget,
        currency,
        updateCurrency,
        hasNotifications,
        triggerNotification,
        clearNotification,
        getTotalSpent,
        setUserId,
        updateExpense,
        deleteExpense,
        fetchExpenses,
        getCurrentBudgetUsage,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const CategoriesProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  return (
    <ExpenseContext.Provider
      value={{ selectedCategories, setSelectedCategories }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useCategories = () => useContext(ExpenseContext);
