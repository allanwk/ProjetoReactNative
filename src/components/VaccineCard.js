import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

export default function VaccineCard(props) {
    let avisoProximaDose = 'Não há próxima dose';
    if (props.vaccine.proximaVacinacao) {
        avisoProximaDose = 'Próxima dose em: ' + props.vaccine.proximaVacinacao;
    }

    return (
        <TouchableOpacity style={styles.card} onPress={props.onPress}>
            <Text style={styles.title}>{props.vaccine.nomeVacina}</Text>
            <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                <Text style={styles.dose}>{["1a. dose", "2a. dose", "3a. dose", "Dose única"][props.vaccine.dose]}</Text>
            </View>
            <Text style={styles.date}>{props.vaccine.dataVacinacao}</Text>
            {props.vaccine && props.vaccine.image ? <Image style={{ width: '90%', height: 100 }} source={{ uri: props.vaccine.image }} /> : null}
            <Text style={styles.nextDoseWarning}>{avisoProximaDose}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        maxWidth: '50%',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5
    },
    title: {
        color: '#3F92C5',
        textAlign: 'center',
        fontWeight: 400,
        fontSize: 24,
        fontFamily: 'AveriaLibre-Regular',
    },
    dose: {
        color: 'white',
        backgroundColor: '#3F92C5',
        textAlign: 'center',
        fontWeight: 400,
        fontSize: 13,
        padding: 5,
        fontFamily: 'AveriaLibre-Regular',
    },
    date: {
        color: '#8B8B8B',
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'AveriaLibre-Regular',
    },
    nextDoseWarning: {
        fontSize: 11,
        color: '#FD7979',
        fontFamily: 'AveriaLibre-Regular',
    }
})