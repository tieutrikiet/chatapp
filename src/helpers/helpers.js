import { auth, database } from '../configs/firebase'

export const saveUserToDB = (userInfo) => {
    if (userInfo) {
        const email = convert(userInfo.email);
        if (email) {
            database.ref('users/' + email).update({
                email: userInfo.email,
                photoURL: userInfo.photoURL,
                displayName: userInfo.displayName,
                lastLogin: convertToTimestamp(userInfo.metadata.lastSignInTime),
                uid: userInfo.uid
            });
            return true;
        }

        return false;
    }

    return false;
}

export const saveNewEmail = (email)=> {
    if (email) {
        getUser(email).then((res) => {
            const userFromEmail = res;
            if (userFromEmail) {
            }
            else {
                const newEmail = convert(email);
                if (newEmail) {
                    database.ref('users/' + newEmail).set({
                        email: email,
                        photoURL: "https://iupac.org/cms/wp-content/uploads/2018/05/default-avatar.png",
                        displayName: email,
                        lastLogin: convertToTimestampFromNow(),
                        uid: null
                    });

                    const myEmail = auth.currentUser ? auth.currentUser.email : null;
                    if (myEmail) {
                        greetNewFriend(myEmail, email);
                    }
                }
            }
        });
    }
}

function greetNewFriend(fromEmail, toEmail) {
    if (fromEmail && toEmail) {
        const timeInterval = convertToTimestampFromNow();
        const newConversation = database.ref('conversations').push();
        newConversation.push({
            email: fromEmail,
            content: "Hi!",
            timestamp: timeInterval
        });

        const userEmail = convert(fromEmail);
        const friendEmail = convert(toEmail);
        if (userEmail && friendEmail) {
            database.ref('users').child(userEmail).child('conversations').child(friendEmail).set({
                conversationID: newConversation.key,
                timestamp: timeInterval
            })

            database.ref('users').child(friendEmail).child('conversations').child(userEmail).set({
                conversationID: newConversation.key,
                timestamp: timeInterval
            })
        }
        
    }
}

export const sendMessage = (fromEmail, toEmail, withContent) => {
    if (fromEmail && toEmail && withContent) {
        getConversationID(fromEmail, toEmail).then((res)=>{
            const conversationID = res;
            const timeInterval = convertToTimestampFromNow();
            database.ref('conversations').child(conversationID).push({
                email: fromEmail,
                content: withContent,
                timestamp: timeInterval
            })

            const myEmail = convert(fromEmail);
            const friendEmail = convert(toEmail);
            if (myEmail && friendEmail){
                database.ref('users').child(myEmail).child('conversations').child(friendEmail).update({
                    timestamp: timeInterval
                })

                database.ref('users').child(friendEmail).child('conversations').child(myEmail).update({
                    timestamp: timeInterval
                })
            }
        });       
    }
}

function getConversationID(fromEmail, toEmail) {
    if (fromEmail && toEmail) {
        const myEmail = convert(fromEmail);
        const friendEmail = convert(toEmail);
        if (myEmail && friendEmail) {
            return database.ref('users/' + myEmail).child('conversations').child(friendEmail).child('conversationID').once('value').then((snapshot)=>{
                return snapshot.val();
            }, (error)=>{
                console.log({conversationIDError:error});
                return null;
            });
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

export const getUser = (fromEmail) => {
    if (fromEmail) {
        const email = convert(fromEmail);
        if (email) {
            return database.ref('users/' + email).once('value').then(function (snapshot) {
                return snapshot.val();
            }, function (error) {
                console.log({ error });
                return null;
            });
        }
        return null;
    }

    return null;
}

export const convert = (email) => {
    if (email) {
        let result = email.replace(/\./g, '-');
        result = result.replace(/@/g, '-');
        return result;
    }

    return null;
}

function convertToTimestamp(fromString) {
    const date = new Date(fromString);
    return date.getTime();
}

function convertToTimestampFromNow() {
    const date = new Date();
    return date.getTime();
}

export const convertTimestampToDate = (timestamp) => {
    const now = convertToTimestampFromNow();
    const res = parseInt((now - timestamp)/1000);

    if (res < 60) {
        return res + "s ago";
    }

    if (res < 3600) {
        const minutes = res / 60;
        return parseInt(minutes) + "m ago";
    }

    if (res < 86400) {
        const hours = res / 3600;
        return parseInt(hours) + "h ago";
    }

    const days = res / 86400;
    return parseInt(days) + "d ago";
}