import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Vacina from "../screens/Vacina";

const Stack = createStackNavigator()

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Vacina" component={Vacina} />
    </Stack.Navigator>
  );
}