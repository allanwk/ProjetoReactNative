import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from 'react-native';

const Stack = createStackNavigator()
import Inicial from '../screens/Inicial.js'
import Drawer from "./Drawer";
import Register from "../screens/Register.js";
import ForgotPassword from "../screens/ForgotPassword.js";

const vaccineIcon = () => (
    <Image source={require('../assets/vacina.png')} style={{ width: 40, height: 40, marginLeft: 10 }} />
)

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#C1E7E3' }, headerTintColor: '#419ED7' }}>
                <Stack.Screen name="Inicial" component={Inicial} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerLeft: vaccineIcon, headerTitle: "MyHealth" }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerLeft: vaccineIcon, headerTitle: "MyHealth" }} />
                <Stack.Screen name="Drawer" component={Drawer} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;