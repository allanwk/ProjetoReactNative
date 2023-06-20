import { View, SafeAreaView, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { storage, db } from '../firebase/config';
import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useSelector, useDispatch } from 'react-redux';
import { setId } from '../redux/vacinaSlice';

export default function ProximasVacinas(props) {
    const [vaccines, setVaccines] = useState([]);
    const dispatch = useDispatch();

    const userId = useSelector(state => state.login.id);
    const today = new Date().setHours(0, 0, 0, 0);
    const q = query(collection(db, "vacinas"), where("userId", "==", userId));
    useEffect(() => {
        onSnapshot(q, async (result) => {
            const nextVaccines = result.docs.filter(doc => {
                const { proximaVacinacao } = doc.data();
                if (!proximaVacinacao) {
                    return false;
                }
                const proximaVacinacaoDate = new Date(proximaVacinacao.split('/').reverse().join('-') + 'T00:00:00')
                return proximaVacinacaoDate >= today;
            })

            const processedVaccines = nextVaccines.map((doc) => {
                const v = { ...doc.data(), id: doc.id };
                return v;
            });

            processedVaccines.sort((a, b) => {
                const date_a = new Date(a.proximaVacinacao.split('/').reverse().join('-') + 'T00:00:00')
                const date_b = new Date(b.proximaVacinacao.split('/').reverse().join('-') + 'T00:00:00')
                if (date_a > date_b) {
                    return 1;
                } else if (date_a < date_b) {
                    return -1;
                }
                return 0;
            })
            setVaccines(processedVaccines);
        })
    }, []);

    function navigateToVaccineScreen() {
        props.navigation.navigate('HomeStack', { screen: 'Vacina' });
    }

    function openVaccine(vaccine) {
        dispatch(setId({ id: vaccine.id }))
        props.navigation.navigate('HomeStack', { screen: 'Vacina' })
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