import { View, Text, TextInput, StyleSheet, Image, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import DatePicker from '../components/DatePicker';
import RadioButtonGroup from '../components/RadioButtonGroup';
import Button from '../components/Button';
import { registerUser, updateUser } from '../util/db';

export default function Register(props) {
    const [name, setName] = useState("");
    const [sex, setSex] = useState(0);
    const [birthDate, setBirthDate] = useState(new Date());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [id, setId] = useState(null);

    function parseLocaleDateString(dateString) {
        return dateString ? new Date(dateString.split('/').reverse().join('-') + 'T00:00:00') : null
    }

    useEffect(() => {
        const { params } = props.route;
        if (params) {
            setName(params.name);
            setSex(params.sex);
            setBirthDate(params.birthDate ? parseLocaleDateString(params.birthDate) : new Date())
            setEmail(params.email);
            setVaccines(params.vaccines);
            setId(params.id);
        }
    }, [props.route]);

    function register() {
        if (password !== repeatPassword) {
            return setErrorMessage("Senha não confere!");
        }
        const user = { name, sex, birthDate: birthDate ? birthDate.toLocaleDateString('pt-BR') : null, email, password, vaccines };
        let error;
        if (id != null) {
            user.id = id;
            error = updateUser(user);
        } else {
            error = registerUser(user);
        }

        if (error) {
            return setErrorMessage(error);
        }

        id == null ? props.navigation.navigate('Drawer') : props.navigation.navigate('Inicial');
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
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Senha</Text>
                    <TextInput
                        style={styles.formInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Repetir senha</Text>
                    <TextInput
                        style={styles.formInput}
                        value={repeatPassword}
                        onChangeText={setRepeatPassword}
                        secureTextEntry={true}
                    />
                </View>
                {errorMessage ?
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}></Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View> : null
                }
                <Button text="Cadastrar" color="success" onPress={register} />
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        marginTop: 200
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
        textAlign: 'right'
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
        color: '#FD7979'
    }
})