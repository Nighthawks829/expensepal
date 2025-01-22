// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
import { ExpenseProvider } from "./ExpenseContext";
import { UserProvider } from "./UserContext";
import LoginSignUp from "./LoginSignup";
import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import Notification from "./Notification";
import ExpenseReport from "./ExpenseReport";
import Friend from "./Friend";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import Group from "./Group";
import CreateGroup from "./CreateGroup";
import Account from "./Account";
import Add_Budget from "./Add_Budget";
import UpdateBudget from "./UpdateBudget";
import SetCategoryBudget from "./SetCategoryBudget";
import CurrencySelection from "./CurrencySelection";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import Categories from "./Categories";
import { CategoriesProvider } from "./ExpenseContext";
import EditBudget from "./EditBudget";
import testCamera from "./testCamera";
import EditExpense from "./EditExpense";
import FriendRequest from "./FriendRequest";
import SplitExpense from "./SplitExpense";
import SplitOptions from "./SplitOptions";
import FriendSplitHistory from "./FriendSplitHistory";
import GroupDetails from "./GroupDetails";
import GroupMembers from "./GroupMembers";
import CurrentBalance from "./CurrentBalance";
import InviteMember from "./InviteMember";
import GroupExpenseTransactionList from "./GroupExpenseTransactionList";
import SettleUp from "./SettleUp";
import OnlinePayment from "./OnlinePayment";
import AddGroupExpense from "./AddGroupExpense";
import GroupSplitOptions from "./GroupSplitOptions";
import AccountSettings from "./AccountSettings";
import UploadQRcode from "./UploadQRcode";
import SettleUpPayment from "./SettleUpPayment";
import CheckSettleUp from "./CheckSettleUp";

// import { CurrencyProvider } from "./CurrencyContext";
// import AuthScreen from "./AuthScreen";
// import ExpenseForm from "./ExpenseForm";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// const firebaseConfig = {
//   apiKey: "AIzaSyD13zifG2vU6znWFWGPGQOLTS2Nk2rG1tY",
//   authDomain: "expensepal-bee.firebaseapp.com",
//   projectId: "expensepal-bee",
//   storageBucket: "expensepal-bee.appspot.com",
//   messagingSenderId: "711424679154",
//   appId: "1:711424679154:web:ebb49c64f7d7df4c4d446b",
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          let iconSize = 30;
          let customStyle = {};

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Friend":
              iconName = "people";
              break;
            case "Add Expense":
              iconName = "add-circle";
              iconSize = 40;
              customStyle = {
                position: "absolute",
                // bottom: -25,
                zindex: 10,
                // alignSelf: "center",
                // marginTop: -10,
                // marginBottom: -10,
              };
              break;
            case "Group":
              iconName = "account-group";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={30}
                  color={color}
                />
              );
            case "Account":
              iconName = "account-circle";
              break;
            default:
              iconName = "home";
          }

          return (
            <Icon
              name={iconName}
              size={iconSize}
              color={color}
              style={customStyle}
            />
          );
        },
        tabBarLabel: ({ color }) =>
          route.name === "Add Expense" ? null : (
            <Text style={{ color, fontSize: 16, fontWeight: "bold" }}>
              {route.name}
            </Text>
          ),
        tabBarActiveTintColor: "#48742C",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 70,
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Friend"
        component={Friend}
        options={{
          title: "Friend Lists",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#E1FFD4" },
        }}
      />
      <Tab.Screen
        name="Add Expense"
        component={AddExpense}
        options={{
          tabBarLabel: () => null,
          headerStyle: { backgroundColor: "#E1FFD4" },
        }}
      />
      <Tab.Screen
        name="Group"
        component={Group}
        options={{
          title: "Group Lists",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#E1FFD4" },
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          totle: "Account",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#E1FFD4" },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      {/* <CurrencyProvider> */}
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginSignup">
            <Stack.Screen
              name="LoginSignup"
              component={LoginSignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: "Login",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{
                title: "Sign Up",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="HomeTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FriendRequest"
              component={FriendRequest}
              options={{
                title: "Friend Requests",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="FriendSplitHistory"
              component={FriendSplitHistory}
              options={{
                title: false,
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
                // headerShown: false
              }}
            />
            <Stack.Screen
              name="SplitExpense"
              component={SplitExpense}
              options={{
                title: "Split Expense",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            {/* <Stack.Screen name="AuthScreen" component={AuthScreen} /> */}
            {/* <Stack.Screen name="ExpenseForm" component={ExpenseForm} /> */}
            <Stack.Screen
              name="SplitOptions"
              component={SplitOptions}
              options={{
                title: "Split Options",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen name="testCamera" component={testCamera} />
            <Stack.Screen
              name="Notification"
              component={Notification}
              options={{
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="ExpenseList"
              component={ExpenseList}
              options={{
                title: "Expenses List",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="ExpenseReport"
              component={ExpenseReport}
              options={{
                title: "Expense Report",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="EditExpense"
              component={EditExpense}
              options={{
                title: "Edit Expense",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="EditBudget"
              component={EditBudget}
              options={{
                title: "Edit Budget",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="Add_Budget"
              component={Add_Budget}
              options={{
                title: "Add Budget",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="UpdateBudget"
              component={UpdateBudget}
              options={{
                title: "Update Budget",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="CreateGroup"
              component={CreateGroup}
              options={{
                title: "Create Group",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="GroupDetails"
              component={GroupDetails}
              options={{
                title: false,
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="GroupMembers"
              component={GroupMembers}
              options={{
                title: "Group Members",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="CurrentBalance"
              component={CurrentBalance}
              options={{
                title: "Current Balance",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="AddGroupExpense"
              component={AddGroupExpense}
              options={{
                title: "Add Group Expense",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="GroupSplitOptions"
              component={GroupSplitOptions}
              options={{
                title: "Split Group Expense Options",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="GroupExpenseTransactionList"
              component={GroupExpenseTransactionList}
              options={{
                title: "Transaction List",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="InviteMember"
              component={InviteMember}
              options={{
                title: "Invite Member",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="SettleUp"
              component={SettleUp}
              options={{
                title: "Settle Up",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="OnlinePayment"
              component={OnlinePayment}
              options={{
                title: "Online Payment",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="Categories"
              component={Categories}
              options={{
                title: "Select Categories",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="SetCategoryBudget"
              component={SetCategoryBudget}
              options={{ title: "Set Category Budget" }}
            />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettings}
              options={{
                title: "Account Settings",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="uploadQRCode"
              component={UploadQRcode}
              options={{
                title: "Upload QR Code",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
              }}
            />
            <Stack.Screen
              name="SelectCurrency"
              component={CurrencySelection}
              options={{ title: "Select currency" }}
            />

            <Stack.Screen
              name="SettleUpPayment"
              component={SettleUpPayment}
              options={{
                title: "Settle Up Payment",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
                // headerShown: false
              }}
            />

            <Stack.Screen
              name="CheckSettleUp"
              component={CheckSettleUp}
              options={{
                title: "Check Settle Up Payment",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#E1FFD4" },
                // headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
      {/* </CurrencyProvider> */}
    </ExpenseProvider>
  );
}
