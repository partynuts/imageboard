//front-end
//vue ist auch frontend

(function() {
  //child
  Vue.component("image-modal", {
    //create a new Vue instance which is slitely different
    // to the Vue instance. You don't give it an el, bc components create their own element!
    data: function() {
      //forcomponents yoou want data to be a function, not an object.
      return {
        title: "",
        username: "",
        description: "",
        created_at: "",
        image: "",
        comments: [],
        newcomment: '',
        newusername: ''
      };
    },
    mounted: function() {
      var self = this;
      axios.get("/comments/" + self.currentImgId).then(function(response) {
        //get one image for commenting
        console.log(response);
        self.title = response.data.images.title;
        self.username = response.data.images.username;
        self.description = response.data.images.description;
        self.created_at = response.data.images.created_at;
        self.image = response.data.images.url;
        for (let i = 0; i < response.data.comments.length; i++) {
        self.comments.unshift(response.data.comments[i]);
        console.log(self.comments[0].comment);
        }
      });
    },

    props: ["currentImgId"],
    methods: {
      open: function(e) {
        this.$emit("open", this.id, e.target.value);
        var self = this;
        axios.post("/open", modalData).then(function(resp) {
          var modalData = new modalData();

          if (resp.data.success) {
            self.images.unshift(resp.data.images[0]);
            console.log(self.images);
          }
        });
      },
      close: function(e) {
        this.$emit("close", this.currentImgId);
        console.log('closing');
      },
      comment: function() {
        // var formData = new FormData();
        // formData.append("username", this.username);
        // formData.append("comment", this.comment);
        console.log('comment sending fn firing');
        var self = this;
        axios.post("/comment", {
          comment: this.newcomment,
          user: this.newusername,
          curImgId: this.currentImgId
        }).then(function(resp) {

          if (resp.data.success) {
            console.log("Response Data:",resp);
            self.comments.unshift(resp.data.comments);

              // console.log ("response data:", resp.data.comments[0].comment);
            // }
          }
        });
      },

    },
    template: "#imgModalTmpl"
  });

  new Vue({
    //parent
    el: "#main",

    data: {
      title: "",
      username: "",
      description: "",
      file: null,
      images: [],
      currentImgId: null
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
        var formData = new FormData();
        formData.append("file", this.file);
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("username", this.username);

        var self = this;
        axios.post("/upload", formData).then(function(resp) {
          if (resp.data.success) {
            self.images.unshift(resp.data.images[0]);
            console.log(self.images);
          }
        });
      },

      showModal: function(id) {
        this.currentImgId = id;
      }
    }
  });
})();

// input.val() = "";
