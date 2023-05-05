let loggedInUserEmail = 'allan';
let nextId = 0;

const users = [
    { email: 'allan', password: '123', vaccines: [], id: 0 }
];

const loginUser = (email, password) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return "E-mail e/ou senha inválidos."
    }
    loggedInUserEmail = user.email;
}

const getUser = (email) => {
    return users.find(user => user.email === email);
}

const updateUser = (updatedUser) => {
    const index = users.findIndex(u => parseInt(u.id) === parseInt(updatedUser.id));
    users[index] = { ...updatedUser };
}

const registerUser = (newUser) => {
    if (users.find(user => user.email === newUser.email)) {
        return "E-mail já utilizado!";
    }
    users.push(newUser);
    loginUser(newUser.email, newUser.password);
}

const logOut = () => {
    loggedInUserEmail = null;
}

const saveVaccine = (vaccine) => {
    if (vaccine.id == null) {
        vaccine.id = nextId;
        nextId += 1;
        users.find(user => user.email === loggedInUserEmail).vaccines.push(vaccine);
    } else {
        const vacinas = users.find(user => user.email === loggedInUserEmail).vaccines;
        const index = vacinas.findIndex(v => parseInt(v.id) === parseInt(vaccine.id));
        vacinas[index] = { ...vaccine };
    }
}

const deleteVaccine = (vaccine_id) => {
    if (vaccine_id != null) {
        const vaccines = users.find(user => user.email === loggedInUserEmail).vaccines;
        const index = vaccines.findIndex(v => parseInt(v.id) === parseInt(vaccine_id));
        if (index !== -1) {
            vaccines.splice(index, 1);
        }
    }
}

const getNextVaccines = () => {
    let vaccines = [...users.find(user => user.email === loggedInUserEmail).vaccines];
    vaccines = vaccines.filter(v => v.proximaVacinacao != null);
    vaccines.sort((a, b) => {
        const date_a = new Date(a.proximaVacinacao.split('/').reverse().join('-') + 'T00:00:00')
        const date_b = new Date(b.proximaVacinacao.split('/').reverse().join('-') + 'T00:00:00')
        if (date_a > date_b) {
            return 1;
        } else if (date_a < date_b) {
            return -1;
        }
        return 0;
    })
    return vaccines;
}

const getVaccines = () => {
    return users.find(user => user.email === loggedInUserEmail).vaccines;
}

const getCurrentUserEmail = () => {
    return loggedInUserEmail;
}

module.exports = { loginUser, saveVaccine, getVaccines, deleteVaccine, getCurrentUserEmail, getNextVaccines, registerUser, logOut, getUser, updateUser };