import NotificationDTO from '../DTO/notificationDTO'
import { sendMessage } from '../firebase'
import { userModel } from '../models/users'

export const sendNotification= async function (notification:NotificationDTO){

const User = await userModel.findById(notification.authorId);
if(!User)
{
    console.log("User Does not exists");
    return;
}
const actionVerb = notification.type == "comment" ? 'commented on' : 'liked';
User.tokenFCM.forEach((FCM)=>{
    sendMessage.send({
        FCM, // Use the current token from the loop
        notification: {
            title: "You have a new notification",
            body: ` ${actionVerb} your post`,
        },
    })
    .then((response: unknown) => {
        console.log("Successfully sent message to", FCM, response);
    })
    .catch((error: unknown) => {
        console.error("Error sending message to", FCM, error);
    });
})
}