import { View, Text, TextInput, StyleSheet, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import Button from '../components/Button';
import VaccineCard from '../components/VaccineCard';
import { StackActions } from '@react-navigation/native';
import { getVaccines } from '../util/db';
import React, { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { db, storage } from '../firebase/config'
import { useSelector, useDispatch } from 'react-redux';
import { setId } from '../redux/vacinaSlice';
import { getDownloadURL, ref } from 'firebase/storage';

export default function Home(props) {
    const [vaccines, setVaccines] = useState([]);
    const [search, setSearch] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    function navigateToVaccineScreen() {
        dispatch(setId({ id: null }))
        props.navigation.navigate('Vacina');
    }

    function openVaccine(vaccine) {
        dispatch(setId({ id: vaccine.id }))
        props.navigation.navigate('Vacina')
    }

    function buildImagePath(uuid) {
        const firestorageImagesDir = "images/";
        return firestorageImagesDir + uuid;
    }

    const userId = useSelector(state => state.login.id);
    const q = query(collection(db, "vacinas"), where("userId", "==", userId));
    useEffect(() => {
        onSnapshot(q, async (result) => {
            setLoading(true);
            const processedVaccines = await Promise.all(result.docs.map(async (doc) => {
                const v = { ...doc.data(), id: doc.id };
                if (v.imageId != null) {
                    try {
                        const imageRef = ref(storage, buildImagePath(v.imageId));
                        const imageURL = await getDownloadURL(imageRef);
                        v.image = imageURL;
                    } catch (e) {
                        console.log("Erro ao obter imagem da vacina: ", e);
                    }
                }
                return v;
            }));
            setVaccines(processedVaccines);
            setLoading(false);
        })
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#ADD4D0' }}>
            {!loading ?
                <>
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
                </>
                :
                <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
            }
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