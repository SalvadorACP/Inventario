import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from '../screens/models/Product';
import { RootStackParamList } from '../../App';
import LocalDatabase from '../Persistance/localDatabase';

type ProductDetailsScreenProps = StackNavigationProp<RootStackParamList, 'ProductDetails'>;
type ProductDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

type ProductDetailsProps = {
    navigation: ProductDetailsScreenProps;
    route: ProductDetailsScreenRouteProp;
};

const ProductDetails = ({ route, navigation }: ProductDetailsProps): React.JSX.Element => {
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        setProduct(route.params.product);
    }, [route]);

    const updateStock = async (isAdding: boolean) => {
        if (!quantity) {
            Alert.alert('Error', 'Please enter a valid quantity.');
            return;
        }

        const quantityNum = parseInt(quantity);
        if (isNaN(quantityNum) || quantityNum <= 0) {
            Alert.alert('Error', 'Please enter a positive numeric value.');
            return;
        }

        const newStock = isAdding ? product!.currentStock + quantityNum : product!.currentStock - quantityNum;

        if (newStock < 0) {
            Alert.alert('Error', 'Stock cannot be negative.');
            return;
        }

        try {
            const db = await LocalDatabase.connect();
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE productos SET currentStock = ? WHERE id = ?',
                    [newStock, product!.id],
                    () => {
                        setProduct({ ...product!, currentStock: newStock });
                        Alert.alert('Success', `Stock ${isAdding ? 'added' : 'removed'} successfully.`);
                    },
                    error => {
                        console.error('Error updating stock', error);
                        Alert.alert('Error', 'There was an error updating the stock.');
                    }
                );

                tx.executeSql(
                    'INSERT INTO movimientos (idproducto, cantidad, tipomovimiento) VALUES (?, ?, ?)',
                    [product!.id, quantityNum, isAdding ? 'add' : 'remove'],
                    () => console.log('Stock movement recorded successfully'),
                    error => console.error('Error recording stock movement', error)
                );
            });
        } catch (error) {
            console.error('Error connecting to database', error);
            Alert.alert('Error', 'There was an error connecting to the database.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {product && (
                <View>
                    <Text style={styles.title}>{product.nombre}</Text>
                    <Text style={styles.detail}>Price: ${product.precio.toFixed(2)}</Text>
                    <Text style={styles.detail}>Current Stock: {product.currentStock}</Text>
                    <Text style={styles.detail}>Minimum Stock: {product.minStock}</Text>
                    <Text style={styles.detail}>Maximum Stock: {product.maxStock}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter quantity"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonAdd} onPress={() => updateStock(true)}>
                            <Text style={styles.buttonText}>Add Stock</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonRemove} onPress={() => updateStock(false)}>
                            <Text style={styles.buttonText}>Remove Stock</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detail: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonAdd: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '40%',
    },
    buttonRemove: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '40%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetails;
