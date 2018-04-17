//front-end
//vue ist auch frontend

(function() {
  new Vue({
    el: "#main",

    data: {
      title: '',
      username: '',
      description: '',
      file: null,
      images: []
    },
    mounted: function() {
      console.log("mounted happened");
      var self = this; //this funktioniert hier wegen des Scopes nicht. deshalb muss man es als variable definieren
      axios.get("/images").then(function(response) {
        console.log(response);
        for (var i = 0; i < response.data.images.length; i++) {
          //data ist bei vue wie rows bei sql-das ist immer das, was uns interessiert und wir ausgegeben haben wollen
          //images = das images-Array oben in meinem data-Objekt
          console.log(self.images);
          self.images.push(response.data.images[i]);
        }
      });
    },
    methods: {
      setFile: function(e) {
        this.file = e.target.files[0];
        // console.log(this.title, this.description, this.username, e.target.files[0]);
      },
      upload: function() {

        var formData = new FormData;
        formData.append("file", this.file);
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("username", this.username);


        var self = this;
        axios.post('/upload', formData).then(function(resp) {
            if (resp.data.success) {
            self.images.unshift(resp.data.images[0])
            console.log(self.images);
          }
        })
      }
    }
  });
})();
