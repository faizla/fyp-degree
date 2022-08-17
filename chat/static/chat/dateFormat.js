// To change date format
    function formatDate(date) {
        var d = new Date(date);
        var hh = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var dd = "a.m.";
        var h = hh;
        if (h >= 12) {
          h = hh - 12;
          dd = "p.m.";
        }
        if (h == 0) {
          h = 12;
        }
        m = m < 10 ? "0" + m : m;

        s = s < 10 ? "0" + s : s;

        /* if you want 2 digit hours:
        h = h<10?"0"+h:h; */

        var months = ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sept","Oct","Nov","Dec"];
        var m = months[d.getMonth()]+". "+d.getDate()+", "+d.getFullYear()+", "+ h + ":" + m;
        /* if you want to add seconds
        replacement += ":"+s;  */
        m += " " + dd;

        return m;

      }