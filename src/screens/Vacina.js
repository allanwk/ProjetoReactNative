import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import RadioButtonGroup from '../components/RadioButtonGroup';
import DatePicker from '../components/DatePicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { saveVaccine } from '../util/db';
import Button from '../components/Button';
import { CommonActions } from '@react-navigation/native';

export default function Vacina(props) {
    const [dataVacinacao, setDataVacinacao] = useState(new Date());
    const [proximaVacinacao, setProximaVacinacao] = useState(new Date());
    const [nomeVacina, setNomeVacina] = useState("");
    const [image, setImage] = useState(null);
    const [dose, setDose] = useState(null);
    const [id, setId] = useState(null);

    function parseLocaleDateString(dateString) {
        return dateString ? new Date(dateString.split('/').reverse().join('-') + 'T00:00:00') : null
    }

    useEffect(() => {
        const { params } = props.route;
        if (params) {
            setDataVacinacao(parseLocaleDateString(params.dataVacinacao));
            setProximaVacinacao(parseLocaleDateString(params.proximaVacinacao));
            setNomeVacina(params.nomeVacina);
            setImage(params.image);
            setDose(params.dose);
            setId(params.id);
        }
    }, [props.route]);

    function handleSaveVaccine() {
        const vaccine = {
            dataVacinacao: dataVacinacao.toLocaleDateString('pt-BR'),
            proximaVacinacao: proximaVacinacao.toLocaleDateString('pt-BR'),
            nomeVacina,
            image,
            dose
        }
        //3a. dose ou dose única não tem próxima dose
        if ([2, 3].includes(dose)) {
            delete vaccine.proximaVacinacao;
        }

        if (id != null) {
            vaccine.id = id;
        }

        saveVaccine(vaccine);
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
    }

    function callback(resp) {
        if (resp && resp.assets && resp.assets.length) {
            setImage(resp.assets[0].uri);
        }
    }

    function onButtonPress() {
        launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        }, callback);
    };

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
            </View>
            <View style={styles.buttonsContainer}>
                {id != null ?
                    <>
                        <Button color='success' text='Salvar alterações' onPress={handleSaveVaccine} />
                        <Button color='danger' text='Excluir' />
                    </>
                    :
                    <Button color='success' text='Cadastrar' onPress={handleSaveVaccine} />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
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
    },
    formInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingLeft: 10,
        fontSize: 16,
        backgroundColor: 'white',
        color: '#419ED7'
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
    }
})