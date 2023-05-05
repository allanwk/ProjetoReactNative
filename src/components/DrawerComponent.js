import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native'
import { getCurrentUserEmail, logOut } from '../util/db';
import { StackActions, CommonActions } from '@react-navigation/native';

const CustomComponent = (props) => {
    function currentUserName() {
        return getCurrentUserEmail() ? getCurrentUserEmail().split(".")[0] : null;
    }

    function navigateToLogin() {
        props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [
                { name: 'Inicial' }
            ]
        }))
    }

    return (
        <DrawerContentScrollView style={styles.drawer}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#419ED7', alignSelf: 'center', marginTop: 50 }}>{"Olá " + currentUserName()}</Text>
                <View style={styles.separator} />
            </View>
            <DrawerItemList {...props} />
            <DrawerItem label="Sair" onPress={() => {
                logOut();
                navigateToLogin();
            }}
                icon={() => <Image source={require('../assets/sair.png')} style={{ width: 20, height: 20 }} />}
                labelStyle={{ marginLeft: -25, color: '#419ED7' }}
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