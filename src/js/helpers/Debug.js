/**
 * helper funtions  *
 *
 *  - classswap
 *
 *  usage:
 *
 * if (EnvironmentHelpers.isMobile()) {}
 */
export default class Debug {

    
  //debugstuff
  static notify(level = "default", msg = "error") {
    
    switch (level) {
      case "warning":
        //preload
        break;
      default:
        console.log("error: " + level + "msg: ", msg);
        break;
    }
  }
}
