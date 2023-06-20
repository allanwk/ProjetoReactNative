import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native'
import { getCurrentUserName, logOut } from '../util/db';
import { StackActions, CommonActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setUserId } from '../redux/loginSlice';
import { setId } from '../redux/vacinaSlice';

const CustomComponent = (props) => {
    const dispatch = useDispatch();
    function navigateToLogin() {
        props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [
                { name: 'Inicial' }
            ]
        }))
    }

    function handleLogout() {
        dispatch(setUserId({ id: null }));
        dispatch(setId({ id: null }));
        navigateToLogin();
    }
    const name = useSelector(state => state.login.name);

    return (
        <DrawerContentScrollView style={styles.drawer}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#419ED7', alignSelf: 'center', marginTop: 50, fontFamily: 'AveriaLibre-Regular', fontSize: 20 }}>{"Olá " + name}</Text>
                <View style={styles.separator} />
            </View>
            <DrawerItemList {...props} labelStyle={{ fontSize: 20 }} />
            <DrawerItem label="Sair" onPress={handleLogout}
                icon={() => <Image source={require('../assets/sair.png')} style={{ width: 20, height: 20 }} />}
                labelStyle={{ marginLeft: -25, color: '#419ED7', fontFamily: 'AveriaLibre-Regular', fontSize: 20 }}
            />
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#ADD4D0',

    },
    separator: {
        width: '70%',
        height: 2,
        backgroundColor: '#419ED7',
        marginVertical: 10,
    }
})

export default CustomComponent