import { TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePicker(props) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShowDatePicker(true)}>
            <TextInput
                style={styles.dateInput}
                editable={false}
                value={props.selectedDate ? props.selectedDate.toLocaleDateString('pt-BR') : ""}
            />
            <Image source={require('../assets/calendar.png')} style={styles.icon} />
            {showDatePicker && (
                <DateTimePicker
                    value={props.selectedDate}
                    mode={'date'}
                    display={'default'}
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) {
                            props.setSelectedDate(date);
                        }
                    }}
                />
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
        opacity: 0.4,
    },
    datePickerContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: 'white',
        color: '#419ED7',
        height: 40,
        paddingHorizontal: 10,
    },
    dateInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#419ED7',
        fontFamily: 'AveriaLibre-Regular'
    },
})