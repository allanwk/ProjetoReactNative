import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native'

const CustomComponent = (props) => {
    return (
        <DrawerContentScrollView>
            <View>
                <Text style={{ color: 'blue', alignSelf: 'center' }}>beltrano@email.com.br</Text>
            </View>
            <DrawerItemList {...props} />
            <DrawerItem label="Sair" onPress={() => {
                props.navigation.pop()
            }} />
        </DrawerContentScrollView>
    )
}

export default CustomComponent