

const validatePassword = (password, confirmPassword) => {
    let errors = [];
    if (password !== confirmPassword) {
       errors = errors.concat('Password does not match');
    }
    if (password.length < 6) {
        errors = errors.concat('Password is too short');
    }
    if (password.length > 12) {
        errors = errors.concat('Password is too long');
    }

    return {
        errors,
        valid: errors.length > 0 ? false : true
    }
}
const validateUsername = (username) => {
    let errors = [];
    if (username.length < 4) {
        errors = errors.concat('Username is too short');
    }
    if (username.length > 10) {
        errors = errors.concat('Username is too long');
    }

    return {
        errors,
        valid: errors.length > 0 ? false: true
    }
}
const validateEmail = (email) => {
    let errors = [];
    let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = emailPattern.test(email.trim().toLowerCase());
    if (!isValid) {
        errors = errors.concat('Invalid email'); 
    }
    
    return {
        errors,
        valid: Object.keys(errors).length > 0 ? false : true
    }
}
const signupValidations = userData => {
    let errors = [];

    const emailValidations = validateEmail(userData.email);
    if (!emailValidations.valid) {
        errors = errors.concat(emailValidations.errors);
    }
  
    const usernameValidations = validateUsername(userData.username);
    if (!usernameValidations.valid) {
        errors = errors.concat(usernameValidations.errors);
    }
    
    const passwordValidations = validatePassword(userData.password, userData.confirmPassword);
    if (!passwordValidations.valid) {
        errors = errors.concat(passwordValidations.errors);
    }
    
    return {
        errors,
        valid: errors.length > 0 ? false: true
    }
}

const loginValidations = userData => {
    let errors = [];

    const emailValidations = validateEmail(userData.email);
    if (!emailValidations.valid) {
        errors = errors.concat(emailValidations.errors);
    }

    return {
        errors,
        valid: errors.length > 0 ? false: true
    }
}
module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    signupValidations,
    loginValidations
}