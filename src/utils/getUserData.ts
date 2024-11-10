type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};

function getUserData(): User {
    const userData = localStorage.getItem("user_data");
    if (userData == null) {
        return {} as User;
    }
    const userDataObject = JSON.parse(userData);
    return userDataObject;
}

export default getUserData;