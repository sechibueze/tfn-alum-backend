const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signupValidations, loginValidations, validateEmail, validateUsername, validatePassword } = require('../validations/auth');

module.exports = {
    Query: {
        getUsers: () => {
            return User.find({})
        },
        getUserById: (_, {id}) => {
            return User.findById(id)
        },
        getUserByAuth: (parent, args, context) => {
            const currentUserId = context.currentUser.id;
            console.log('con', context, currentUserId)
            return User.findById(currentUserId)
        } 
    },
    Mutation: {
        signup: async (_, {username, email, password, confirmPassword}) => {
            // Validate inputs
            const userData = {username, email, password, confirmPassword };
            const {errors, valid } = signupValidations(userData);
          
            if (!valid) {
                throw new Error(errors)
            }

            // Confirm users existence
            const user = await User.findOne({ email });
          
            if (user) {
                throw new Error('User already exists')
            }

            // Hash password
            const hash = await bcrypt.hash(password, 12);
            // save to DB
            let newUser = new User({ email, username, password: hash });

            newUser.save();
            
            // Generate JWT
            const token = await jwt.sign({ 
                id: newUser._id, 
                username: newUser.username
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn : 60*60*2}
            )
            
            return {
                token
            };
        },
        login: async (_, { email, password }) => {
            // Validate inputs
            const userData = { email, password };
            const {errors, valid } = loginValidations(userData);
          
            if (!valid) {
                throw new Error(errors)
            }

            // Confirm user has an account
            const user = await User.findOne({ email });
          
            if (!user) {
                throw new Error('Account does not exist')
            }

            // Compare password
            const isMatch = await bcrypt.compareSync(password, user.password);
            console.info('m', isMatch )
            if(!isMatch) throw new Error('Invalid credentioals');

            
            // Generate JWT
            const token = await jwt.sign({ 
                id: user._id, 
                username: user.username
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn : 60*60*2}
            )
            
            return {
                token
            };
        },
        updateUserById: async (_, { userData: { id, email, password, username }} , context) => {
            let errors = []; let valid = true;
            const { errors: emailErrors, valid: isValidEmail} = validateEmail(email);
            const { errors: passwordErrors, valid: isValidPassword} = validatePassword(password);
            const { errors: usernameErrors, valid: isValidUsername} = validateUsername(username);
            if(!isValidEmail || !isValidPassword || !isValidUsername){
                valid = false;
                errors = errors.concat(emailErrors).concat(usernameErrors).concat(passwordErrors);
            }
            if(!valid) throw new Error(errors)

            if(!context.currentUser || !context.currentUser.id) return { status: false, error: 'Unauthenticated'}
            // User is logged in
            const authUserId = context.currentUser.id;
            const user = await User.findById(authUserId);
            
            if(!user) return { status: false, error: 'User not found'}

            if(email) user.email = email;
            if(username) user.username = username;
            
            if(password) {
                // Validate Password
                const { errors, valid } = validatePassword(password);
                if(!valid) throw new Error('Invalid password ', { errors })
                // Hash password
                const hash = await bcrypt.hash(password, 12);
                user.password = hash;
            }

            const _user = await user.save()

            return {
                status: true,
                message: 'User updated',
                data: _user
            }


        },
        removeUser: async (_, {id}, context) => {
            if(!context.currentUser || !context.currentUser.id) return { status: false, error: 'UnAuth'}
            
            const user = await User.findById(id);
            const _user = await user.remove();
            return {
                status: true,
                message: 'User gone',
                data: _user.id
            }
        }
        
    }
}