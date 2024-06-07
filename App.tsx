import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';

import Home from './app/screens/Home';
import Login from './app/screens/Login';
import ProductDetails from './app/screens/ProductDetails';
import AddProduct from './app/screens/AddProduct';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    ProductDetails: { product: Product };
    AddProduct: undefined;
};

const HomeHeaderRight = (): React.JSX.Element => {
    const navigation = useNavigation();
    return (
        <Button
            title="Add Product"
            onPress={() => navigation.navigate('AddProduct')}
        />
    );
};

const App = (): React.JSX.Element => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        title: 'Products',
                        headerRight: () => <HomeHeaderRight />,
                    }}
                />
                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetails}
                    options={{ title: 'Product Details' }}
                />
                <Stack.Screen
                    name="AddProduct"
                    component={AddProduct}
                    options={{ title: 'Add Product' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
