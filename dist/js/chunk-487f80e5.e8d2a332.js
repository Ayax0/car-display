(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-487f80e5"],{"189f":function(e,t,o){},"1d96":function(e,t,o){"use strict";o("189f")},4051:function(e,t,o){"use strict";o.r(t);o("b0c0"),o("a4d3"),o("e01a");var c=o("7a23"),n=function(e){return Object(c["pushScopeId"])("data-v-6489d6a2"),e=e(),Object(c["popScopeId"])(),e},i={class:"header"},s=["src"],r={class:"info"},a=n((function(){return Object(c["createElementVNode"])("div",{class:"show-type"}," Podcast ",-1)})),l={class:"show-title"},d={class:"show-publisher"},u={class:"content"},h=n((function(){return Object(c["createElementVNode"])("div",{class:"section-title"}," Informationen ",-1)})),m=["innerHTML"],p=n((function(){return Object(c["createElementVNode"])("div",{class:"section-title"}," Alle Folgen ",-1)})),b=["onClick"],f=["src"],j={class:"episode-info"},O={class:"episode-title"},g={class:"episode-description"};function w(e,t,o,n,w,v){var k=Object(c["resolveComponent"])("Icon");return Object(c["openBlock"])(),Object(c["createElementBlock"])("div",{class:"main",style:Object(c["normalizeStyle"])(v.cssBridge)},[w.show?(Object(c["openBlock"])(),Object(c["createElementBlock"])(c["Fragment"],{key:0},[Object(c["createElementVNode"])("div",i,[Object(c["createElementVNode"])("div",{class:"back-button",onClick:t[0]||(t[0]=function(t){return e.$router.go(-1)})},[Object(c["createVNode"])(k,{icon:"mdi:chevron-left-circle",height:"2.5rem",color:"white"})]),Object(c["createElementVNode"])("img",{src:v.image.url},null,8,s),Object(c["createElementVNode"])("div",r,[a,Object(c["createElementVNode"])("div",l,Object(c["toDisplayString"])(w.show.name),1),Object(c["createElementVNode"])("div",d,Object(c["toDisplayString"])(w.show.publisher),1)])]),Object(c["createElementVNode"])("div",u,[h,Object(c["createElementVNode"])("div",{class:"description-content",innerHTML:w.show.html_description},null,8,m),p,w.episodes?(Object(c["openBlock"])(),Object(c["createElementBlock"])(c["Fragment"],{key:0},[(Object(c["openBlock"])(!0),Object(c["createElementBlock"])(c["Fragment"],null,Object(c["renderList"])(w.episodes,(function(e){return Object(c["openBlock"])(),Object(c["createElementBlock"])("div",{key:e.id,class:"episode",onClick:function(t){return v.play(e)}},[Object(c["createElementVNode"])("img",{src:e.images[0].url},null,8,f),Object(c["createElementVNode"])("div",j,[Object(c["createElementVNode"])("div",O,Object(c["toDisplayString"])(e.name),1),Object(c["createElementVNode"])("div",g,Object(c["toDisplayString"])(e.description),1)])],8,b)})),128)),w.episodes.length<w.max?(Object(c["openBlock"])(),Object(c["createElementBlock"])("div",{key:0,class:"load-more",onClick:t[1]||(t[1]=function(){return v.loadMore&&v.loadMore.apply(v,arguments)})}," Mehr laden ")):Object(c["createCommentVNode"])("",!0)],64)):Object(c["createCommentVNode"])("",!0)])],64)):Object(c["createCommentVNode"])("",!0)],4)}var v=o("5530"),k=(o("4e82"),o("99af"),o("5502")),E=o("bdb7"),N={name:"Show",data:function(){return{show:void 0,episodes:void 0,color:void 0,max:0}},computed:Object(v["a"])(Object(v["a"])({},Object(k["e"])({account:"account"})),{},{showId:function(){return this.$route.params.id},cssBridge:function(){return{"--color-primary":this.color}},image:function(){return this.show.images[0]}}),watch:{episodes:function(e){console.log(e)}},mounted:function(){var e=this;if(!this.account)return this.$router.push("/login");this.account.api.get("/shows/"+this.showId).then((function(t){e.show=t.data,e.show.images.sort((function(e,t){return e.width>t.width?-1:1})),e.max=e.show.total_episodes,Object(E["a"])(e.image).then((function(t){return e.color="rgb(".concat(t[0].r,",").concat(t[0].g,",").concat(t[0].b,")")}))})).catch((function(e){return console.log(e)})),this.account.api.get("/shows/"+this.showId+"/episodes?limit=20&offset=0").then((function(t){e.episodes=t.data.items})).catch((function(e){return console.log(e)}))},methods:{play:function(e){var t=this;console.log(e),this.account.api.put("/me/player/play",{context_uri:this.show.uri,offset:{uri:e.uri}}).then((function(){return t.$router.push("/")})).catch((function(e){return console.log(e.response)}))},loadMore:function(){var e=this;this.account.api.get("/shows/"+this.showId+"/episodes?limit=20&offset="+this.episodes.length).then((function(t){e.episodes=e.episodes.concat(t.data.items)})).catch((function(e){return console.log(e)}))}}},V=(o("1d96"),o("6b0d")),y=o.n(V);const B=y()(N,[["render",w],["__scopeId","data-v-6489d6a2"]]);t["default"]=B}}]);
//# sourceMappingURL=chunk-487f80e5.e8d2a332.js.map