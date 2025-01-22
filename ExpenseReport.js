// import React, { useContext, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import { ExpenseContext } from "./ExpenseContext";
// import { PieChart } from "react-native-chart-kit";
// import { Dimensions } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import { ProgressBar } from "react-native-paper";
// import sharedStyles from "./styles";
// import { UserContext } from "./UserContext";

// export default function ExpenseReport({ navigation }) {
//   const { expenses, budgets, currency, fetchBudgets } =
//     useContext(ExpenseContext);
//   const { user } = useContext(UserContext);
//   const [data, setData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());

//   const formatMonth = (date) => {
//     const options = { year: "numeric", month: "long" };
//     return date.toLocaleDateString(undefined, options);
//   };

//   const filteredExpenses = expenses.filter((expense) => {
//     const expenseDate = new Date(expense.date);
//     return (
//       expenseDate.getMonth() === selectedMonth.getMonth() &&
//       expenseDate.getFullYear() === selectedMonth.getFullYear()
//     );
//   });

//   const totalExpenses = filteredExpenses.reduce((total, item) => {
//     const amount = isNaN(Number(item.amount)) ? 0 : Number(item.amount);
//     return total + amount; //Array.isArray(filteredExpenses) ? filteredExpenses.reduce((total, item) => total + (isNaN(Number(item.amount)) ? 0 : Number(item.amount)), 0) : 0;
//   }, 0);

//   const totalBudget = Object.values(budgets).reduce((total, amount) => {
//     return total + (isNaN(Number(amount)) ? 0 : Number(amount)); //budgets ? Object.values(budgets).reduce((total, amount) => total + (isNaN(Number(amount)) ? 0 : Number(amount)), 0) : 0;
//   }, 0);

//   const budgetUsagePercentage =
//     totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(2) : 0;
//   // const totalExpenses = expenses && expenses.length > 0 ? expenses.reduce((total, item) => total + item.amount, 0) : 0;

//   const budgetData = Object.keys(budgets).map((budgetName, index) => ({
//     name: budgetName,
//     amount: expenses
//       .filter((e) => e.category === budgetName)
//       .reduce((total, item) => total + Number(item.amount), 0),
//     color: ["#FF0000", "#FFC0CB", "#90EE90", "#006400", "#0000FF"][index % 5],
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 15,
//   }));

//   // const totalBudget = Object.values(budgets).reduce((total, amount) => total + amount, 0);
//   // const remainingBudget = totalBudget - totalExpenses;
//   // const budgetUsagePercentage = totalBudget === 0 ? 0 : ((totalExpenses / Object.values(budgets).reduce((total, budget) => total + budget, 0)) * 100).toFixed(2);

//   const categoryColors = {
//     "Food & Drinks": "#FF6347",
//     Transport: "#4682B4",
//     Shopping: "#8A2BE2",
//     Housing: "#2E8B57",
//     Others: "#FFD700",
//   };

//   useEffect(() => {
//     fetchBudgets(user.user_id);
//     console.log("Expenses", expenses);
//     console.log("Budget", budgets);

//     const categoryTotals = filteredExpenses.reduce((totals, expense) => {
//       const category = expense.category;
//       const amount = Number(expense.amount) || 0;
//       // totals[category] = (totals[category] || 0) + amount;
//       if (!totals[category]) {
//         totals[category] = 0;
//       }
//       totals[category] += isNaN(Number(amount)) ? 0 : Number(amount);
//       return totals;
//     }, {});

//     const chartData = Object.keys(categoryTotals).map((category, index) => ({
//       name: category,
//       amount: parseFloat(categoryTotals[category].toFixed(2)),
//       color: categoryColors[category] || "#808080",
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     }));

//     setData(chartData);
//   }, [expenses, selectedMonth]);

//   const changeMonth = (direction) => {
//     const newDate = new Date(selectedMonth);
//     newDate.setMonth(selectedMonth.getMonth() + direction);
//     setSelectedMonth(newDate);
//   };

//   const handleEditBudget = (budgetName) => {
//     navigation.navigate("EditBudget", { budgetName });
//   };

//   const calculateBudgetUsage = (budget) => {
//     const { start_date, end_date, categories, budgetAmount } = budget;
//     // console.log("Start date", start_date);
//     const start = new Date(start_date);
//     const end = new Date(end_date);

//     // const budgetCategories = categories.split(", ");

//     const allCategories = [
//       "Food & Drinks",
//       "Shopping",
//       "Transport",
//       "Housing",
//       "Others",
//     ];
//     const includesAllCategories =
//       categories.length === allCategories.length &&
//       categories.every((category) => allCategories.includes(category));
//     console.log("Expense", expenses);

//     const budgetSpent = expenses
//       .filter((expense) => {
//         const expenseDate = new Date(expense.date);
//         console.log("Expense date", expenseDate);
//         console.log("Start end", start, end);
//         return (
//           expenseDate >= start &&
//           expenseDate <= end &&
//           (includesAllCategories || categories.includes(expense.category))
//         );
//       })
//       .reduce((total, item) => Number(total) + Number(item.amount), 0);

//     console.log("BudgetSpent:", budgetSpent);
//     console.log("Amount", budgetAmount);
//     console.log("Budget Spent", budgetSpent);
//     const budgetRemaining = budgetAmount - budgetSpent;
//     const budgetUsagePercentage =
//       budgetAmount > 0 ? ((budgetSpent / budgetAmount) * 100).toFixed(2) : 0;

//     return { budgetSpent, budgetRemaining, budgetUsagePercentage };
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={{ flexGrow: 1 }}
//       style={styles.scrollContainer}
//     >
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => changeMonth(-1)}>
//           <AntDesign name="arrowleft" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.title}>{formatMonth(selectedMonth)}</Text>
//         <TouchableOpacity onPress={() => changeMonth(1)}>
//           <AntDesign name="arrowright" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       <PieChart
//         data={data}
//         width={Dimensions.get("window").width - 40}
//         height={220}
//         chartConfig={{
//           color: () => `rgba(255, 255, 255, 0.5)`,
//         }}
//         accessor="amount"
//         backgroundColor="transparent"
//         paddingLeft={"15"}
//         absolute
//       />

//       <Text style={styles.totalSpent}>
//         TOTAL {formatMonth(selectedMonth).toUpperCase()} SPENT
//       </Text>
//       <Text style={styles.totalAmount}>
//         {currency}{" "}
//         {isNaN(Number(totalExpenses))
//           ? "0.00"
//           : Number(totalExpenses).toFixed(2)}
//       </Text>

//       <View style={styles.budgetSection}>
//         <Text style={styles.budgetLabel}>Budgets</Text>
//         {Object.keys(budgets || {}).map((key, index) => {
//           console.log("Budgets", budgets);
//           const budget = budgets[key];
//           console.log("Budget Object:", budget);
//           const { budgetSpent, budgetRemaining, budgetUsagePercentage } =
//             calculateBudgetUsage(budget);
//           // const { budgetName, budgetAmount } = budget;

//           // const start = new Date(startDate);
//           // const end = new Date(endDate);

//           // const budgetSpent = expenses
//           //   .filter((expense) => {
//           //     const expenseDate = new Date(expense.date);
//           //     return (
//           //       expenseDate >= start &&
//           //       expenseDate <= end &&
//           //       (category.includes(expense.category) ||
//           //         categories.includes("All"))
//           //     );
//           //   })
//           //   .reduce((total, item) => total + Number(item.amount), 0);

//           // const budgetRemaining = budgetAmount - budgetSpent;
//           // const budgetUsagePercentage =
//           //   budgetAmount > 0
//           //     ? ((budgetSpent / budgetAmount) * 100).toFixed(2)
//           //     : 0;
//           // }) === 0 ? (
//           //   <Text style={styles.noBudgetsText}>No budgets added</Text>
//           // ) : (
//           //   budgets.map((budget, index) => {
//           //     const budgetName = budget.budgetName;
//           //     const budgetAmount = Number(budget.budgetAmount);
//           //     const budgetSpent = expenses
//           //       .filter((e) => e.category === budgetName)
//           //       .reduce((total, item) => total + Number(item.amount), 0);
//           //     const budgetRemaining = budgetAmount - budgetSpent;
//           //     const budgetUsagePercentage =
//           //       budgetAmount > 0
//           //         ? ((budgetSpent / budgetAmount) * 100).toFixed(2)
//           //         : 0;

//           return (
//             // <Text key={index}>123</Text>
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleEditBudget(budget.budgetName)}
//               style={styles.budgetRow}
//             >
//               <View style={styles.budgetInfo}>
//                 <Text style={styles.budgetText}>{budget.budgetName}</Text>
//                 <Text style={styles.budgetText}>
//                   {currency} {budgetRemaining.toFixed(2)} (
//                   {budgetUsagePercentage}% used)
//                 </Text>
//               </View>
//               <ProgressBar
//                 style={styles.progressBar}
//                 progress={budget.amount > 0 ? budgetSpent / budget.amount : 0}
//                 color="#48742C"
//               />
//             </TouchableOpacity>
//           );
//         })}
//         {/* <View style={styles.budgetRow}>
//           <Text style={styles.budgetText}>Monthly budget</Text>
//           <Text style={styles.budgetText}>
//             {currency} {isNaN(totalBudget) ? "0.00" : totalBudget.toFixed(2)} (
//             {isNaN(budgetUsagePercentage) ? "0" : budgetUsagePercentage} % used)
//           </Text>
//         </View>
//         <ProgressBar
//           // styleAttr="Horizontal"
//           // indeterminate={false}
//           progress={totalBudget === 0 ? 0 : totalExpenses / totalBudget}
//           color="#48742C"
//           style={styles.progressBar}
//         /> */}
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={sharedStyles.button}
//           onPress={() => navigation.navigate("Add_Budget")}
//         >
//           <Text style={sharedStyles.buttonText}>Add Budget</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     minHeight: "100%",
//     padding: 20,
//     paddingBottom: 100,
//     backgroundColor: "#E1FFD4",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "black",
//     marginHorizontal: 15,
//   },
//   month: {
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   totalSpent: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 20,
//     color: "#000",
//   },
//   totalAmount: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: -15,
//     color: "#48742C",
//   },
//   budgetSection: {
//     marginTop: 20,
//   },
//   budgetLabel: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   budgetRow: {
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: "white",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//     elevation: 3,
//     // flexDirection: "row",
//     // justifyContent: "space-between",
//     // marginBottom: 5,
//   },
//   budgetInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 5,
//   },
//   budgetText: {
//     fontSize: 16,
//     color: "black",
//   },
//   progressBar: {
//     height: 10,
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   buttonContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
// });

ExpenseReport.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ExpenseContext } from "./ExpenseContext";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import sharedStyles from "./styles";
import { UserContext } from "./UserContext";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ExpenseReport({ navigation }) {
  const { expenses, budgets, fetchBudgets, fetchExpenses } = useContext(ExpenseContext);
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("");


  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date().toISOString()?.split("T")[0];

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useFocusEffect(
    React.useCallback(() => {
      fetchExpenses(user.user_id)
      fetchBudgets(user.user_id)
      // const totalBudgetAmount = budgets.filter(budget => {
      //   const categories = budget.categories.split(", ").map(category => category.trim());
      //   return targetCategories.every(targetCategory => categories.includes(targetCategory));
      // }).reduce((total, budget) => total + parseFloat(budget.budgetAmount), 0);

    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrency = async () => {
        try {
          const savedCurrency = await AsyncStorage.getItem("SelectedCurrency");
          // console.log("Currency:", savedCurrency);

          const currencyMapping = {
            MYR: "RM",
            USD: "$",
            EUR: "€",
            GBP: "£",
            JPY: "¥",
            SGD: "$",
          };

          const symbol = currencyMapping[savedCurrency || "MYR"];
          // console.log("45 Mapped Symbol:", symbol);
          setCurrencySymbol(symbol);
        } catch (error) {
          console.error("Failed to fetch currency", error);
          setCurrencySymbol("RM");
        }
      };

      fetchCurrency();
    }, [])
  );

  const formatMonth = (date) => {
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString(undefined, options);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === selectedMonth.getMonth() &&
      expenseDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const totalExpenses = filteredExpenses.reduce((total, item) => {
    const amount = isNaN(Number(item.amount)) ? 0 : Number(item.amount);
    return total + amount; //Array.isArray(filteredExpenses) ? filteredExpenses.reduce((total, item) => total + (isNaN(Number(item.amount)) ? 0 : Number(item.amount)), 0) : 0;
  }, 0);

  const totalBudget = Object.values(budgets).reduce((total, amount) => {
    return total + (isNaN(Number(amount)) ? 0 : Number(amount)); //budgets ? Object.values(budgets).reduce((total, amount) => total + (isNaN(Number(amount)) ? 0 : Number(amount)), 0) : 0;
  }, 0);

  const budgetUsagePercentage =
    totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(2) : 0;
  // const totalExpenses = expenses && expenses.length > 0 ? expenses.reduce((total, item) => total + item.amount, 0) : 0;

  const budgetData = Object.keys(budgets).map((budgetName, index) => ({
    name: budgetName,
    amount: expenses
      .filter((e) => e.category === budgetName)
      .reduce((total, item) => total + Number(item.amount), 0),
    color: ["#FF0000", "#FFC0CB", "#90EE90", "#006400", "#0000FF"][index % 5],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  // const totalBudget = Object.values(budgets).reduce((total, amount) => total + amount, 0);
  // const remainingBudget = totalBudget - totalExpenses;
  // const budgetUsagePercentage = totalBudget === 0 ? 0 : ((totalExpenses / Object.values(budgets).reduce((total, budget) => total + budget, 0)) * 100).toFixed(2);

  const categoryColors = {
    "Food & Drinks": "#FF6347",
    Transport: "#4682B4",
    Shopping: "#8A2BE2",
    Housing: "#2E8B57",
    Others: "#FFD700",
  };

  useEffect(() => {
    fetchBudgets(user.user_id);
    // console.log("Expenses", expenses);
    // console.log("Budget", budgets);

    const categoryTotals = filteredExpenses.reduce((totals, expense) => {
      const category = expense.category;
      const amount = Number(expense.amount) || 0;
      // totals[category] = (totals[category] || 0) + amount;
      if (!totals[category]) {
        totals[category] = 0;
      }
      totals[category] += isNaN(Number(amount)) ? 0 : Number(amount);
      return totals;
    }, {});

    const chartData = Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      amount: parseFloat(categoryTotals[category].toFixed(2)),
      color: categoryColors[category] || "#808080",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));

    setData(chartData);
  }, [expenses, selectedMonth]);

  const changeMonth = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  const handleEditBudget = (budgetName) => {
    navigation.navigate("EditBudget", { budgetName });
  };

  const calculateBudgetUsage = (budget) => {
    const { start_date, end_date, categories, budgetAmount } = budget;
    // console.log("Start date", start_date);
    const start = new Date(start_date);
    const end = new Date(end_date);

    // const budgetCategories = categories.split(", ");

    const allCategories = [
      "Food & Drinks",
      "Groceries",
      "Shopping",
      "Public Transport",
      "Fuel",
      "Car Maintenance",
      "Parking",
      "Rent",
      "Bills",
      "Medical Expenses",
      "Fitness Memberships",
      "Supplements",
      "Personal Care",
      "Subscriptions",
      "Outdoor Activities",
      "Books & Stationary",
      "Loan Payments",
      "Savings & Investments",
      "Insurance",
      "Miscellaneous",
    ];

    const budgetCategories = budget.categories.split(", ").map(category => category.trim());

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    const monthlyExpenses = sortedExpenses.filter((exp) => {
      const expenseDate = new Date(exp.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear &&
        budgetCategories.some(category => exp.category.includes(category))
      );
    });


    const totalSpent = monthlyExpenses.reduce((total, item) => total + Number(item.amount), 0).toFixed(2);

    // console.log(expenses);
    // const includesAllCategories =
    //   categories.length === allCategories.length &&
    //   categories.every((category) => allCategories.includes(category));
    // // console.log("Expense", expenses);

    // const budgetSpent = expenses
    //   .filter((expense) => {
    //     const expenseDate = new Date(expense.date);
    //     // console.log("Expense date", expenseDate);
    //     // console.log("Start end", start, end);
    //     return (
    //       expenseDate >= start &&
    //       expenseDate <= end &&
    //       (includesAllCategories || categories.includes(expense.category))
    //     );
    //   })
    //   .reduce((total, item) => Number(total) + Number(item.amount), 0);

    // // console.log("BudgetSpent:", budgetSpent);
    // // console.log("Amount", budgetAmount);
    // // console.log("Budget Spent", budgetSpent);
    // const budgetRemaining = budgetAmount - budgetSpent;
    // const budgetUsagePercentage =
    //   budgetAmount > 0 ? ((budgetSpent / budgetAmount) * 100).toFixed(2) : 0;
    const totalBudget = budget.budgetAmount;
    const budgetSpent = Number(totalSpent);
    const budgetRemaining = totalBudget - budgetSpent;
    const budgetUsagePercentage = ((budgetSpent / totalBudget) * 100).toFixed(2);
    return { budgetSpent, budgetRemaining, budgetUsagePercentage };
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={styles.scrollContainer}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{formatMonth(selectedMonth)}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <PieChart
        data={data}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          color: () => `rgba(255, 255, 255, 0.5)`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft={"15"}
        absolute

      />

      <Text style={styles.totalSpent}>
        {formatMonth(selectedMonth).toUpperCase()}
      </Text>
      <Text style={styles.totalAmount}>
        TOTAL SPENT {currencySymbol}{" "}
        {isNaN(Number(totalExpenses))
          ? "0.00"
          : Number(totalExpenses).toFixed(2)}
      </Text>

      <View style={styles.budgetSection}>
        <Text style={styles.budgetLabel}>Budgets</Text>
        {Object.keys(budgets || {}).map((key, index) => {
          const budget = budgets[key];
          const { budgetSpent, budgetRemaining, budgetUsagePercentage } = calculateBudgetUsage(budget);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleEditBudget(budget.budgetName)}
              style={styles.budgetRow}
            >
              <View style={styles.budgetInfo}>
                <Text style={styles.budgetText}>{budget.budgetName}</Text>
                <Text style={styles.budgetText}>
                  {currencySymbol} {budgetRemaining.toFixed(2)} (
                  {budgetUsagePercentage}% used)
                </Text>
              </View>
              <PieChart
                data={[
                  {
                    name: "Spent",
                    amount: +budgetSpent.toFixed(2),
                    color: "#FF6347", // Red color for spent amount
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                  {
                    name: "Remaining",
                    amount: +budgetRemaining.toFixed(2),
                    color: "#32CD32", // Green color for remaining amount
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                ]}
                width={Dimensions.get("window").width - 40}
                height={200}
                chartConfig={{
                  color: () => `rgba(255, 255, 255, 0.5)`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft={"15"}
                absolute
              />
              {/* <ProgressBar
                style={styles.progressBar}
                progress={budget.amount > 0 ? budgetSpent / budget.amount : 0}
                color="#48742C"
              /> */}
            </TouchableOpacity>
          );
        })}
        {/* <View style={styles.budgetRow}>
          <Text style={styles.budgetText}>Monthly budget</Text>
          <Text style={styles.budgetText}>
            {currency} {isNaN(totalBudget) ? "0.00" : totalBudget.toFixed(2)} (
            {isNaN(budgetUsagePercentage) ? "0" : budgetUsagePercentage} % used)
          </Text>
        </View>
        <ProgressBar
          // styleAttr="Horizontal"
          // indeterminate={false}
          progress={totalBudget === 0 ? 0 : totalExpenses / totalBudget}
          color="#48742C"
          style={styles.progressBar}
        /> */}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={sharedStyles.button}
          onPress={() => navigation.navigate("Add_Budget")}
        >
          <Text style={sharedStyles.buttonText}>Add Budget</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: "100%",
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#E1FFD4",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginHorizontal: 15,
  },
  month: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  totalSpent: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#000",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -15,
    color: "#48742C",
  },
  budgetSection: {
    marginTop: 20,
  },
  budgetLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  budgetRow: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // marginBottom: 5,
  },
  budgetInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  budgetText: {
    fontSize: 16,
    color: "black",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginVertical: 20,
  },
});