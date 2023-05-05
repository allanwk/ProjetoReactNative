import React, { useState } from 'react';
import {
    View,
    ImageBackground,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import { loginUser } from '../util/db.js';
import Button from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';

export default function Inicial(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleLogin = () => {
        const error = loginUser(email, password);
        if (error) {
            return setErrorMessage(error);
        }
        props.navigation.navigate("Drawer");
    }

    const navigateToRegister = () => {
        props.navigation.navigate("Register");
    }

    const navigateToForgotPassword = () => {
        props.navigation.navigate("ForgotPassword");
    }

    return (
        <ImageBackground source={require('../assets/background.jpg')} style={{ flex: 1 }}>
            <LinearGradient
                style={{ flex: 1 }}
                colors={['rgba(84, 131, 126, 0.2)', 'rgba(255, 255, 255, 0.62)', 'rgba(221, 230, 229, 0.68)', 'rgba(59, 94, 90, 0.51)']}
                locations={[0.0028, 0.0989, 0.3541, 1.0065]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                angle={180}
            >
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: 20 }}>
                    <Text style={styles.logoText}>
                        <Image source={require('../assets/vacina.png')} style={styles.icon} />
                        MyHealth
                    </Text>
                    <View>
                        <Text style={styles.subText}>Controle as suas vacinas e fique seguro</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <View style={styles.formRow}>
                            <Text style={styles.formLabel}>E-mail</Text>
                            <TextInput
                                style={styles.formInput}
                                onChangeText={handleEmailChange}
                                value={email}
                                autoCapitalize='none'
                                autoComplete='email'
                            />
                        </View>
                        <View style={styles.formRow}>
                            <Text style={styles.formLabel}>Senha</Text>
                            <TextInput
                                style={styles.formInput}
                                onChangeText={handlePasswordChange}
                                value={password}
                                secureTextEntry={true}
                            />
                        </View>
                        {errorMessage ?
                            <View style={styles.formRow}>
                                <Text style={styles.formLabel}></Text>
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View> : null
                        }
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button color='success' text='Entrar' onPress={handleLogin} />
                        <Button color='action' text='Criar minha conta' onPress={navigateToRegister} />
                        <Button text='Esqueci minha senha' onPress={navigateToForgotPassword} />
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    logoText: {
        color: '#419ED7',
        fontFamily: 'Averia Libre',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: 50,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    icon: {
        width: 50,
        height: 50,
    },
    subText: {
        color: '#419ED7',
        fontFamily: 'Averia Libre',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: 25,
        textAlign: 'center'
    },
    formContainer: {
        padding: 20,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    formLabel: {
        width: 80,
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
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexBasis: '30%',
        justifyContent: 'space-around'
    },
    loginButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    registerButton: {
        backgroundColor: '#419ED7',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    resetPasswordButton: {
        backgroundColor: '#B0CCDE',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    errorText: {
        color: '#FD7979'
    }
});