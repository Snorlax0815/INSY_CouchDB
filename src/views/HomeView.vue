<template>
  <div class="home">
    <div class="d-flex justify-content-center overflow-auto mx-2" style="max-height: 100vh;">
      <div class="list-group w-100">
        <div v-for="r in result" class="list-group-item shadow list-group-item-action">
          <div class="d-flex w-100 justify-content-between align-items-center">
            <div class="d-inline-flex align-items-center my-0 py-0">
              <small class="">{{ r._id }}</small>
              <p class="text-end">{{ r.rawValue }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PouchDB from 'pouchdb'
import PouchHttp from 'pouchdb-adapter-http'

export default {
  name: 'HomeView',
  data() {
    return {
      result: ["Waiting for content..."],
      db: new PouchDB('qrcodes'),
      // savedData: null,
      remoteDBURL: 'https://admin:root@10.0.106.119:6984/storage',
      syncHandler: null,
      opts: {live: true}
    }
  },
  methods:{
    retrieveData() {
      this.db.allDocs({
        include_docs: true
      }).then(response => {
        this.result = response.rows.map(row => row.doc)
        console.log('Retrieved data:', this.savedData)
      }).catch(error => {
        console.error('Error retrieving data from the database:', error)
      })
    },
  },
  created() {
    // das plugin braucht man um auf eine remote db zugreifen zu können
    // sonst cors :(
    PouchHttp._put = undefined
    PouchDB.plugin(PouchHttp)
    this.retrieveData()
    // this.pushDataToRemoteDb()
    setInterval(() => {
      this.db.replicate.from(this.remoteDBURL, this.opts).on('complete', () => {
        alert('Data successfully pulled from the remote CouchDB database')
        this.retrieveData()
      }).on('error', error => {
        console.error('Error pulling data from the remote CouchDB database:', error)
      })
    }, 5000)
  },
}
</script>
