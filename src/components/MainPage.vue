<template>
  <div id="app">
    <div id="search-screen">
      <canvas id="canvas-background" resize="true" data-paper-scope="1">
      </canvas>
      <div id="search-box" class="text-center">
        <h5>Chcesz wiedzieć czy news, który czytasz jest wiarygodny?</h5>
        <form class="form-inline justify-content-center" id="search-form" @submit="factCheckURL">
          <div class="form-group">
            <input type="url" class="form-control" placeholder="wklej swój link" v-model="searchURL" />
            <button class="btn btn-light-green" type="submit">Sprawdź</button>
          </div>
        </form>
        <p>Nie masz newsa? Sprawdź przykładowy! <a href="#" id="search-random" @click="factCheckNoURL"> Kliknij tutaj</a></p>
      </div>
    </div>
    <div class="source hidden" style="border-width: 0px 0px 0px 1px;"></div>

    <div class="container" id="fact-analysis" v-if="showAnalysis">
      <h3>O wiarygodności newsa</h3>
      <div class="row">
        <div class="col">
          <div id="accordion fact-criteria">
            <div class="card">
              <div class="card-header" id="eval-author" data-toggle="collapse" data-target="#collapse-author">
                <h5 class="mb-0 d-flex justify-content-between">
                  <span class="loader">
                    <font-awesome-icon icon="spinner" pulse />
                    <font-awesome-icon icon="question-circle" />
                    <font-awesome-icon icon="times" class="criteria-false" />
                    <font-awesome-icon icon="check" class="criteria-true" />
                    Autor
                  </span>
                  <span>
                    <font-awesome-icon icon="chevron-down" />
                    <!--<font-awesome-icon icon="chevron-up" />-->
                  </span>
                </h5>
              </div>
              <div id="collapse-author" class="collapse collapsed" aria-labelledby="eval-author" data-parent="#fact-criteria">
                <div class="card-body">
                  <p>
                    Jeśli ktoś podpisuje się swoim nazwiskiem, nie boi się, że jego nazwisko zostanie powiązane z tekstem.
                    Taki tekst wydaje się być bardziej wiarygodny od niepodpisanego. Sprawdź, czy autor postu istnieje i pisał
                    wcześnej na podobne tematy.
                  </p>
                  <p>
                    <strong>Autor analizowanego newsa: <span>{{ newsAuthorDecision }}</span></strong>
                  </p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" id="eval-relevance" data-toggle="collapse" data-target="#collapse-relevance">
                <h5 class="mb-0 d-flex justify-content-between">
                  <span>
                    <font-awesome-icon icon="spinner" pulse />
                    <font-awesome-icon icon="question-circle" />
                    <font-awesome-icon icon="times" class="criteria-false" />
                    <font-awesome-icon icon="check" class="criteria-true" />
                    Istotność źródła
                  </span>
                  <span>
                    <font-awesome-icon icon="chevron-down" />
                    <!--<font-awesome-icon icon="chevron-up" />-->
                  </span>
                </h5>
              </div>
              <div id="collapse-relevance" class="collapse collapsed" aria-labelledby="eval-relevance" data-parent="#fact-criteria">
                <div class="card-body">
                  <p>
                    Newsy pochodzące z poważnych serwisów informacyjnych są bardziej wiarygodne, niż te, które znajdziemy na
                    portalach plotkarskich. Źródło sprawdzanego przez Ciebie newsa zostało zakwalifikowane do jednej z czterech
                    kategorii określających jego jakość: nieznane źródło, niepewne źródło, przyzwoite źródło, zaufane źródło.
                  </p>
                  <p>
                    <strong>Istotność źródła: <span>{{ sourceRelevance }}</span></strong> <br>
                  </p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" id="eval-similar" data-toggle="collapse" data-target="#collapse-similar">
                <h5 class="mb-0 d-flex justify-content-between">
                  <span>
                    <font-awesome-icon icon="spinner" pulse />
                    <font-awesome-icon icon="question-circle" />
                    <font-awesome-icon icon="times" class="criteria-false" />
                    <font-awesome-icon icon="check" class="criteria-true" />
                    Podobne newsy
                  </span>
                  <span>
                    <font-awesome-icon icon="chevron-down" />
                    <!--<font-awesome-icon icon="chevron-up" />-->
                  </span>
                </h5>
              </div>
              <div id="collapse-similar" class="collapse collapsed" aria-labelledby="eval-similar" data-parent="#fact-criteria">
                <div class="card-body">
                  <p>
                    Większość sprawdzonych informacji publikowana jest w wielu różnych mediach. Jeśli o Twoim newsie pisze kilka
                    portali, to istnieje większa szansa, że informacje, które zawiera są sprawdzone. Pamiętaj jednak, że należy
                    krytycznie spojrzeć na to, jakie portale piszą o Twoim newsie.
                  </p>
                  <p>
                    <strong>Podobne newsy: <span>{{ similarNewsDecision }}</span></strong>
                  </p>
                  <ul id="criteria-neighbours-list">
                    <!--<li v-for="news in similarNewsList">-->
                      <!--<a href="#">{{ news }}</a>-->
                    <!--</li>-->
                  </ul>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" id="eval-clickbaits" data-toggle="collapse" data-target="#collapse-clickbaits">
                <h5 class="mb-0 d-flex justify-content-between">
                  <span>
                    <font-awesome-icon icon="spinner" pulse />
                    <font-awesome-icon icon="question-circle" />
                    <font-awesome-icon icon="times" class="criteria-false" />
                    <font-awesome-icon icon="check" class="criteria-true" />
                    Brak słów-haczyków (tzw. clickbait)
                  </span>
                  <span>
                    <font-awesome-icon icon="chevron-down" />
                    <!--<font-awesome-icon icon="chevron-up" />-->
                  </span>
                </h5>
              </div>
              <div id="collapse-clickbaits" class="collapse collapsed" aria-labelledby="eval-clickbaits" data-parent="#fact-criteria">
                <div class="card-body">
                  <p>
                    Sensacyjne nagłówki i wzbudzające emocje słowa obniżają wiarygodność artykułu. Mogą one być sygnałem, że
                    autorowi nie zależy na przekazaniu rzetelnych informacji, ale na przyciągnięciu czytelników.
                  </p>
                  <p>
                    <strong>Słowa-haczyki: <span>{{ clickbaitsDecision }}</span></strong>
                  </p>
                  <p>
                    <span>{{ clickbaitsString }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <h3>Analizowany news</h3>
      <div class="row">
        <div class="col">
          <div class="container" id="analyzed-text">
            <h4 class="text-center">{{ analyzedHeader }}</h4>
            <div>{{ analyzedBody }}</div>
          </div>
        </div>
      </div>
      <h3>Oceń wiarygodność</h3>
      <div class="row">
        <div class="col text-center">
          <p>Jak oceniasz przesłany news?</p>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-red">W ogóle niewiarygodny</button>
            <button type="button" class="btn btn-orange">Niewiarygodny</button>
            <button type="button" class="btn btn-yellow">Trudno ocenić</button>
            <button type="button" class="btn btn-light-green">Trochę wiarygodny</button>
            <button type="button" class="btn btn-green">Bardzo wiarygodny</button>
          </div>
          <p>
            <small><i>Kliknij w odpowiedni guzik, aby ocenić</i></small>
          </p>
        </div>
      </div>
    </div>
    <div id="footer" v-if="showAnalysis"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import Resource from 'vue-resource'
import VueScrollTo from 'vue-scrollto'
import BootstrapVue from 'bootstrap-vue'

import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeLayers, FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown'
import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp'

fontawesome.library.add(faSpinner, faTimes, faCheck, faQuestionCircle, faChevronDown, faChevronUp)

Vue.use(Resource, BootstrapVue)

let noneString = 'BRAK'

let unknown = 0
let loading = 1
let checkedTrue = 2
let checkedFalse = 3

let sourceRelevanceUnknown = 0
// let sourceRelevanceUnknown = 0,
//   sourceRelevanceUncertain = 1,
//   sourceRelevanceSoso = 2,
//   sourceRelevanceTrusted = 3;

let scrollOptions = {
  // container: '#fact-analysis',
  easing: 'ease-in',
  offset: -90,
  cancelable: false,
  x: false,
  y: true
}

export default {
  name: 'MainPage',
  components: {
    FontAwesomeIcon,
    FontAwesomeLayers,
    Resource
  },
  data: function () {
    return {
      searchURL: '',
      loading: false,
      showAnalysis: false,

      authorState: unknown,
      newsAuthorDecision: noneString,

      sourceRelevanceState: unknown,
      sourceRelevance: sourceRelevanceUnknown,

      similarNewsState: unknown,
      similarNewsDecision: noneString,
      // <span id="criteria-no-similar">BRAK</span></strong><span id="criteria-found-similar">Znaleziono portale, które napisały na podobny temat:</span>
      similarNewsList: [],

      analyzedHeader: null,
      analyzedBody: null,

      clickbaitsState: unknown,
      clickbaitsDecision: noneString,
      clickbaitsString: noneString
    }
  },
  methods: {
    factCheck: function (url) {
      this.authorState = this.sourceRelevanceState = this.similarNewsState = this.clickbaitsState = loading
      this.loading = true
      this.showAnalysis = true

      let params = null
      if (url !== null) {
        params = {
          url: url
        }
      }

      let _thisRef = this

      this.$http
        .get('http://localhost:8000/api/document/evaluation', { params: params }).then(function (response) {
          let container = this.$el.querySelector('#fact-analysis')
          // let navbarHeight = this.$refs.factNavbar.clientHeight;
          // scrollOptions.offset = - navbarHeight;
          VueScrollTo.scrollTo(container, 400, scrollOptions)

          this.analyzedHeader = response.body.title
          this.analyzedBody = response.body.text

          console.log(response.body)
          if (response.body.authors_score > 0) {
            _thisRef.authorState = checkedTrue
          } else {
            _thisRef.authorState = checkedFalse
            this.newsAuthorDecision = noneString
          }

          _thisRef.loading = false
        })
    },
    factCheckNoURL: function () {
      this.factCheck()
    },
    factCheckURL: function (e) {
      e.preventDefault()
      this.factCheck(this.searchURL)
    }
  }
}
</script>
