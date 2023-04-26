import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from 'react-native';
import DrawerComponent from "../components/DrawerComponent";
import HomeStack from "./HomeStack";
import ProximasVacinas from "../screens/ProximasVacinas";

const Drawer = createDrawerNavigator()

const MyDrawer = (props) => {
    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />} screenOptions={{ drawerLabelStyle: { color: '#419ED7', marginLeft: -25 }, headerStyle: { backgroundColor: '#C1E7E3' }, headerTintColor: '#419ED7', unmountOnBlur: true }}>
            <Drawer.Screen name="HomeStack" component={HomeStack} options={{
                drawerIcon: () => <Image source={require('../assets/vacina.png')} style={{ width: 20, height: 20 }} />,
                title: "Minhas vacinas"
            }} />
            <Drawer.Screen name="ProximasVacinas" component={ProximasVacinas} options={{
                drawerIcon: () => <Image source={require('../assets/calendar.png')} style={{ width: 20, height: 20 }} />,
                title: "Próximas vacinas"
            }} />
        </Drawer.Navigator>
    )
}

export default MyDrawer