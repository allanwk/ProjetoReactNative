import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerComponent from "../components/DrawerComponent";
import Home from "../screens/Home";
import Vacina from "../screens/Vacina";

const Drawer = createDrawerNavigator()

const MyDrawer = (props) => {
    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />} initialRouteName="Tela1" screenOptions={{ drawerActiveBackgroundColor: 'red', drawerLabelStyle: { color: 'gray' }, headerStyle: { backgroundColor: '#C1E7E3' }, headerTintColor: '#419ED7' }}>
            <Drawer.Screen name="Home" component={Home} options={({ navigation }) => ({
                title: 'Minhas vacinas'
            })} />
            <Drawer.Screen name="Vacina" component={Vacina} options={({ navigation }) => ({
                title: 'Minhas vacinas',
            })} />
        </Drawer.Navigator>
    )
}

export default MyDrawer