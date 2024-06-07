import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import LocalDatabase from '../Persistance/localDatabase';
import { RootStackParamList } from '../../App';

const AddProduct = (): React.JSX.Element => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [nombre, setName] = useState('');
    const [precio, setPrice] = useState('');
    const [minStock, setMinStock] = useState('');
    const [maxStock, setMaxStock] = useState('');

    const handleSave = async () => {
        if (!nombre || !precio || !minStock || !maxStock) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            const db = await LocalDatabase.connect();
            if (db) {
                db.transaction(tx => {
                    tx.executeSql(
                        'INSERT INTO productos (nombre, precio, minStock, maxStock) VALUES (?, ?, ?, ?)',
                        [nombre, parseFloat(precio), parseInt(minStock), parseInt(maxStock)],
                        () => {
                            console.log('Product added successfully');
                            navigation.goBack();
                        },
                        error => {
                            console.error('Error adding product', error);
                            Alert.alert('Error', 'There was an error adding the product');
                        }
                    );
                });
            } else {
                Alert.alert('Error', 'Failed to connect to the database');
            }
        } catch (error) {
            console.error('Error connecting to database', error);
            Alert.alert('Error', 'There was an error connecting to the database');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Add Product</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    keyboardType="numeric"
                    onChangeText={setPrice}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Minimum Stock"
                    keyboardType="numeric"
                    onChangeText={setMinStock}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Maximum Stock"
                    keyboardType="numeric"
                    onChangeText={setMaxStock}
                />
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    form: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddProduct;

