var WaveSurfer = require("./vendor/wavesurfer.js");
import Helpers from "./helpers/Helpers.js";
import Debug from "./helpers/Debug.js";
import DateAndTimeHelpers from "./helpers/DateAndTimeHelpers.js";
var config = {
  color_primary: "#d9d9d9",
  color_highlight: "gold",
  color_secondary: "#197499",
  playerWrapper: "#sikPlayer",
  waveWrapper: "#waveform",
  waveHeight: 40,
};
(function ($) {
  console.log("aloha");

  const $sikPlayer = $("#sikPlayer");
  const btn_playpause = $(".playpause");
  const btn_volume = $(".volume");
  const preloadScreen = $(".preloader");
  const loadScreen = $(".sikPlayer_loader");
  var wavesurfer = [];
  var trackArray = [];
  var currrenTrack = 1;

  /** test stuff */
  var trackUrl_test =
    "http://localhost:8080/projs/msr/wp-content/uploads/2023/03/Apollo_Brown_-_Choices_Instrumental-Vubey.mp3";

  $(".playlist_btn").on("click", function (e) {
    e.preventDefault();

    var trackArrayID = String($(this).data("playlist"));
    fetchData(trackArrayID);
  });

  function fetchData(arrayID) {
    if (arrayID.length < 2) {
      Debug.notify("warning", "trackArrayID empty!!");
      return;
    }
    var trackArray = eval(arrayID);

    if (JSON.parse(trackArray.tracks)[0].length > 2) {
      //  console.log(trackArray);
      //if is not empty
      queuePlaylist(trackArray);
      playlistPreview(trackArray);
    }
  }

  function playlistPreview(trackO) {
    var trackObject = trackO;
    var trackThumb = JSON.parse(trackObject.prodThumb);
    var trackThumbUrl = trackThumb[0];
    var trackThumbHtml = "<img src='" + trackThumbUrl + "' width='100%'/>";
    var trackTitle = JSON.parse(trackObject["prodTitle"]);
    var trackLink = JSON.parse(trackObject.plink);

    console.log("track", trackThumbUrl);
    $(".prodLink").attr("href", trackLink);
    //   $(".album_preview").ajaxify();
    $(".prodTitle").text(trackTitle);
    $(".prodThumb").css("background-image", "url(" + trackThumbUrl + ")");
  }

  function queuePlaylist(trackO) {
    //    console.log("trackO: ", trackO);

    var trackObject = trackO;
    var trackTitlesArray = JSON.parse(trackObject.trackTitles);
    trackArray = JSON.parse(trackObject.tracks);

    //chekc whether playlist is empty
    if (trackArray[0].length < 2) {
      console.log("wavesurfer:: data error");
      loadScreen.fadeIn().text("error_01").fadeOut();
      return;
    }

    /** fill playlist UI */
    var playlistDiv = $(".playlist_UI").find("ul.playlist");
    playlistDiv.html(""); // empty playlist

    $(trackArray).each(function (index, value) {
      var url = value;
      var item_id = index + 1;
      console.log(index + "::" + item_id);
      var listhtml =
        "<li data-trackid='" +
        item_id +
        "' data-trackurl='" +
        url +
        "' class='playlist_item item_" +
        item_id +
        "'>" +
        trackTitlesArray[index] +
        "</li>";
      //     console.log(index, el);
      playlistDiv.append(listhtml);
    });

    $(".playlist_item").first().addClass("current");
    //load the first track
    loadTrack(trackArray[0]);

    //reset event listeners
    $(".playlist_item").on("click", function () {
      if ($(this).hasClass("current")) {
        return;
      } else {
        var trackUrl = $(this).data("trackurl");
        var trackId = $(this).data("trackid");
        currrenTrack = trackId; //setCurrentTrackID
        loadTrack(trackUrl);
        $(".playlist_item").removeClass("current");
        $(this).addClass("current");
      }
    });
  }
  /**
   *
   */

  launch_Wavesurfer();

  function launch_Wavesurfer() {
    wavesurfer = WaveSurfer.create({
      container: config.waveWrapper,
      mediaControls: true,
      height: config.waveHeight,
      responsive: true,
      cursorColor: config.color_highlight,
      pointer: "ew-resize",
      waveColor: config.color_secondary,
    });

    /**
     * controls
     */

    btn_playpause.on("click", function () {
      wavesurfer.playPause();
    });
    btn_volume.on("click", function () {
      wavesurfer.toggleMute();
    });
    $(".window-controls")
      .find(".open_btn")
      .on("click", function () {
        showhidePlayer();
      });
    $(".playlist_UI")
      .find(".open_btn")
      .on("click", function () {
        showhidePlayList($(this));
      });

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
      e == true
        ? Helpers.swapClasses(btn_volume, "on", "mute")
        : Helpers.swapClasses(btn_volume, "mute", "on");
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
      //  box = $("#sikPlayer_trackVisual"),
      wave = $("#waveform").find("canvas"),
      timeText = $("#timeTracker").find(".currentTime"),
      currentTime = wavesurfer.getCurrentTime();

    wavesurfer.on("audioprocess", function (e) {
      //update the timer
      currentTime = wavesurfer.getCurrentTime();
      var timerOutput = DateAndTimeHelpers.millisToMinutesAndSeconds(
        currentTime * 1000
      );
      timeText.text(timerOutput);

      //  analyser.getByteFrequencyData(frequencyData);

      //simple example - get the first value in the array and set the width of the box
      //  var w = frequencyData[0] * 0.005;
      //console.log(frequencyData[0]);
      //apply a scale transform;
      //  $(".playpause").css("transform", "scale(" + w + ")");
      /*   box
        .css("transform", "scale(" + w + ") " + "rotate(" + w * 0.7 + "rad)")
        .css("opacity", w * 0.2 - 0.2)
        .css("border-width", w * 0.62 + "px");
      box
        .find(".inner")
        .css("transform", "rotate(" + w * -0.3 + "rad)")
        .css("opacity", w * 0.24)
        .css("border-width", w * 0.32 + "px"); */
    });

    statusControl("init");
    /**
     * functions
     */
  }

  /**
   * status view
   */
  var playerStatus = "init";

  function statusControl(status, value = null) {
    if (status.length > 1) playerStatus = status;

    console.log("statuscont " + playerStatus);

    switch (status) {
      case "init":
        //preload
        break;
      case "ready":
        //    Helpers.swapClasses(preloadScreen,"hide");
        Helpers.swapClasses(loadScreen, "hide");
        Helpers.swapClasses($sikPlayer, "loaded");
        //update  tracklength
        var tracklengthMills = wavesurfer.getDuration();
        var tracklength =
          DateAndTimeHelpers.secondsToHoursAndMinutes(tracklengthMills);
        $(".totalLength").text(tracklength.m + ":" + tracklength.s);
        break;
      case "preload":
        //preload
        Helpers.swapClasses(loadScreen, "hide");
        if ($sikPlayer.hasClass("closed")) {
          showhidePlayer();
        }
        if (!preloadScreen.hasClass("hide")) {
          Helpers.swapClasses(preloadScreen, "hide");
        }
        //ui-resets
        $(".sikPlayer_timer").text("_-:-_");
        $(".totalLength").text("-_:_-");
        break;
      case "playing":
        if (!$(".sikPlayer_preLoader").hasClass("hide")) {
          $(".sikPlayer_preLoader").addClass("hide");
          $(".sikPlayer_preLoader").fadeOut();
        }
        Helpers.swapClasses($sikPlayer, "paused", "playing");
        Helpers.swapClasses(btn_playpause, "play", "pause");
        break;

      case "paused":
        Helpers.swapClasses($sikPlayer, "playing", "paused");
        Helpers.swapClasses(btn_playpause, "pause", "play");
        $("#sikPlayer_trackVisual")
          .css("transform", "scale(0) " + "rotate(0)")
          .css("opacity", 0.2)
          .css("border-width", "1px");
        break;

      case "loading":
        loadScreen.text(value);
        break;

      case "hidden":
        //hide
        break;

      default:
        console.log("::STATUSCONTROL:: ::OOOOOO:: ");
        break;
    }
  }

  function loadTrack(trackUrl) {
    statusControl("preload");
    //  console.log("loadTrack::: ", trackUrl);
    wavesurfer.load(trackUrl); // on(ready) > play
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
  function showhidePlayer() {
    var btn_el = $(".window-controls").find($(".open_btn"));
    if ($(".playlist_UI").hasClass("expand")) showhidePlayList();
    Helpers.swapClasses($sikPlayer, "closed");
    Helpers.swapClasses(btn_el, "closed");
  }
  function showhidePlayList() {
    var playList_el = $(".playlist_UI");
    var preview_el = $(".album_preview");
    var btn_el = playList_el.find($(".open_btn"));

    Helpers.swapClasses(playList_el, "expand");
    Helpers.swapClasses(preview_el, "contracted");
    Helpers.swapClasses(btn_el, "closed");
  }
})(jQuery);
