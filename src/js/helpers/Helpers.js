/**
 * helper funtions  *
 * 
 *  - classswap
 * 
 *  usage:
 * 
 * if (EnvironmentHelpers.isMobile()) {}
 */
export default class Helpers {

    //swapsclasses
    static swapClasses(el, class1, class2 = "") {
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
    
    //checks whether visitor-device is using a mobile user agent
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
        );
    }
    //checks whether main URL is localhost (for dev, debug)
    static isLocalHost(url = null) {
        url == null ? (url = window.location.href) : url == url;
        return url.includes("localhost") || url.includes("127.0.0.1");
    }
}

