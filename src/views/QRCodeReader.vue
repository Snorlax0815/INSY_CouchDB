<template>
  <div>
    <h1>QR Code Reader</h1>
    <p>Scan a QR code to get started</p>
    <div>
      <qrcode-stream
          @decode="onDecode"
          @init="onInit"
          @detect="onDetect"
          style="width: 100%; height: 500px;"
      ></qrcode-stream>
    </div>
    <div v-for="output in result">
      <p>{{ output.rawValue }}</p>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import PouchDB from 'pouchdb'
import PouchHttp from 'pouchdb-adapter-http'

export default {
  data() {
    return {
      result: [],
      db: new PouchDB('qrcodes'),
      savedData: null,
      remoteDb: new PouchDB('https://admin:root@10.0.106.119:6984/storage'),
      remoteDBURL: 'https://admin:root@10.0.106.119:6984/storage',
      syncHandler: null,
      opts: {live: true}
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
      // Save the rawValue into the PouchDB database
      this.db.put({
        _id: new Date().toISOString(),
        rawValue: result[0].rawValue
      }).then(response => {
        console.log('Successfully saved rawValue into the database:', response)
      }).catch(error => {
        console.error('Error saving rawValue into the database:', error)
      })
      this.retrieveData()
    },
    retrieveData() {
      this.db.allDocs({
        include_docs: true
      }).then(response => {
        this.savedData = response.rows.map(row => row.doc)
        console.log('Retrieved data:', this.savedData)
      }).catch(error => {
        console.error('Error retrieving data from the database:', error)
      })
    },
    /*pushDataToRemoteDb() {
      this.db.replicate.to(this.remoteDb).on('complete', () => {
        alert('Data successfully pushed to the remote CouchDB database')
      }).on('error', error => {
        console.error('Error pushing data to the remote CouchDB database:', error)
      })
    },
    syncDataWithRemoteDb() {
      // Check if the browser is online
      if (navigator.onLine) {
        // Start syncing data with the remote CouchDB database
        this.syncHandler = this.db.sync(this.remoteDb, {
          live: true,
          retry: true
        }).on('change', info => {
          console.log('Data successfully synced with the remote CouchDB database:', info)
        }).on('error', error => {
          console.error('Error syncing data with the remote CouchDB database:', error)
        })
      }
    },
    // Method to handle the online event
    handleOnlineEvent() {
      console.log('Browser is online')
      // Sync data with the remote CouchDB database
      this.syncDataWithRemoteDb()
    },
    // Method to handle the offline event
    handleOfflineEvent() {
      console.log('Browser is offline')
      // Stop syncing data with the remote CouchDB database
      if (this.syncHandler) {
        this.syncHandler.cancel()
      }
    }*/
  },
  created() {
    // das plugin braucht man um auf eine remote db zugreifen zu können
    // sonst cors :(
    PouchHttp._put = undefined
    PouchDB.plugin(PouchHttp)
    this.retrieveData()
    // this.pushDataToRemoteDb()
    setInterval(() => {
      this.db.replicate.to(this.remoteDBURL, this.opts).on('complete', () => {
        alert('Data successfully pushed to the remote CouchDB database')
      }).on('error', error => {
        console.error('Error pushing data to the remote CouchDB database:', error)
      })
      this.db.replicate.from(this.remoteDBURL, this.opts).on('complete', () => {
        alert('Data successfully pulled from the remote CouchDB database')
      }).on('error', error => {
        console.error('Error pulling data from the remote CouchDB database:', error)
      })
    }, 5000)
  },
  beforeDestroy() {

  }
}
</script>

<style scoped>

</style>