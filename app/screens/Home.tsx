import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Product } from '../screens/models/Product';
import { RootStackParamList } from '../../App';
import localDB from '../Persistance/localDatabase';

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
    navigation: HomeScreenProps;
    route: HomeScreenRouteProp;
};

const Home = ({ navigation }: HomeProps): React.JSX.Element => {
    const [productos, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const initializeDB = async () => {
            await localDB.initialize();
            const db = await localDB.connect();
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM productos', [], (tx, results) => {
                    const rows = results.rows;
                    const items: Product[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    }
                    setProducts(items);
                });
            });
        };

        initializeDB();
    }, []);

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.productName}>{item.nombre}</Text>
                    <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
                </View>
                <Text style={[
                    styles.stock,
                    item.currentStock < item.minStock && styles.lowStock
                ]}>
                    {item.currentStock}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView>
            <FlatList
                data={productos}
                renderItem={renderProduct}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    productItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#888',
    },
    stock: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lowStock: {
        color: 'red',
    },
});

export default Home;
