<style scoped>
  #body {
    /* display: flex; */
    /* flex-direction: row; */
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: stretch;
  }
  .movie {
    width:12.9vw;
    height: 27vh;
    border-bottom: 1px solid grey;
    /* flex: 1; */
    flex-grow: 1;
    /* flex-shrink: 0; */
    flex-basis: 30%;
    margin: 1px;
    background-size:100%;
  }
  #erase {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 18vh;
    border-top: 1px solid grey;
    z-index: 100;
  }

  #erase span {
    font-size: 20px;
    line-height: 18vh;
    text-align: center;
  }
</style>

<template>
  <div id="body">
    <div class="movie"
      v-for="(m,i) in shownMovies"
      @click="sendRating(i)"
      v-bind:style="{backgroundImage: 'url(https://image.tmdb.org/t/p/w500/' + m.poster_path}">
    </div>
    <div id="erase" @click="refreshAll()"><span>Refresh All</span></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'snowflik',
    data () {
      return {
        movies: [],
        shownMovies: [],
        page: 0
      }
    },
    mounted () {
      this.getMoviesFromAPI()
    },
    methods: {
      httpGetAsync: function(theUrl, callback){
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.onreadystatechange = function() {
              if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                  callback(xmlHttp.responseText);
          }
          xmlHttp.open("GET", theUrl, true); // true for asynchronous
          xmlHttp.send(null);
      },
      getMoviesFromAPI: function(){
        let self = this
        this.page++
        var url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&'
        url += 'api_key=bb0454acfeca7e6714b4a1b5135c7c96'
        url += '&page=' + this.page
        this.httpGetAsync(url, function(d){
          let data = JSON.parse(d)
          self.movies = data.results
          self.shownMovies = self.shownMovies.concat(self.movies.splice(0, 9 - self.shownMovies.length))
        })
      },
      sendRating: function(idx){
        var api_key = 'cMapyJwfgt2bqGIbV4uMd1rN08g2ILek1WNtgeT3'
        var d = this.shownMovies.splice(idx,1,this.movies.shift())[0]
        d.user = this.getUser()
        d.id = this.guid()
        var request = {
          headers: { 'x-api-key': api_key },
          url:'https://nygtvwgteg.execute-api.us-west-2.amazonaws.com/prod/posneg',
          method: 'POST',
          data: {
            TableName: 'movies',
            Item: d
          }
        }

        if (this.movies.length < 19){ this.getMoviesFromAPI() }

        return Vue.axios.request(request).then((response) => {
          return {}
        }).catch(err => {
          if (String(err).indexOf('401') !== -1) {
            console.log('error' + err)
          } else {
            console.log(err)
          }
        })
      },
      refreshAll: function(){
        var d = this.shownMovies = []
        this.shownMovies = this.shownMovies.concat(this.movies.splice(0, 9))
        if (this.movies.length < 19){ this.getMoviesFromAPI() }
      },
      guid: function () {
        function s4 () {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4()
      },
      getUser: function () {
        var id = localStorage.getItem('movies')
        if (!id) {
          id = this.guid()
          localStorage.setItem('movies', id)
        }
        return id
      }
    }
  }
</script>
