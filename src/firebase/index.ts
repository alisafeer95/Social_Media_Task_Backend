var admin = require("firebase-admin");

import serviceAccount from "../../firebaseconfig.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export const sendMessage = admin.messaging();