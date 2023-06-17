import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Button from '../components/Button';
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth_mod } from '../firebase/config'

export default function ForgotPassword(props) {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    function validateForm() {
        if (!email || email.length === 0) {
            return setErrorMessage("Preencha o campo e-mail para recuperar a senha!")
        }
        recoverPassword();
    }

    async function recoverPassword() {
        setErrorMessage(null);
        setMessage(null);
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth_mod, email);
            setMessage("E-mail de recuperação enviado!");
        } catch (e) {
            setErrorMessage("Usuário não encontrado");
            console.log("Erro ao enviar email de recuperação de senha: ", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ADD4D0', flexDirection: 'column', justifyContent: 'center' }}>
            <View style={styles.formContainer}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>E-mail</Text>
                    <TextInput
                        style={styles.formInput}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                    />
                </View>
                {errorMessage ?
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}></Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View> : null
                }
                {message ?
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}></Text>
                        <Text style={styles.messageText}>{message}</Text>
                    </View> : null
                }
            </View>
            <Button style={{ marginBottom: 40 }} text="Recuperar senha" color="success" onPress={validateForm} loading={loading} />
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
        color: '#FD7979',
        fontFamily: 'AveriaLibre-Regular'
    },
    messageText: {
        color: '#fff',
        fontFamily: 'AveriaLibre-Regular'
    }
})