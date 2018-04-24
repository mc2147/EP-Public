import {getWorkoutDays} from '../../globals/functions';
import {AllWorkouts, ExerciseDict} from '../../data';
import {DaysofWeekDict} from '../../globals/enums';
import {User, Video} from '../../models';
import axios from 'axios';
import bcrypt from 'bcryptjs';
const saltRounds = 10;

function generateSalt(){
    return bcrypt.genSaltSync(saltRounds);
}
function generateHash (password, salt){
    return bcrypt.hashSync(password, salt, null);
}

export async function signupUser(input) {
    var P1 = input.P1;
    var P2 = input.P2;
    var username = input.username;
    var salt = generateSalt();
    if (P1 == P2) {
        var hashedPassword = generateHash(P1, salt);
        var newUser = await User.create({
            // id: 29,
            username: username,
            salt: salt,
            password: hashedPassword,
        });
        if (newUser) {
            return({
                newUser,
                session: {
                    userId: newUser.id,
                    username: username,
                    User: newUser,        
                }
            });
        }
        else {
            return({
                error: true,
                status: "error"
            })
        }
    }
    else {
        return false
    }
}

export async function assignLevel(_User, input) {
    let {squatWeight, benchWeight, RPEExp, bodyWeight} = input; 
    if (squatWeight < benchWeight) {
        _User.level = 1;
    }
    else if (squatWeight > bodyWeight*1.5 && benchWeight > bodyWeight && RPEExp) {
        _User.level = 11;
    }
    else {
        _User.level = 6;
    }
    await _User.save();
}
