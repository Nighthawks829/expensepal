import React, {useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ExpenseContext } from "./ExpenseContext";
import sharedStyles from "./styles";
import { Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

const categories = [
    "Food & Drinks",
    "Shopping",
    "Transport",
    "Housing",
    "Others",
];

export default function Categories(){
    const navigation = useNavigation();
    const route = useRoute();
    const {setSelectedCategories: setParentSelectedCategories} = route.params;
    const [selectedCategories, setSelectedCategoriesState] = useState([]);

    // const toggleCategory = (category) => {
    //     if(selected.has(category)) {
    //         selected.delete(category);
    //     } else {
    //         selected.add(category);
    //     }
    //     setSelected(new Set(selected));
    // };

    const handleSelectedCategory = (category) => {
        setSelectedCategoriesState((prev) => {
            if (prev.includes(category)) {
                return prev.filter(item => item !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const handleSelectAll = () => {
        setSelectedCategoriesState(categories);
        navigation.goBack();
        setParentSelectedCategories(categories);
    }

    const handleDone = () => {
        setParentSelectedCategories(selectedCategories);
        navigation.goBack();
    };

    return(
        <View style={styles.container}>
            {/* {availableCategories.map((category) => (
                <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategory(category)}
                    style={[
                        styles.categoryButton,
                        selected.has(category) && styles.selectedCategory,
                    ]}
                >
                    <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity> */}
            <Button mode="contained" onPress={handleSelectAll} style={styles.button}>Select All</Button>
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    //title={category}
                    onPress={() => handleSelectedCategory(category)}
                    style={[
                        styles.categoryButton,
                        selectedCategories.includes(category) && styles.selectedCategory,
                    ]}
                >
                    <Text style={[
                        styles.categoryText,
                        selectedCategories.includes(category) && styles.selectedCategoryText,
                    ]}>
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
            <Button mode="contained" onPress={handleDone} style={styles.button}>Done</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E1FFD4',
    },
    categoryButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginVertical: 5,
    },
    selectedCategory: {
        backgroundColor: '#48742C',
    },
    categoryText: {
        fontSize: 18,
    },
    selectedCategoryText: {
        color: '#fff',
    },
    button: {
        marginBottom: 10,
        backgroundColor: "#48742C",
    },
});