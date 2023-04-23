import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator()
import Inicial from '../screens/Inicial.js'
import Drawer from "./Drawer";

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="Drawer" component={Drawer} />
                <Stack.Screen name="Inicial" component={Inicial} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;