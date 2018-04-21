//front-end
//vue ist auch frontend

(function() {
  //child
  Vue.component("image-modal", {
    //create a new Vue instance which is slitely different
    // to the Vue instance. You don't give it an el, bc components create their own element!
    data: function() {
      //for components yoou want data to be a function, not an object.
      return {
        title: "",
        username: "",
        description: "",
        created_at: "",
        image: "",
        comments: [],
        newcomment: '',
        newusername: '',
        error: false,
        errmessage: ""
      };
    },
    mounted: function() {
      this.mounter();
    },
   watch: {currentImgId: function() {
     this.mounter();
   }},
    props: ["currentImgId"],
    methods: {
      mounter: function() {
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
          console.log("kommentiere:", self.comments[0].created_at);
          }
        });
      },

      close: function(e) {
        this.$emit("closemodal", this.currentImgId);
        console.log('closing');
      },
      comment: function() {
        console.log('comment sending fn firing');
        var self = this;
        axios.post("/comment", {

          comment: this.newcomment,
          user: this.newusername,
          curImgId: this.currentImgId
        })
        .then(function(resp) {

          if (resp.data.success) {

            console.log("Response Data:",resp);
            console.log("err before",self.error);
            self.comments.unshift(resp.data.comments);
            self.newcomment = "";
            self.newusername = "";

          } else {
            self.error = true;
            self.errmessage = "Please fill out all fields."
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
      morePix: true,
      currentImgId: location.hash.slice(1),
      error: false,
      errmessage: "",
      counter: 0
    },
    mounted: function() {
      console.log("mounted happened");
      var self = this; //this funktioniert hier wegen des Scopes nicht. deshalb muss man es als variable definieren

      window.addEventListener('hashchange', function() {
        console.log('event listener firing');
        console.log("curImgId",self.currentImgId);
      self.currentImgId = location.hash.slice(1);
      console.log("curImgId before",self.currentImgId);

      });

      axios.get('/images').then((response) => {
                 self.lastImgId = response.data.lastImgId;
                 self.images = response.data.images;

             });

             self.$on('images.added', (image) => {
                 self.images.unshift(image);
                     //more code
             })

    },
    methods: {

        moreButton: function () {
          var self = this;
            // if(!self.moreImgsFetched) {
              console.log("drinnen");
                axios.get('/imagesMore', {
                    params: {
                    id: self.lastImgId
                  }
                }).then((response) => {
                  if(response.data.morePix==false) {
                    self.morePix = false;
                  }
                  self.lastImgId = response.data.lastImgId;

                    self.images = self.images.concat(response.data.images);
                    console.log(self.images);

                });
            // }

        },
      like: function(likeId) {
        console.log("this.images.id",this.images);
        for (let i = 0; i< this.images.length; i++ ) {
          this.images[i].id = likeId;
          console.log(  this.images[4].id);
        }
        this.counter++;
        },

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
          } else {
            self.error = true;
            self.errmessage = "Please fill out all fields."
          }
        });
      },
      closeModal: function() {
        this.currentImgId = null;
        window.location.hash = '';
      },

      showModal: function(id) {
        this.currentImgId = id;
      }

    }
  });
})();

// input.val() = "";
