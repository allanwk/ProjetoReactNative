import { View, Text, TextInput, StyleSheet, Image, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import DatePicker from '../components/DatePicker';
import RadioButtonGroup from '../components/RadioButtonGroup';
import Button from '../components/Button';
import { registerUser, updateUser } from '../util/db';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth_mod, db } from '../firebase/config'
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUserdata, setUserId } from '../redux/loginSlice';

export default function Register(props) {
    const [name, setName] = useState("");
    const [sex, setSex] = useState(0);
    const [birthDate, setBirthDate] = useState(new Date());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    function parseLocaleDateString(dateString) {
        return dateString ? new Date(dateString.split('/').reverse().join('-') + 'T00:00:00') : null
    }

    const validateForm = () => {
        if (!email || email.length === 0 || !password || password.length === 0 || !birthDate || sex == null || !repeatPassword) {
            return setErrorMessage("Todos os campos são obrigatórios!")
        }
        register();
    }

    async function register() {
        if (loading) {
            return;
        }

        if (password !== repeatPassword) {
            return setErrorMessage("Senha não confere!");
        }
        let creds;
        try {
            setLoading(true);
            creds = await createUserWithEmailAndPassword(auth_mod, email, password);
        } catch (e) {
            setLoading(false);
            console.log("Erro ao registrar usuário: ", e);
            switch (e.code) {
                case 'auth/email-already-in-use':
                    setErrorMessage("E-mail já utilizado");
                    return;
                case 'auth/invalid-email':
                    setErrorMessage('E-mail inválido');
                    return;
                case 'auth/weak-password':
                    setErrorMessage('Senha curta demais');
                    return;
                default:
                    return;
            }
        }

        try {
            const userDataObject = { name, sex, birthDate: birthDate ? birthDate.toLocaleDateString('pt-BR') : null, id: creds.user.uid };
            await addDoc(collection(db, "usuarios"), userDataObject);
        } catch (e) {
            setLoading(false);
            console.log("Erro ao salvar documento do usuário: ", e);
            return;
        }

        dispatch(setUserdata({ name }));
        dispatch(setUserId({ id: creds.user.uid }))
        props.navigation.navigate('Drawer');
        setLoading(false);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ADD4D0' }}>
            <View style={styles.formContainer}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Nome completo</Text>
                    <TextInput
                        style={styles.formInput}
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Data nascimento</Text>
                    <DatePicker selectedDate={birthDate} setSelectedDate={setBirthDate} />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text style={styles.formLabel}>Sexo</Text>
                    <RadioButtonGroup radioOptions={["Masculino", "Feminino"]} checked={sex} setChecked={setSex} />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>E-mail</Text>
                    <TextInput
                        style={styles.formInput}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Senha</Text>
                    <TextInput
                        style={styles.formInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        autoCapitalize='none'
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Repetir senha</Text>
                    <TextInput
                        style={styles.formInput}
                        value={repeatPassword}
                        onChangeText={setRepeatPassword}
                        secureTextEntry={true}
                        autoCapitalize='none'
                    />
                </View>
                {errorMessage ?
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}></Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View> : null
                }
            </View>
            <Button style={{ marginBottom: 40 }} text="Cadastrar" color="success" onPress={validateForm} loading={loading} />
        </View >
    )
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
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
        fontFamily: 'AveriaLibre-Regular'
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
        fontFamily: 'AveriaLibre-Regular'
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
    errorText: {
        color: '#FD7979',
        fontFamily: 'AveriaLibre-Regular'
    }
})