const admin = require('firebase-admin');
const serviceAccount = require("../../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const pushNotification = async (title, body, image, data, tokenReceive) => {
  try {
    if (data.history) data.history = "";
    // if (data.destinationPackage)
    // 	data.destinationPackage = data.destinationPackage.address;
    // if (data.sourcePackage)
    // 	data.sourcePackage = data.sourcePackage.address;
    // console.log('data', data);
    const payload = {
      notification: {
        title,
        body,
        image,
      },
      data,
      android: {
        notification: {
          channel_id: "cnid",
          // sound: "alarm.mp3"
        },
      },
      token: tokenReceive,
      // apns: {
      //   payload: {
      //     aps: {
      //       "mutable-content": 1,
      //     },
      //   },
      //   fcm_options: {
      //     image: "https://foo.bar.pizza-monster.png",
      //   },
      // },
      // webpush: {
      //   headers: {
      //     image: "https://foo.bar.pizza-monster.png",
      //   },
      // },
      // token: tokens[2],
    };
    admin
      .messaging()
      .send(payload)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.error("Error sending message:", error);
      });
  } catch (err) {
    console.log(err);
  }
};

const pushMultipleNotification = async (
  title,
  body,
  image,
  data,
  tokenReceives = []
) => {
  try {
    console.log(data)
    if (data.history) data.history = "";
    const payload = {
      notification: {
        title,
        body,
        image,
      },
      data,
    };
    admin
      .messaging()
      .sendToDevice(tokenReceives, payload)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.error("Error sending message:", error);
      });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { pushNotification, pushMultipleNotification };
