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
          <div id="fact-criteria" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" role="tab">
                <b-btn block href="#" v-b-toggle.criteriaRelevance variant="info" class="mb-0 d-flex justify-content-between">
                  <span>
                    <font-awesome-icon icon="spinner" pulse v-if="criteriaRelevance.loading" />
                    <font-awesome-icon icon="question-circle" v-if="criteriaRelevance.unknown" />
                    <font-awesome-icon icon="times" class="criteria-false" v-if="criteriaRelevance.checkedFalse" />
                    <font-awesome-icon icon="check" class="criteria-true" v-if="criteriaRelevance.checkedTrue" />
                    Istotność źródła
                  </span>
                  <span>
                    <font-awesome-icon icon="chevron-down" />
                    <!--<font-awesome-icon icon="chevron-up" />-->
                  </span>
                </b-btn>
              </b-card-header>
              <b-collapse id="criteriaRelevance" accordion="criteria-accordion" role="tabpanel">
                <b-card-body>
                  <p class="card-text">
                    Newsy pochodzące z poważnych serwisów informacyjnych są bardziej wiarygodne, niż te, które znajdziemy na
                    portalach plotkarskich. Źródło sprawdzanego przez Ciebie newsa zostało zakwalifikowane do jednej z czterech
                    kategorii określających jego jakość: nieznane źródło, niepewne źródło, przyzwoite źródło, zaufane źródło.
                  </p>
                  <p class="card-text">
                    <strong>Istotność źródła: <span>{{ sourceRelevance }}</span></strong> <br>
                  </p>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" role="tab">
                <b-btn block href="#" v-b-toggle.criteriaSimilar variant="info" class="mb-0 d-flex justify-content-between">
                  <span>
                    <font-awesome-icon icon="spinner" pulse v-if="criteriaSimilar.loading" />
                    <font-awesome-icon icon="question-circle" v-if="criteriaSimilar.unknown" />
                    <font-awesome-icon icon="times" class="criteria-false" v-if="criteriaSimilar.checkedFalse" />
                    <font-awesome-icon icon="check" class="criteria-true" v-if="criteriaSimilar.checkedTrue" />
                    Podobne newsy
                  </span>
                  <span>
                    <font-awesome-icon icon="chevron-down" />
                    <!--<font-awesome-icon icon="chevron-up" />-->
                  </span>
                </b-btn>
              </b-card-header>
              <b-collapse id="criteriaSimilar" accordion="criteria-accordion" role="tabpanel">
                <b-card-body>
                  <p class="card-text">
                    Większość sprawdzonych informacji publikowana jest w wielu różnych mediach. Jeśli o Twoim newsie pisze kilka
                    portali, to istnieje większa szansa, że informacje, które zawiera są sprawdzone. Pamiętaj jednak, że należy
                    krytycznie spojrzeć na to, jakie portale piszą o Twoim newsie.
                  </p>
                  <p class="card-text">
                    <strong>Podobne newsy: <span>{{ similarNewsDecision }}</span></strong>
                  </p>
                  <ul id="criteria-neighbours-list">
                    <li v-for="news in similarNewsList" :key="news.url">
                      <a :href="news.url">{{ news.text }}</a>
                    </li>
                  </ul>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" role="tab">
                <b-btn block href="#" v-b-toggle.criteriaClickbaits variant="info" class="mb-0 d-flex justify-content-between">
                  <span>
                    <font-awesome-icon icon="spinner" pulse v-if="criteriaClickbaits.loading" />
                    <font-awesome-icon icon="question-circle" v-if="criteriaClickbaits.unknown" />
                    <font-awesome-icon icon="times" class="criteria-false" v-if="criteriaClickbaits.checkedFalse" />
                    <font-awesome-icon icon="check" class="criteria-true" v-if="criteriaClickbaits.checkedTrue" />
                    Brak słów-haczyków (tzw. clickbait)
                  </span>
                  <span>
                    <font-awesome-icon icon="chevron-down" />
                    <!--<font-awesome-icon icon="chevron-up" />-->
                  </span>
                </b-btn>
              </b-card-header>
              <b-collapse id="criteriaClickbaits" accordion="criteria-accordion" role="tabpanel">
                <b-card-body>
                  <p class="card-text">
                    Sensacyjne nagłówki i wzbudzające emocje słowa obniżają wiarygodność artykułu. Mogą one być sygnałem, że
                    autorowi nie zależy na przekazaniu rzetelnych informacji, ale na przyciągnięciu czytelników.
                  </p>
                  <p class="card-text">
                    <strong>Słowa-haczyki: <span>{{ clickbaitsDecision }}</span></strong>
                  </p>
                  <p class="card-text">
                    <span>{{ clickbaitsString }}</span>
                  </p>
                </b-card-body>
              </b-collapse>
            </b-card>
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
import { Collapse } from 'bootstrap-vue/es/components'

import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeLayers, FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown'
import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp'

fontawesome.library.add(faSpinner, faTimes, faCheck, faQuestionCircle, faChevronDown, faChevronUp)

Vue.use(Resource)
Vue.use(BootstrapVue, Collapse)

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

let foundSimilarNewsString = 'Znaleziono portale, które napisały na podobny temat:'
// "Brak danych w systemie na temat podanego źródła."
// "News, który sprawdzasz pochodzi z portalu, na którym można znaleźć fake-newsy lub clickbaity (wniosek na podstawie [X] przeanalizowanych newsów).
// "News, który sprawdzasz pochodzi z portalu, który przeważnie zawiera wiarygodne informacje, jednak można na nim czasem znaleźć artykuły o wątpliwej jakości (wniosek na podstawie [X] przeanalizowanych newsów).
// "News, który sprawdzasz pochodzi z portalu, który oceniany jest jako źródło wiarygodnych informacji (wniosek na podstawie [X] przeanalizowanych newsów).

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
      similarNewsList: [],

      analyzedHeader: null,
      analyzedBody: null,

      clickbaitsState: unknown,
      clickbaitsDecision: noneString,
      clickbaitsString: noneString
    }
  },
  computed: {
    criteriaAuthor: function () {
      return {
        unknown: this.authorState === unknown,
        loading: this.authorState === loading,
        checkedTrue: this.authorState === checkedTrue,
        checkedFalse: this.authorState === checkedFalse
      }
    },
    criteriaRelevance: function () {
      return {
        unknown: this.sourceRelevanceState === unknown,
        loading: this.sourceRelevanceState === loading,
        checkedTrue: this.sourceRelevanceState === checkedTrue,
        checkedFalse: this.sourceRelevanceState === checkedFalse
      }
    },
    criteriaSimilar: function () {
      return {
        unknown: this.similarNewsState === unknown,
        loading: this.similarNewsState === loading,
        checkedTrue: this.similarNewsState === checkedTrue,
        checkedFalse: this.similarNewsState === checkedFalse
      }
    },
    criteriaClickbaits: function () {
      return {
        unknown: this.clickbaitsState === unknown,
        loading: this.clickbaitsState === loading,
        checkedTrue: this.clickbaitsState === checkedTrue,
        checkedFalse: this.clickbaitsState === checkedFalse
      }
    }
  },
  methods: {
    factCheck: function (url) {
      this.authorState = this.sourceRelevanceState = this.similarNewsState = this.clickbaitsState = loading
      this.loading = true
      this.showAnalysis = true
      this.analyzedHeader = null
      this.analyzedBody = null

      let params = null
      if (url !== null) {
        params = {
          url: url
        }
      }

      let _thisRef = this

      this.$http
        .get('/api/document/evaluation', { params: params }).then(function (response) {
          let container = this.$el.querySelector('#fact-analysis')
          // let navbarHeight = this.$refs.factNavbar.clientHeight;
          // scrollOptions.offset = - navbarHeight;
          VueScrollTo.scrollTo(container, 400, scrollOptions)

          if (response.body.authors_score === null) {
            _thisRef.authorState = unknown
            _thisRef.newsAuthorDecision = noneString
          } else if (response.body.authors_score > 0) {
            _thisRef.authorState = checkedTrue
            _thisRef.newsAuthorDecision = response.body.authors
          } else {
            _thisRef.authorState = checkedFalse
            _thisRef.newsAuthorDecision = noneString
          }

          _thisRef.sourceRelevanceState = unknown
          _thisRef.similarNewsList = []
          response.body.neighbours.map(function (value, key) {
            _thisRef.similarNewsList.push({
              'url': value[2],
              'text': value[1]
            })
          })

          if (response.body.neighbours_count === null) {
            _thisRef.similarNewsState = unknown
            _thisRef.similarNewsDecision = null
          } else if (response.body.neighbours_count >= 1) {
            _thisRef.similarNewsState = checkedTrue
            _thisRef.similarNewsDecision = foundSimilarNewsString
            // transform to list of dicts
          } else {
            _thisRef.similarNewsState = checkedFalse
            _thisRef.similarNewsDecision = noneString
          }

          _thisRef.clickbaitsDecision = response.body.clickbait_spans.length
          if (_thisRef.clickbaitsDecision === null) {
            _thisRef.clickbaitsState = unknown
            _thisRef.clickbaitsDecision = null
          } else if (_thisRef.clickbaitsDecision === 0) {
            _thisRef.clickbaitsState = checkedTrue
          } else {
            _thisRef.clickbaitsState = checkedFalse
          }

          if (_thisRef.clickbaitsDecision === 0) {
            _thisRef.clickbaitsDecision = noneString
          }

          _thisRef.analyzedHeader = response.body.title
          _thisRef.analyzedBody = response.body.text

          _thisRef.clickbaitsString = ''
          response.body.clickbait_spans.map(function (value, key) {
            if (key !== 0) {
              _thisRef.clickbaitsString += ', '
            }
            _thisRef.clickbaitsString += value[0]
          })

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
