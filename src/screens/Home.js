import { View, Text, TextInput, StyleSheet, Image, FlatList, SafeAreaView } from 'react-native';
import Button from '../components/Button';
import VaccineCard from '../components/VaccineCard';
import { StackActions } from '@react-navigation/native';
import { getVaccines } from '../util/db';
import React, { useState, useEffect } from 'react';

export default function Home(props) {
    const [vaccines, setVaccines] = useState([]);
    const [search, setSearch] = useState(null);

    function navigateToVaccineScreen() {
        props.navigation.navigate('Vacina');
    }

    function openVaccine(vaccine) {
        props.navigation.navigate('Vacina', vaccine)
    }

    useEffect(() => {
        setVaccines(getVaccines());
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#ADD4D0' }}>
            <View style={styles.searchContainer}>
                <Image source={require('../assets/search.png')} style={styles.icon} />
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="PESQUISAR VACINA..."
                    placeholderTextColor="#8B8B8B"
                />
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    columnWrapperStyle={{ flex: 1, justifyContent: 'center' }}
                    style={{ padding: 10 }}
                    numColumns={2}
                    data={vaccines.filter(v => search == null || search.length === 0 || v.nomeVacina.toLowerCase().includes(search.toLowerCase()))}
                    renderItem={({ item }) =>
                        <VaccineCard key={item.id} vaccine={item} onPress={() => openVaccine(item)} />
                    }
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
            <Button style={{ marginBottom: 40 }} color='success' text='Nova vacina' onPress={navigateToVaccineScreen} />
        </View>
    )
}

const styles = StyleSheet.create({
    searchInput: {
        flex: 1,
        color: '#8B8B8B',
        fontFamily: 'AveriaLibre-Regular',
    },
    icon: {
        width: 20,
        aspectRatio: 1,
        opacity: 0.4
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: 'white',
        color: '#419ED7',
        height: 40,
        padding: 0,
    }
})