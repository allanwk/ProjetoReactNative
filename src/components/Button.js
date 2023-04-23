import { TouchableOpacity, Text } from "react-native"

export default function Button(props) {
    const color = props.color === 'success' ? '#37BD6D' :
        props.color === 'action' ? '#419ED7' :
            props.color === 'danger' ? '#FD7979' :
                '#B0CCDE'

    return (
        <TouchableOpacity onPress={props.onPress} style={{
            backgroundColor: color,
            paddingVertical: 10,
            paddingHorizontal: 20
        }}>
            <Text style={{ textAlign: 'center' }}>{props.text}</Text>
        </TouchableOpacity>
    )
}