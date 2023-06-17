import { View, Text, TextInput, StyleSheet, Image, Modal, BackHandler, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import RadioButtonGroup from '../components/RadioButtonGroup';
import DatePicker from '../components/DatePicker';
import { launchImageLibrary } from 'react-native-image-picker';
import Button from '../components/Button';
import { CommonActions, useNavigation, useNavigationState } from '@react-navigation/native';
import { db, storage } from '../firebase/config';
import { onSnapshot, query, collection, where, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';

import { v4 as uuid } from 'uuid';

export default function Vacina(props) {
    const [dataVacinacao, setDataVacinacao] = useState(new Date());
    const [proximaVacinacao, setProximaVacinacao] = useState(new Date());
    const [nomeVacina, setNomeVacina] = useState("");
    const [image, setImage] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [dose, setDose] = useState(0);
    const [id, setId] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [waitingFirebase, setWaitingFirebase] = useState(false);

    const userId = useSelector(state => state.login.id);
    const vaccineId = useSelector(state => state.vacina.id);
    const navigation = useNavigation();
    const routes = useNavigationState((state) => state.routes);

    function parseLocaleDateString(dateString) {
        return dateString ? new Date(dateString.split('/').reverse().join('-') + 'T00:00:00') : null
    }

    useEffect(() => {
        const consultaDadosVacina = async function () {
            setLoading(true);
            const docRef = doc(db, "vacinas", vaccineId);
            const d = await getDoc(docRef);
            const vacina = d.data();

            setDataVacinacao(vacina.dataVacinacao ? parseLocaleDateString(vacina.dataVacinacao) : new Date());
            setProximaVacinacao(vacina.proximaVacinacao ? parseLocaleDateString(vacina.proximaVacinacao) : new Date());
            setNomeVacina(vacina.nomeVacina);
            setImageId(vacina.imageId);
            setDose(vacina.dose);
            setId(d.id);

            const imageRef = ref(storage, buildImagePath(vacina.imageId));
            const url = await getDownloadURL(imageRef);
            if (url) {
                setImage(url);
            }
            setLoading(false);
        }
        if (vaccineId != null) {
            consultaDadosVacina();
        }
    }, [vaccineId]);

    useEffect(() => {
        const backAction = () => {
            const previousRoute = routes[routes.length - 2];
            if (previousRoute == null || previousRoute.name !== 'Home') {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'ProximasVacinas' },
                        ],
                    })
                );
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

    const validateForm = () => {
        if (!nomeVacina || nomeVacina.length === 0 || dose == null || image == null || dataVacinacao == null || (proximaVacinacao == null && [2, 3].includes(dose))) {
            return setErrorMessage("Preencha todos os campos e anexe uma imagem para salvar a vacina!")
        }
        handleSaveVaccine();
    }

    function buildImagePath(uuid) {
        const firestorageImagesDir = "images/";
        return firestorageImagesDir + uuid;
    }

    async function handleSaveVaccine() {
        if (waitingFirebase) {
            return;
        }

        if (userId == null) {
            console.error("Usuário não logado");
            return;
        }

        const vaccine = {
            dataVacinacao: dataVacinacao ? dataVacinacao.toLocaleDateString('pt-BR') : null,
            proximaVacinacao: proximaVacinacao ? proximaVacinacao.toLocaleDateString('pt-BR') : null,
            nomeVacina,
            imageId,
            dose,
            userId
        }
        //3a. dose ou dose única não tem próxima dose
        if ([2, 3].includes(dose)) {
            delete vaccine.proximaVacinacao;
        }

        try {
            setWaitingFirebase(true);
            if (id == null) {
                vaccine.imageId = uuid();
                await addDoc(collection(db, "vacinas"), vaccine);
            } else {
                await setDoc(doc(db, "vacinas", id), vaccine);
            }
            const imagePath = buildImagePath(vaccine.imageId);
            const imageRef = ref(storage, imagePath);
            const file = await fetch(image);
            const blob = await file.blob();
            await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });
        } catch (e) {
            setWaitingFirebase(false);
            console.error(e);
            return;
        }
        navigateToHome();
        setWaitingFirebase(false);
    }

    function navigateToHome() {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
    }

    async function confirmDeleteVaccine() {
        if (waitingFirebase) {
            return;
        }

        if (id != null) {
            try {
                setWaitingFirebase(true);
                await deleteDoc(doc(db, "vacinas", id))
                if (imageId) {
                    await deleteObject(ref(storage, buildImagePath(imageId)))
                }
                navigateToHome();
            } catch (e) {
                console.error("Erro ao excluir vacina: ", e);
            } finally {
                setWaitingFirebase(false);
            }
        }
    }

    function imagePickerCallback(resp) {
        if (resp && resp.assets && resp.assets.length) {
            setImage(resp.assets[0].uri);
        }
    }

    function onButtonPress() {
        launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        }, imagePickerCallback);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#ADD4D0' }} >
                <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ADD4D0' }}>
            <View style={styles.formContainer}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Data de vacinação</Text>
                    <DatePicker selectedDate={dataVacinacao} setSelectedDate={setDataVacinacao} />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Vacina</Text>
                    <TextInput
                        style={styles.formInput}
                        value={nomeVacina}
                        onChangeText={setNomeVacina}
                    />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text style={styles.formLabel}>Dose</Text>
                    <RadioButtonGroup radioOptions={["1a. dose", "2a. dose", "3a. dose", "Dose única"]} checked={dose} setChecked={setDose} />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Comprovante</Text>
                    <View>
                        <Button text="Selecionar imagem" color='action' onPress={onButtonPress} />
                        {image ? <Image source={{ uri: image }} style={{ width: 250, height: 150 }} /> : null}
                    </View>
                </View>
                {
                    !([2, 3].includes(dose)) ?
                        <View style={styles.formRow}>
                            <Text style={styles.formLabel}>Próxima vacinação</Text>
                            <DatePicker selectedDate={proximaVacinacao} setSelectedDate={setProximaVacinacao} />
                        </View>
                        : null
                }
                {errorMessage ?
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}></Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View> : null
                }
            </View>
            <View style={styles.buttonsContainer}>
                {id != null ?
                    <>
                        <Button color='success' text='Salvar alterações' onPress={validateForm} loading={waitingFirebase} />
                        <Button delete color='danger' text='Excluir' onPress={() => setDeleteDialog(true)} loading={waitingFirebase} />
                    </>
                    :
                    <Button color='success' text='Cadastrar' onPress={validateForm} loading={waitingFirebase} />
                }
            </View>
            <Modal
                visible={deleteDialog}
                animationType='fade'
                transparent={true}
                onRequestClose={() => setDeleteDialog(false)}
            >
                <View style={styles.dialogContainer}>
                    <View style={styles.deleteDialog}>
                        <Text style={styles.deleteDialogText}>Tem certeza que deseja remover essa vacina?</Text>
                        <View style={styles.deleteDialogButtons}>
                            <Button text="SIM" color="danger" onPress={confirmDeleteVaccine} width={110} textStyle={{ width: '100%' }} loading={waitingFirebase} />
                            <Button text="CANCELAR" color="action" onPress={() => setDeleteDialog(false)} width={110} textStyle={{ width: '100%' }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        marginTop: 50
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    formLabel: {
        width: 120,
        marginRight: 20,
        fontSize: 16,
        color: 'white',
        textAlign: 'right',
        fontFamily: 'AveriaLibre-Regular',
    },
    formInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingLeft: 10,
        fontSize: 16,
        backgroundColor: 'white',
        color: '#419ED7',
        fontFamily: 'AveriaLibre-Regular',
    },
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
        padding: 0,
    },
    dialogContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteDialog: {
        width: 300,
        borderColor: '#B9DFDB',
        borderWidth: 2,
        backgroundColor: 'white',
        padding: 10
    },
    deleteDialogText: {
        color: '#FD7979',
        textAlign: 'center',
        fontFamily: 'AveriaLibre-Regular'
    },
    deleteDialogButtons: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20
    },
    errorText: {
        color: '#FD7979',
        fontFamily: 'AveriaLibre-Regular',
        flex: 1
    }
})