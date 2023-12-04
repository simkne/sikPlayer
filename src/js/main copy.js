/**
 * main js for msr theme
 *
 */
var WaveSurfer = require("./vendor/wavesurfer.js");
var OwlSlider = require("./vendor/owl.carousel.min.js");
var MediaSessionController = require("./components/mediasession.js");
//var Particles = require("./vendor/particles.min.js");
//var AjaxLoader = require('./components/ajax-loader.js');
//import * as AjaxLoader from "./components/ajax-loader.js";
import EnvironmentHelpers from "./components/EnvironmentHelpers.js";
import DateAndTimeHelpers from "./components/DateAndTimeHelpers.js";
//import MediaSessionController from "./components/mediasession.js";

import particles from "./vendor/particlesjs-config.json";
var particles_json_url =
  "/wp-content/themes/msr_anniv_2k23/assets/js/vendor/particlesjs-config.json";

var isLocalHost = EnvironmentHelpers.isLocalHost();
var isMobile = EnvironmentHelpers.isMobile();
//var  = require('./components/ajax-loader.js');
//var particles_json_url = "/projs/msr/wp-content/themes/msr_anniv_2k23/assets/js/vendor/particlesjs-config.json";
var wavesurfer = [];
(function ($) {





  /**
   * AUDIO PLAYER CODE
   *
   * */
  //    var wavesurfer = [];

  const $sikPlayer_wrapper = $("#sikPlayer");

  function launch_Wavesurfer() {
    var waveHeight = EnvironmentHelpers.isMobile() ? 50 : 100;

    wavesurfer = WaveSurfer.create({
      container: "#waveform",
      mediaControls: true,
      height: waveHeight,
      responsive: true,
      cursorColor: "#d9d9d9",
      pointer: "ew-resize",
      waveColor: "#58B6DE",
    });

    /**
     * controls
     */

    $(".sik_playpause").on("click", function () {
      wavesurfer.playPause();
    });
    $(".sik_volume").on("click", function () {
      wavesurfer.toggleMute();
    });
    $(".openClose-btn").on("click", function () {
      showhidePlayer();
    });
    /*     $(".playlist_openClose-btn").on("click", function () {
      showhidePlayList();
    }); */

    /**
     * events
     */

    wavesurfer.on("ready", function (e) {
      wavesurfer.play();
      statusControl("ready");
    });
    wavesurfer.on("play", function (e) {
      statusControl("playing");
    });
    wavesurfer.on("seeking", function (e) {
      console.log("seeking: ", e);
    });
    wavesurfer.on("pause", function (e) {
      statusControl("paused");
    });
    wavesurfer.on("mute", function (e) {
      var btn = $(".sik_volume");
      e == true
        ? swapClasses(btn, "volFull", "volMute")
        : swapClasses(btn, "volMute", "volFull");
      $("#volume").val(0);
    });
    wavesurfer.on("loading", function (e) {
      statusControl("loading", e);
    });
    wavesurfer.on("load", function (e) {
      console.log("loadddd");
      statusControl("load");
    });
    wavesurfer.on("finish", function () {
      console.log("finish");
      playNext();
    });

      /** audio visualisation */
      var analyser = wavesurfer.backend.analyser,
        frequencyData = new Uint8Array(analyser.frequencyBinCount),
        box = $("#sikPlayer_trackVisual"),
        timeText = $(".sikPlayer_timer"),
        currentTime = wavesurfer.getCurrentTime();

      wavesurfer.on("audioprocess", function (e) {
        //update the timer
        currentTime = wavesurfer.getCurrentTime();
        var timerOutput = DateAndTimeHelpers.millisToMinutesAndSeconds(
          currentTime * 1000
        );
        timeText.text(timerOutput);

        analyser.getByteFrequencyData(frequencyData);

        //simple example - get the first value in the array and set the width of the box
        var w = frequencyData[0] * 0.025;
        //apply a scale transform;
        box
          .css("transform", "scale(" + w + ") " + "rotate(" + w * 0.7 + "rad)")
          .css("opacity", w * 0.2 - 0.2)
          .css("border-width", w * 0.62 + "px");
        box
          .find(".inner")
          .css("transform", "rotate(" + w * -0.3 + "rad)")
          .css("opacity", w * 0.24)
          .css("border-width", w * 0.32 + "px");
      });

    var volumeInput = $("#volume");
    if (volumeInput.length > 1) {
      var onChangeVolume = function (e) {
        wavesurfer.setVolume(e.target.value);
        console.log(e.target.value);
      };
      volumeInput.on("input", onChangeVolume);
      volumeInput.on("change", onChangeVolume);
    } else {
      console.log("NO VOLBAR");
    }

    statusControl("init");
  }

  function showhidePlayer() {
    swapClasses($sikPlayer_wrapper, "closed");
    swapClasses($(".openClose-btn"), "closed");
  }
  function swapClasses(el, class1, class2 = "") {
    if (el.hasClass(class1)) {
      el.removeClass(class1);
    } else {
      if (class2.length > 1) {
        el.addClass(class2);
      } else {
        el.addClass(class1);
      }
    }
    if (class2.length > 1) {
      el.addClass(class2);
    }
  }
  function showhidePlayList() {
    var playList_el = $(".playlist_wrapper");
    var btn_el = $(".playlist_openClose-btn");

    swapClasses(playList_el, "closed");
    swapClasses(btn_el, "closed");
  }

  /**
   * status view
   */
  var playerStatus = "init";
  const btn_playpause = $(".sik_playpause");
  const loadScreen = $(".sikPlayer_loader");

  function statusControl(status, value = null) {
    if (status.length > 1) playerStatus = status;

    console.log("statuscont " + playerStatus);

    switch (status) {
      case "init":
        //preload
        $(".sikPlayer_loader").fadeOut();
        break;
      case "ready":
        loadScreen.fadeOut();
        swapClasses($sikPlayer_wrapper, "loaded");
        //update  tracklength
        var tracklengthMills = wavesurfer.getDuration();
        var tracklength =
          DateAndTimeHelpers.secondsToHoursAndMinutes(tracklengthMills);
        $(".sikPlayer_tracklength").text(tracklength.m + ":" + tracklength.s);
        break;
      case "preload":
        //preload
        break;
      case "playing":
        if (!$(".sikPlayer_preLoader").hasClass("hide")) {
          $(".sikPlayer_preLoader").addClass("hide");
          $(".sikPlayer_preLoader").fadeOut();
        }
        swapClasses($sikPlayer_wrapper, "paused", "playing");
        swapClasses(btn_playpause, "play", "pause");
        break;

      case "paused":
        swapClasses($sikPlayer_wrapper, "playing", "paused");
        swapClasses(btn_playpause, "pause", "play");
        $("#sikPlayer_trackVisual")
          .css("transform", "scale(0) " + "rotate(0)")
          .css("opacity", 0.2)
          .css("border-width", "1px");
        break;

      case "loading":
        //open player if closed
        if ($sikPlayer_wrapper.hasClass("closed")) {
          showhidePlayer();
        }
        //perloader
        loadScreen.fadeIn().text(value);
        //ui-resets
        $(".sikPlayer_timer").text("_-:-_");
        $(".sikPlayer_tracklength").text("-_:_-");
        //

        //
        break;

      case "hidden":
        //hide
        break;

      default:
        console.log("::STATUSCONTROL:: ::OOOOOO:: ");
        break;
    }
  }
  /**
   * playlist
   */

  //button on prodcut list

  function launchPlaylistButtons() {
    $(".playlist_btn").on("click", function (e) {
      e.preventDefault();

      var trackArrayID = String($(this).data("playlist"));

      var trackArray = eval(trackArrayID);

      if (JSON.parse(trackArray.tracks)[0].length > 2) {
        //if is not empty
        queuePlaylist(trackArray);
        playlistPreview(trackArray);
      }
    });
  }

  function playlistPreview(trackO) {
    var trackObject = trackO;
    var trackThumb = JSON.parse(trackObject.prodThumb);
    var trackThumbHtml = "<img src='" + trackThumb[0] + "' width='90px'/>";
    var trackTitle = JSON.parse(trackObject.prodTitle);
    var trackLink = JSON.parse(trackObject.plink);

    $(".prodLink").attr("href", trackLink);
    $(".preview_wrapper").ajaxify();
    $(".prodTitle").text(trackTitle);
    $(".prodThumb").html(trackThumbHtml);

    //   console.log(trackTitle);
    //   console.log(trackLink);
  }

  var trackArray = [];
  var currrenTrack = 1;
  function queuePlaylist(trackO) {
    console.log("trackO: ", trackO);

    var trackObject = trackO;
    var trackTitlesArray = JSON.parse(trackObject.trackTitles);
    trackArray = JSON.parse(trackObject.tracks);

    //chekc whether playlist is empty
    if (trackArray[0].length < 2) {
      console.log("wavesurfer:: data error");
      $(".sikPlayer_loader").fadeIn().text("error_01").fadeOut();
      return;
    }

    var playlistDiv = $(".playlist_UI").find(".playlist");
    playlistDiv.html("");
    console.log(playlistDiv);

    $(trackArray).each(function (index, value) {
      var url = value;
      var item_id = index + 1;
      console.log(index + "::" + item_id);
      var listhtml =
        "<li data-trackid='" +
        item_id +
        "' data-trackurl='" +
        url +
        "' class='sik_playlist_item item_" +
        item_id +
        "'>" +
        trackTitlesArray[index] +
        "</li>";
      //     console.log(index, el);
      playlistDiv.append(listhtml);
    });

    loadTrack(trackArray[0]);

    $(".sik_playlist_item").first().addClass("current");

    $(".sik_playlist_item").on("click", function () {
      var trackUrl = $(this).data("trackurl");
      var trackId = $(this).data("trackid");

      currrenTrack = trackId; //setCurrentTrackID
      loadTrack(trackUrl);
      //swapClasses($(this),"current");
      $(this).addClass("current");
      showhidePlayList();
    });

    mediaSession();
  }

  function loadTrack(trackUrl) {
    statusControl("loading");
    console.log("loadTrack::: ", trackUrl);
    wavesurfer.load(trackUrl); // on(ready) > play

    $(".sik_playlist_item").removeClass("current");

  }
  function playNext() {
    if (currrenTrack < trackArray.length) {
      var nextTrackId = currrenTrack + 1;
      var nextTrackUrl = $("li[data-trackid='" + nextTrackId + "']").data(
        "trackurl"
      );
      loadTrack(nextTrackUrl);
      currrenTrack = nextTrackId;
      $("li[data-trackid='" + nextTrackId + "']").addClass("current");
    }
  }

  /**
   * Mediasession
   */
  function mediaSession() {
    console.log("metadataaa: ", "mediaSession" in navigator);
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "Alright",
        artist: "Kendrick Lamar",
        album: "To Pimp A Butterfly",
        artwork: [
          {
            src: "https://assets.codepen.io/4358584/1.300.jpg",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "https://assets.codepen.io/4358584/1.300.jpg",
            sizes: "128x128",
            type: "image/png",
          },
          // More sizes, like 192x192, 256x256, 384x384, and 512x512
        ],
      });
      navigator.mediaSession.playbackState = "playing";
      console.log("metadataaa2: ", navigator.mediaSession.playbackState);
      console.log("metadataaa3: ", navigator.mediaSession.metadata);
    }
    /*     navigator.mediaSession.setActionHandler('pause', () => {
      audio.pause();
    });
    navigator.mediaSession.setActionHandler('play', () => {
      audio.play();
    }); */
    console.log("metadataaa4: ", navigator.mediaSession.metadata.artist);
  }

  /*  PLAYER END  */

})(jQuery);
