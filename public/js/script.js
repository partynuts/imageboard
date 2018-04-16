(function() {
  new Vue({
    el: "#main",
    data: {


          heading: "",
cities: []
        },
        methods: {
          myMouser: function() {
            console.log(this.greetee + '!!!');
            this.funkyChicken();
          }
          funkyChicken: function() {
            console.log("bock bock bock, baby");
          }
        }

    }
  });
})();
