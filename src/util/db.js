let loggedInUserEmail = 'allan';
let nextId = 0;

const users = [
    { email: 'allan', password: '123', vaccines: [] }
];

const loginUser = (email, password) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        logged_in_user_email = user.email;
    }
    return user != null;
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

const getVaccines = () => {
    return users.find(user => user.email === loggedInUserEmail).vaccines;
}

module.exports = { loginUser, saveVaccine, getVaccines, deleteVaccine };