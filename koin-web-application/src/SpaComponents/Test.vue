<template>
  <div class="hello">
    <div class="col">
      <div class="container-1">
        <div class="btn btn-one">
          <span>BUTTON ONE</span>
        </div>
      </div>

      <div class="container-2">
        <div class="btn btn-two">
          <span>IDLE</span>
        </div>
      </div>

      <div class="container-3">
        <div class="btn btn-three">
          <span>BUTTON THREE</span>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="container-4">
        <div class="btn btn-four">
          <span>BUTTON FOUR</span>
        </div>
      </div>

      <div class="container-5">
        <div class="btn btn-five">
          <span>BUTTON FIVE</span>
        </div>
      </div>

      <div class="container-6">
        <div class="btn btn-six">
          <span>BUTTON SIX</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as TIMETABLE from '../static/daesungBusTimeTable';

  export default {
    name: 'BusLookUp',
    data() {
      return {
        timetable: TIMETABLE.default,
        today: new Date(),
        test: [true, false, true]
      }
    },
    // calculate remaining time
    methods: {
      fastestBus: function (table, nowSeconds) {
        let varSeconds = 0;
        let fastestIdx = 0;

        for (let i = 0; i < table.length; i++) {
          varSeconds = table[i].time * 3600 + table[i].minute * 60
          if (varSeconds > nowSeconds) {
            fastestIdx = i;
            break;
          }
        }
        // return fastest bus timetable's index and remaining seconds
        return [table[fastestIdx], varSeconds - nowSeconds];
      }
    },
    created() {
      this.test = this.test.filter(function (obj) {
        return obj === (true) || obj === (false)
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300';

  /*
   FORMATTING FOR CODEPEN
  */

  html,body {
    height: 100%;
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    font-family: 'Open Sans Condensed', sans-serif;
  }

  .col {
    height: 100%;
  }

  div[class*=container] {
    text-align: center;
    width: 100%;
    height: 33%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container-1 { background: #333; }
  .container-2 { background: #4E598C; }
  .container-3 { background: #8499B1; }
  .container-4 { background: #9888A5; }
  .container-5 { background: #7B6D8D; }
  .container-6 { background: #565554; }

  /*
   BUTTON STYLING
  */

  .btn {
    position: relative;
    color: white;
    width: 256px;
    height: 64px;
    line-height: 64px;
    transition: all 0.3s;
  span {
    transition: all 0.3s;
    tranform: scale(1, 1);
  }
  }

  .btn::before, .btn::after {
    content: '';
    position: absolute;
    transition: all 0.3s;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .btn-one::before {
    left: 4px;
    z-index: 1;

    opacity: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.1, 1);
  }

  .btn-one:hover::before {
    opacity: 1;
    transform: scale(1, 1);
  }

  .btn-one::after {
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .btn-one:hover::after {
    transform: scale(1, .1);
    opacity: 0;
  }

  /* BTN TWO */
  .btn-two::before, .btn-two::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    z-index: 1;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .btn-two:hover::after {
    animation-name: rotatecw;
    animation-duration: 2s;
  }
  .btn-two:hover::before {
    animation-name: rotateccw;
    animation-duration: 3s;
  }
  .btn-two:hover::after, .btn-two:hover::before {
    left: 96px;
    width: 64px;

    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes rotatecw {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }

  @keyframes rotateccw {
    from {transform: rotate(0deg);}
    to {transform: rotate(-360deg);}
  }

  /* BTN THREE */
  .btn-three::before {
    opacity: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1, 0.1);
  }

  .btn-three:hover::before {
    opacity: 1;
    transform: scale(1, 1);
  }

  .btn-three::after {
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .btn-three:hover::after {
    transform: scale(1, .1);
    opacity: 0;
  }

  /* BTN FOUR */

  .btn-four:hover span {
    transform: scale(1.2, 1.2);
  }

  .btn-four::before {
    opacity: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.1, 0.1);
  }

  .btn-four:hover::before {
    opacity: 1;
    transform: scale(1, 1);
  }

  .btn-four::after {
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .btn-four:hover::after {
    transform: scale(0, 0);
    opacity: 0;
  }

  /* BTN FIVE */
  .btn-five::before {
    transition: transform 0.15s, 0.15s border-radius 0.15s;
    opacity: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.1, 0.1);
    border-radius: 50%;
  }

  .btn-five:hover::before {
    opacity: 1;
    transform: scale(1, 1);
    border-radius: 0;
  }

  .btn-five::after {
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .btn-five:hover::after {
    opacity: 0;
  }

  /* BTN SIX */
  .btn-six::before {
    opacity: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.3, 1.3);
  }

  .btn-six:hover::before {
    opacity: 1;
    transform: scale(1, 1);
  }

  .btn-six::after {
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .btn-six:hover::after {
    transform: scale(0, 0);
    opacity: 0;
  }


</style>
