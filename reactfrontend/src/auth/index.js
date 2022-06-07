
export const signup = user => {
    //now we need to make post request to /signup method in the backend
    // we can use axios or fetch
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user) //sending entire user object to the backend
    })
        .then(response => {
            return response.json();
        })
        .catch( error => console.log(error));
}; // end of signup method

export const signin = user => {
    //now we need to make post request to /signin method in the backend
    // we can use axios or fetch
    //console.log(`${process.env.REACT_APP_API_URL}/signin`);
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user) //sending entire user object to the backend
    })
        .then(response => {
            return response.json();
        })
        .catch( error => console.log(error));
}; // end of signin method


//authenticate method
export const authenticate = (data, next) => {
    if(typeof window !== "undefined") //checking browser window in not undefined
    {
        localStorage.setItem("jwt", JSON.stringify(data));
        next(); //moves the middleware to next instruction - moves to else & set redirctTo to true
    }
}; //end of authenticate method

export const signout = (next) => {
    if( typeof window !== "undefined")
        localStorage.removeItem("jwt"); //this will remove the token on the client side
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
        .then(response => {
            console.log('signout' ,response);
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of signout method


//method is authenticated
export const isAuthenticated = () => {

    if(typeof window == "undefined")
        return false;
    if(localStorage.getItem("jwt"))
        return JSON.parse(localStorage.getItem("jwt"));
    else
        return false;

};

//forgot-password and reset-password methods to invoke back end api calls
export const forgotPassword = email => {
    //console.log("email: ", email);
    return fetch(`${process.env.REACT_APP_API_URL}/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
}; //end of forgotPassword method

export const resetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
}; // end of resetPassword method

//socialLogin method
export const socialLogin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/social-login/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
        .then(response => {
            console.log("signin response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
}; // end of socialLogin method
