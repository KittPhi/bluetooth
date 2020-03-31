var myCharacteristic;

function tempReader() {
  navigator.bluetooth
    .requestDevice({ filters: [{ services: ["health_thermometer"] }] })
    .then(device => device.gatt.connect())

    .then(server => server.getPrimaryService("health_thermometer"))
    .then(service => service.getCharacteristic("temperature_measurement"))
    .then(characteristic => {
      myCharacteristic = characteristic
      return myCharacteristic.startNotifications().then(_ => {
        console.log("Notifications started")
        myCharacteristic.addEventListener(
          "characteristicvaluechanged",
          handleNotifications
        )
      })
    })

    .catch(error => {
      console.log(error)
    })
}

function handleNotifications(event) {
  let value = event.target.value
  let a = []

  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2))
  }
  console.log("> " + a.join(" "))
}

function stopReading() {
  if (myCharacteristic) {
    myCharacteristic
      .stopNotifications()
      .then(_ => {
        console.log("> Notifications stopped")
        myCharacteristic.removeEventListener(
          "characteristicvaluechanged",
          handleNotifications
        )
      })
      .catch(error => {
        console.log("Argh! " + error)
      })
  }
}
