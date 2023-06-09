import { TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from "react-native"

export default function Button(props) {
    const color = props.color === 'success' ? '#37BD6D' :
        props.color === 'action' ? '#419ED7' :
            props.color === 'danger' ? '#FD7979' :
                '#B0CCDE'

    const style = {
        backgroundColor: color,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: props.width ? props.width : 'auto',
        marginTop: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        flexDirection: 'row',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignSelf: 'center'
    };

    const defaultButtonTextStyle = {
        textAlign: 'center',
        fontFamily: 'AveriaLibre-Regular',
        color: 'white'
    }

    const handleButtonPress = function () {
        if (!props.loading) {
            props.onPress();
        }
    }

    return (
        <TouchableOpacity onPress={handleButtonPress} style={StyleSheet.compose(style, props.style)}>
            {props.delete ? <Image source={require('../assets/trash.png')} style={{ width: 20, height: 20 }} /> : null}
            {!props.loading ?
                <Text style={StyleSheet.compose(defaultButtonTextStyle, props.textStyle)}>{props.text}</Text>
                :
                <ActivityIndicator color="#fff" />
            }
        </TouchableOpacity>
    )
}