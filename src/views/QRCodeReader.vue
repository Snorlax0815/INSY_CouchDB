<template>
  <div>
    <h1>QR Code Reader</h1>
    <p>Scan a QR code to get started</p>
    <div>
      <qrcode-stream
          @decode="onDecode"
          @init="onInit"
          @detect="onDetect"
      ></qrcode-stream>
    </div>
    <div v-for="output in result">
      <p>output</p>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
  data() {
    return {
      result: []
    }
  },
  components: {
    QrcodeStream
  },
  methods: {
    onDecode(content) {
      console.log('Scanned content:', content)
      alert(content)
    },
    onInit(promise) {
      promise.then(() => {
        console.log('Camera access was granted')
      }).catch(error => {
        console.error('Camera access was denied', error)
      })
    },
    onDetect(result) {
      console.log('QR code detected:', result)
      this.result.push(JSON.stringify(result))
      alert(JSON.stringify(result[0].rawValue))
    }
  },

}
</script>

<style scoped>

</style>