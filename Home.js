// import React, { useContext } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import ExpenseItem from "./ExpenseItem";
// import { ExpenseContext } from "./ExpenseContext";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";

// export default function Home() {
//   const navigation = useNavigation();

//   const contextValue = useContext(ExpenseContext);
//   console.log("ExpenseContext Value:", contextValue);
//   const {
//     expenses = [],
//     budgets = [],
//     currency = "RM",
//     hasNotifications = false,
//   } = contextValue || {}; //access the expenses from context

//   const sortedExpenses = [...expenses].sort(
//     (a, b) => new Date(b.date) - new Date(a.date)
//   );

//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth();
//   const currentYear = currentDate.getFullYear();

//   const monthlyExpenses = sortedExpenses.filter((exp) => {
//     const expenseDate = new Date(exp.date);
//     return (
//       expenseDate.getMonth() === currentMonth &&
//       expenseDate.getFullYear() === currentYear
//     );
//   });

//   const totalSpent = monthlyExpenses.reduce(
//     (total, item) => total + Number(item.amount),
//     0
//   );
//   const today = new Date().toISOString()?.split("T")[0];
//   const todaySpent = sortedExpenses
//     .filter((exp) => exp.date === today)
//     .reduce((total, item) => total + Number(item.amount), 0);
//   console.log("50Budgets", budgets);
//   const monthlyBudgets = Object.values(budgets).filter((budget) => {
//     const budgetCategories = budget.categories?.split(", ");
//     const allCategories = [
//       "Food & Drinks",
//       "Shopping",
//       "Transport",
//       "Housing",
//       "Others",
//     ];
//     const includesAllCategories =
//       budgetCategories.length === allCategories.length &&
//       budgetCategories.every((category) => allCategories.includes(category));
//     return includesAllCategories && budget.budgetName === "Monthly";
//   });

//   const totalBudget = monthlyBudgets.reduce(
//     (total, budget) => total + Number(budget.budgetAmount),
//     0
//   );
//   // const totalBudget = Object.values(budgets).reduce((total, amount) => {
//   //   return total + (typeof amount === "number" ? amount : 0);
//   // }, 0);
//   const remainingBudget = totalBudget - totalSpent;
//   console.log("Total budget:", totalBudget);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.notificationContainer}
//           onPress={() => navigation.navigate("Notification")}
//         >
//           <Icon
//             name="notifications"
//             size={30}
//             color="#48742C"
//             style={styles.notificationIcon}
//           />
//           {hasNotifications && <View style={styles.notificationDot} />}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.budgetContainer}>
//         <View style={styles.budgetGroup}>
//           <View style={styles.budgetRow}>
//             <View style={styles.budgetTextContainer}>
//               <Icon name="attach-money" size={50} color="#48742C" />
//               <View style={styles.textContainer}>
//                 <Text style={styles.budgetTextBold}>Total Monthly Spent</Text>
//                 <Text style={styles.budgetTextSmall}>Today's Spent</Text>
//               </View>
//             </View>
//             <View style={styles.moneyContainer}>
//               <Text style={styles.moneyTextBold}>
//                 {currency} {totalSpent.toFixed(2)}
//               </Text>
//               <Text style={styles.moneyTextSmall}>
//                 {currency} {todaySpent.toFixed(2)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.budgetGroup}>
//           <View style={styles.budgetRow}>
//             <View style={styles.budgetTextContainer}>
//               <Icon name="calculate" size={50} color="#48742C" />
//               <View style={styles.textContainer}>
//                 <Text style={styles.budgetTextBold}>Remaining Budget</Text>
//                 <Text style={styles.budgetTextSmall}>Total Monthly Budget</Text>
//               </View>
//             </View>
//             <View style={styles.moneyContainer}>
//               <Text style={styles.moneyTextBold}>
//                 {currency} {remainingBudget.toFixed(2)}
//               </Text>
//               <Text style={styles.moneyTextSmall}>
//                 {currency} {totalBudget.toFixed(2)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.reportButton}
//           onPress={() => navigation.navigate("ExpenseReport")}
//         >
//           <Icon name="assessment" size={20} color="#DDCCDD" />
//           <Text style={styles.reportButtonText}>View Report</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.expenseListHeader}>
//         <Text style={styles.subtitle}>Expense List</Text>
//         <TouchableOpacity
//           style={styles.showMoreButton}
//           onPress={() => navigation.navigate("ExpenseList")}
//         >
//           <Icon name="expand-more" size={20} color="#48742C" />
//           <Text style={styles.showMoreText}>Show More</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.line} />

//       <FlatList
//         data={sortedExpenses}
//         renderItem={({ item }) =>
//           item ? <ExpenseItem item={item} editable={false} /> : null
//         }
//         keyExtractor={(item, index) =>
//           item.expense_id ? item.expense_id.toString() : index.toString()
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingBottom: 100,
//     backgroundColor: "#E1FFD4",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   notificationContainer: {
//     position: "relative",
//   },
//   notificationIcon: {
//     marginRight: 10,
//   },
//   notificationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "red",
//     position: "absolute",
//     right: -2,
//     top: -2,
//   },
//   budgetContainer: {
//     backgroundColor: "#E7E7E7",
//     borderRadius: 50,
//     padding: 23,
//     marginVertical: 20,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   budgetGroup: {
//     marginBottom: 20,
//   },
//   budgetRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   budgetTextContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     top: 23,
//     left: -10,
//   },
//   textContainer: {
//     marginLeft: 10,
//   },
//   budgetTextBold: {
//     fontSize: 19,
//     fontWeight: "bold",
//   },
//   budgetTextSmall: {
//     fontSize: 17,
//   },
//   moneyContainer: {
//     alignItems: "flex-end",
//     top: 23,
//   },
//   moneyTextBold: {
//     fontSize: 19,
//     fontWeight: "bold",
//     color: "#DDCCDD",
//     backgroundColor: "#48742C",
//     padding: 3,
//     borderRadius: 5,
//   },
//   moneyTextSmall: {
//     fontSize: 17,
//     color: "#000",
//   },
//   expenseListHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   subtitle: {
//     fontSize: 17,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   showMoreButton: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   showMoreText: {
//     color: "#48742C",
//     fontSize: 15,
//     marginLeft: 5,
//     fontWeight: "bold",
//   },
//   line: {
//     height: 1,
//     backgroundColor: "#48742C",
//   },
//   reportButton: {
//     position: "absolute",
//     top: 10,
//     right: 25,
//     flexDirection: "row",
//     backgroundColor: "#48742C",
//     padding: 2,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   reportButtonText: {
//     color: "#DDCCDD",
//     fontWeight: "bold",
//     marginLeft: 5,
//   },
// });
Home.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ExpenseItem from "./ExpenseItem";
import { ExpenseContext } from "./ExpenseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { UserContext } from "./UserContext";

export default function Home() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [currencySymbol, setCurrencySymbol] = useState("RM");
  const [totalBudget, setTotalBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0)
  const [totalSpentState, setTotalSpentState] = useState(0)
  // const [todaySpent, setTodaySpent] = useState(0)


  const [sortedExpenses, setSortedExpenses] = useState([])
  const [monthlyExpenses, setMonthlyExpenses] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [todaySpent, setTodaySpent] = useState(0)

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date().toISOString()?.split("T")[0];

  const targetCategories = ["Food & Drinks", "Shopping", "Transport", "Housing", "Others"];

  const { expenses, budgets, hasNotifications, fetchExpenses, fetchBudgets } = useContext(ExpenseContext);

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

  useEffect(() => {
    // console.log(budgets);
    if (budgets) {
      const totalBudgetAmount = budgets.filter(budget => {
        const categories = budget.categories.split(", ").map(category => category.trim());
        const endDate = new Date(budget.end_date);
        return targetCategories.every(targetCategory => categories.includes(targetCategory)) &&
          endDate.getMonth() === currentMonth &&
          endDate.getFullYear() === currentYear;
      }).reduce((total, budget) => total + parseFloat(budget.budgetAmount), 0);
      setTotalBudget(totalBudgetAmount)
      setRemainingBudget(totalBudgetAmount-totalSpent)
    }
  }, [budgets])

  useEffect(() => {
    if (expenses) {

      const sortedExpenses = [...expenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setSortedExpenses(sortedExpenses)

      const monthlyExpenses = sortedExpenses.filter((exp) => {
        const expenseDate = new Date(exp.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });
      setMonthlyExpenses(monthlyExpenses)

      const totalSpent = monthlyExpenses.reduce(
        (total, item) => total + Number(item.amount),
        0
      );
      setTotalSpent(totalSpent);

      const todaySpent = sortedExpenses
        .filter((exp) => exp.date === today)
        .reduce((total, item) => total + Number(item.amount), 0);
      setTodaySpent(todaySpent)
    }
  }, [expenses])

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrency = async () => {
        try {
          const savedCurrency = await AsyncStorage.getItem("SelectedCurrency");
          console.log("Currency:", savedCurrency);

          const currencyMapping = {
            MYR: "RM",
            USD: "$",
            EUR: "€",
            GBP: "£",
            JPY: "¥",
            SGD: "$",
          };

          const symbol = currencyMapping[savedCurrency || "MYR"];
          console.log("45 Mapped Symbol:", symbol);
          setCurrencySymbol(symbol);
        } catch (error) {
          console.error("Failed to fetch currency", error);
          setCurrencySymbol("RM");
        }
      };

      fetchCurrency();
    }, [])
  );


  // console.log("50Budgets", budgets);
  // const monthlyBudgets = Object.values(budgets).filter((budget) => {
  //   const budgetCategories = budget.categories?.split(", ");
  //   const allCategories = [
  //     "Food & Drinks",
  //     "Groceries",
  //     "Shopping",
  //     "Public Transport",
  //     "Fuel",
  //     "Car Maintenance",
  //     "Parking",
  //     "Rent",
  //     "Bills",
  //     "Medical Expenses",
  //     "Fitness Memberships",
  //     "Supplements",
  //     "Personal Care",
  //     "Subscriptions",
  //     "Outdoor Activities",
  //     "Books & Stationary",
  //     "Loan Payments",
  //     "Savings & Investments",
  //     "Insurance",
  //     "Miscellaneous",
  //   ];
  //   const includesAllCategories =
  //     budgetCategories.length === allCategories.length &&
  //     budgetCategories.every((category) => allCategories.includes(category));
  //   return includesAllCategories && budget.budgetName === "Monthly";
  // });

  // const totalBudget = monthlyBudgets.reduce(
  //   (total, budget) => total + Number(budget.budgetAmount),
  //   0
  // );
  // const totalBudget = Object.values(budgets).reduce((total, amount) => {
  //   return total + (typeof amount === "number" ? amount : 0);
  // }, 0);
  // const remainingBudget = totalBudget - totalSpent;
  // console.log("Total budget:", totalBudget);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => navigation.navigate("Notification")}
        >
          <Icon
            name="notifications"
            size={30}
            color="#48742C"
            style={styles.notificationIcon}
          />
          {hasNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.budgetContainer}>
        <View style={styles.budgetGroup}>
          <View style={styles.budgetRow}>
            <View style={styles.budgetTextContainer}>
              <Icon name="attach-money" size={50} color="#48742C" />
              <View style={styles.textContainer}>
                <Text style={styles.budgetTextBold}>Total Monthly Spent</Text>
                <Text style={styles.budgetTextSmall}>Today's Spent</Text>
              </View>
            </View>
            <View style={styles.moneyContainer}>
              <Text style={styles.moneyTextBold}>
                {currencySymbol} {totalSpent.toFixed(2)}
              </Text>
              <Text style={styles.moneyTextSmall}>
                {currencySymbol} {todaySpent.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.budgetGroup}>
          <View style={styles.budgetRow}>
            <View style={styles.budgetTextContainer}>
              <Icon name="calculate" size={50} color="#48742C" />
              <View style={styles.textContainer}>
                <Text style={styles.budgetTextBold}>Remaining Budget</Text>
                <Text style={styles.budgetTextSmall}>Total Monthly Budget</Text>
              </View>
            </View>
            <View style={styles.moneyContainer}>
              <Text style={styles.moneyTextBold}>
                {currencySymbol} {remainingBudget.toFixed(2)}
              </Text>
              <Text style={styles.moneyTextSmall}>
                {currencySymbol} {totalBudget.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate("ExpenseReport")}
        >
          <Icon name="assessment" size={20} color="#DDCCDD" />
          <Text style={styles.reportButtonText}>View Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.expenseListHeader}>
        <Text style={styles.subtitle}>Expense List</Text>
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => navigation.navigate("ExpenseList")}
        >
          <Icon name="expand-more" size={20} color="#48742C" />
          <Text style={styles.showMoreText}>Show More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <FlatList
        data={sortedExpenses}
        renderItem={({ item }) =>
          item ? (
            <ExpenseItem
              item={item}
              editable={false}
              currencySymbol={currencySymbol}
            />
          ) : null
        }
        keyExtractor={(item, index) =>
          item.expense_id ? item.expense_id.toString() : index.toString()
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#E1FFD4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  notificationContainer: {
    position: "relative",
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    position: "absolute",
    right: -2,
    top: -2,
  },
  budgetContainer: {
    backgroundColor: "#E7E7E7",
    borderRadius: 50,
    padding: 23,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  budgetGroup: {
    marginBottom: 20,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    top: 23,
    left: -10,
  },
  textContainer: {
    marginLeft: 10,
  },
  budgetTextBold: {
    fontSize: 19,
    fontWeight: "bold",
  },
  budgetTextSmall: {
    fontSize: 17,
  },
  moneyContainer: {
    alignItems: "flex-end",
    top: 23,
  },
  moneyTextBold: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#DDCCDD",
    backgroundColor: "#48742C",
    padding: 3,
    borderRadius: 5,
  },
  moneyTextSmall: {
    fontSize: 17,
    color: "#000",
  },
  expenseListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  showMoreText: {
    color: "#48742C",
    fontSize: 15,
    marginLeft: 5,
    fontWeight: "bold",
  },
  line: {
    height: 1,
    backgroundColor: "#48742C",
  },
  reportButton: {
    position: "absolute",
    top: 10,
    right: 25,
    flexDirection: "row",
    backgroundColor: "#48742C",
    padding: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  reportButtonText: {
    color: "#DDCCDD",
    fontWeight: "bold",
    marginLeft: 5,
  },
});