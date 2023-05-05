import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import React, { useState } from 'react';

export default function RadioButtonGroup(props) {
    return props.radioOptions.map((data, key) => {
        return (
            <View key={key}>
                {props.checked == key ?
                    <TouchableOpacity style={styles.btn}>
                        <Image style={styles.img} source={require("../assets/radio_selecionado.png")} />
                        <Text style={{ fontFamily: 'AveriaLibre-Regular' }}>{data}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => { props.setChecked(key) }} style={styles.btn}>
                        <Image style={styles.img} source={require("../assets/radio_vazio.png")} />
                        <Text style={{ fontFamily: 'AveriaLibre-Regular' }}>{data}</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    })
}

const styles = StyleSheet.create({
    img: {
        height: 20,
        width: 20
    },
    btn: {
        flexDirection: 'row'
    }
});