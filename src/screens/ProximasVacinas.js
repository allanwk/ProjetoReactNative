import { View, SafeAreaView, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getNextVaccines } from '../util/db';
import Button from '../components/Button';

export default function ProximasVacinas(props) {
    const [vaccines, setVaccines] = useState([]);

    useEffect(() => {
        setVaccines(getNextVaccines());
    }, []);

    function navigateToVaccineScreen() {
        props.navigation.navigate('HomeStack', { screen: 'Vacina' });
    }

    function openVaccine(vaccine) {
        props.navigation.navigate('HomeStack', { screen: 'Vacina', params: vaccine })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ADD4D0' }}>
            <SafeAreaView style={{ flex: 1, padding: 10 }}>
                <FlatList
                    contentContainerStyle={{ flexDirection: 'column', alignItems: 'center' }}
                    data={vaccines}
                    renderItem={({ item }) =>
                        <TouchableOpacity key={item.id} style={styles.vaccine} onPress={() => openVaccine(item)}>
                            <Text style={styles.vaccineName}>{item.nomeVacina}</Text>
                            <Text style={styles.vaccineDate}>{item.proximaVacinacao}</Text>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
            <Button style={{ marginBottom: 40 }} color='success' text='Nova vacina' onPress={navigateToVaccineScreen} />
        </View>
    )
}

const styles = StyleSheet.create({
    vaccine: {
        maxHeight: 200,
        backgroundColor: 'white',
        minWidth: '100%',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10
    },
    vaccineName: {
        color: '#419ED7',
        fontFamily: 'AveriaLibre-Regular',
        fontSize: 20,
    },
    vaccineDate: {
        color: '#8B8B8B',
        fontFamily: 'AveriaLibre-Regular'
    }
})