

export const read = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/getSingleUser/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of read method

export const update = (userId, token, user) => {
    //console.log(user);
    return fetch(`${process.env.REACT_APP_API_URL}/updateUser/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json", //make sure we don't put Content-Type as this is form data
            Authorization: `Bearer ${token}`
        },
        body: user  //form is already key value pair, no need to json stringify

    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of update method


export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/getAllUsers`, {
        method: "GET",
        //we don't need headers or authorization as anyone can see all users' profile
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
};

//apply necessary headers and params by looking at already implemented postman deleteUser back end call
export const remove = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of read method

export const updateUser = (user, next) => {
    if(typeof window !== "undefined") {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt')); //jwt contains token,user
            auth.user = user; //updating user
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
}; // end of updateUser method

//follow method -- same signature as callApi method in Profile.js
export const follow = (userId, token, followId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, followId})
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of follow method

export const unfollow = (userId, token, unfollowId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, unfollowId})
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of unfollow method

export const findPeople = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/findPeople/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of findPeople method


//methods related to messaging

export const getMessages = (user1, user2,token) => {
    console.log("get all the messages exchanged between the two user",user1,user2)

    return fetch(`${process.env.REACT_APP_API_URL}/user/conversation/message/${user1}/${user2}`, {
        method: "GET",
        headers:{
            Accept: "application/json",
            "Content-type":"application/json",
            Authorization: `Bearer ${token}`
        },

    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getConversations = (userId,token) => {
    console.log("Fetch all the conversation of the user",userId)

    return fetch(`${process.env.REACT_APP_API_URL}/user/conversation/${userId}`, {
        method: "GET",
        headers:{
            Accept: "application/json",
            "Content-type":"application/json",
            Authorization: `Bearer ${token}`
        },

    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const sendMessage  = (userId,fromUser,newMessage,token) => {
    console.log("Send the new message ",userId)

    return fetch(`${process.env.REACT_APP_API_URL}/user/message/${userId}`, {
        method: "POST",
        headers:{
            Accept: "application/json",
            "Content-type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({fromUser,newMessage})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

