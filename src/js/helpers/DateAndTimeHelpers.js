
export default class DateAndTimeHelpers {
    static secondsToHoursAndMinutes(totalSeconds) {
        const totalMinutes = Math.floor(totalSeconds / 60);

        const seconds = Math.floor(totalSeconds % 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return { h: hours, m: minutes, s: seconds };
    }

    static millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return seconds == 60
          ? minutes + 1 + ":00"
          : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      }
}