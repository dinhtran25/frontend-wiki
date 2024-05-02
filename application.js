/**
 * application.js - JavaScript file to communicate with backend of this application
 * 
 * Copyright (C) 2024 CyberDay Studios. All right reserved
 */

/**
 * Here is the server configurations
 * 
 * Please adjust them with your server system
 */
var serverName = "127.0.0.1";
var portServer = "8080";

/**
 * Actually code here. DO NOT EDIT
 */
const fullServer = `http://${serverName}:${portServer}`;

//
// PRIVATE FUNCTION SECTION
// DO NOT USE. USE PUBLIC FUNCTION SECTION IN YOUR HTML INSTEAD
//

/**
 * Make 'GET' request
 */
async function getRequest(endpoint, queryParams = {}) {
    try {
        // Construct URL with query parameters if queryParams is provided
        let url_request = `${fullServer}${endpoint}`;
        if (Object.keys(queryParams).length > 0) {
            const url = new URL(url_request);
            Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
            url_request = url.toString();
        }

        const response = await fetch(url_request);

        if (!response || !response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

//
// ===================================
// END PRIVATE FUNCTION SECTION
// ===================================

// PUBLIC FUNCTION SECTION
// USE THESE FUNCTIONS FROM HERE!!!
//

/**
 * API_index() - Check the API if API is working
 * 
 * @param None
 * @description Check the API if API is working or not
 * 
 * @return Boolean: True if API is working; False if API isn't working
 */

const API_index = async () => {
    const endpoint = "/api";

    try {
        const responseData = await getRequest(endpoint);

        if (responseData == null) {
            throw new Error("Backend cannot be reached: null of response");
        } else {
            console.log("API endpoint reached.");
            const { message, value, statusCode } = responseData;

            if (message == "status" && value == "working" && statusCode == "200") {
                console.log("API endpoint reached successfully");
                return true;
            } else {
                throw new Error("API endpoint reached with error: ", responseData);
            }
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return false;
    }
}

/**
 * API_status_non_details() - Show the server resources and server pressure that measured in simple form
 * 
 * @param None
 * @description Show the server resources measured in simple form
 * 
 * @return String: Return the server pressure state: 'minimal', 'normal', 'medium' and 'high'
 */
const API_status_non_details = async () => {
    const endpoint = "/api/status";

    try {
        const responseData = await getRequest(endpoint);

        if (responseData == null) {
            console.warn("Backend server have an occurred error and cannot be measured");
        } else {
            console.log("Backend server reached and server resources is measuread.");

            const { message, value, statusCode } = responseData;

            if (message == "server_pressure_status" && statusCode == "200") {
                if (value != null) {
                    console.log(`Server pressure status: ${value}`);
                    return value;
                } else {
                    console.error("Something went wrong when measuring backend server");

                    return "";
                }
            } else {
                console.error("Something went wrong. Response: ", responseData);

                return "";
            }
        }
    } catch (error) {
        console.error(`Error: ${error}`);

        return "";
    }
}

/**
 * API_status_with_details() - Show the server resources and server pressure that measured in advanced form
 * 
 * @param None
 * @description Show the server resources measured in advanced form
 * 
 * @return String: Return the server pressure state: 'minimal', 'normal', 'medium' and 'high'
 */
const API_status_with_details = async () => {
    const endpoint = "/api/status";
    const queryParams = { details: "true" };

    try {
        const responseData = await getRequest(endpoint, queryParams);

        if (responseData == null) {
            console.warn("Backend server have an occurred error and cannot be measured");
        } else {
            console.log("Backend server reached and server resources in details mode is measuread.");

            const { message, value, statusCode } = responseData;

            if (message == "server_pressure_status_details" && statusCode == "200") {
                if (value != null) {
                    console.log(`Server pressure details: ${value}`);
                    return value;
                } else {
                    console.error("Something went wrong when measuring backend server");

                    return "";
                }
            } else {
                console.error("Something went wrong. Response: ", responseData);

                return "";
            }
        }
    } catch (error) {
        console.error(`Error: ${error}`);

        return "";
    }
}

/**
 * API_status() - Show the server resources and server pressure that measured in advanced form
 * 
 * @param {boolean}: triggers return details server resources and server pressure
 *                           or not
 * @description Show the server resources measured in advanced form
 * 
 * @return {Promise<string>}: Return the server pressure state: 'minimal', 'normal', 'medium' and 'high'
 */

const API_status = async (details) => {
    if (!details) {
        API_status_non_details();
    } else {
        API_status_with_details();
    }
}

/**
 * getCookie() - Get saved cookie
 * 
 * @param {String}: Name
 * 
 * @return {String}: cookie
 */

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length == 2) {
        return parts.pop().split(';').shift();
    }
    else {
        return null;
    }
}

/**
 * API_get_login_status() - Get login status
 * 
 * @param None
 * 
 * @return {boolean}
 */

const API_get_login_status = async() => {
    return getCookie("access_token") == null;
}

/**
 * API_register() - Register a new user
 * 
 * @param {String}: Username, password, fullname, email, permission
 * 
 * @return None
 */

const API_register = async (user, pass, full_name, user_email) => {
    const endpoint = "/api/register";
    const queryParams = { username: user, password: pass, fullname: full_name, email: user_email };

    try {
        const responseData = getRequest(endpoint, queryParams);

        try {
            const { status, statusCode } = responseData;

            if (status == "succeeded" && statusCode == 200) {
                alert("Register completed. Now you can use the credentials to login");
                window.location.href = "/login";
            }
        } catch {
            const { errorCode, errorDetails } = responseData;

            alert(`(${errorCode}) Cannot register with error: ${errorDetails}`);
        }
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
}

/**
 * API_getCurrentUser() - Get details of the current user
 * 
 * @param {String}: access_token
 * 
 * @return None
 */
const API_getCurrentUser = async (access_token) => {
    const endpoint = "/api/get_current_user";
    const queryParams = { access_token: access_token };

    try {
        var responseData = await getRequest(endpoint, queryParams);

        try {
            const { email, permission, id, status, username, fullname } = responseData;

            if (status == "false") {
                return {
                    email,
                    permission,
                    id,
                    status,
                    username,
                    fullname
                };
            } else {
                return null;
            }
        } catch {
            const { errorCode, errorDetails } = responseData;

            alert(`${errorDetails}.\n\nError code: ${errorCode}`);

            return null;
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

/**
 * API_login() - Login user
 * 
 * @param {String, String}: Username and Password
 * 
 * @description: Login the user
 */
const API_login = async (user, pass) => {
    const endpoint = "/api/login";
    var queryParams = { username: user, password: pass };

    if (username == null || password == null) {
        alert("Username and Password must not be null. Please fill all the fields and try again");
    } else {
        try {
            var responseData = await getRequest(endpoint, queryParams);

            try {
                var { error, statusCode, accessToken } = responseData;

                if (error != null || statusCode != 200) {
                    alert("Login failed because the server doesn't responding. Please try again");
                    return;
                } else {
                    document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60};`;
                    
                    API_getCurrentUser(accessToken)
                        .then(userDetails => {
                            if (userDetails) {
                                console.log(`User details: ${JSON.stringify(userDetails)}`);
                            } else {
                                alert(`An error occured or no user details were returned`);
                                window.location.href = "/login";
                            }
                        })
                        .catch(error => {
                            alert(`Error when login. You will be logged out.`);
                            window.location.href = "/login";
                        });
                }
            } catch {
                const { errorCode, errorDetails } = responseData;

                alert(`(${errorCode}) Login failed. Reason: ${errorDetails}`);
            }
        } catch (error) {
            alert(`Login failed. Error: ${error}`);
        }
    }
}