class DataPinker extends HTMLElement {
  constructor() {
    super();
    this.format1 = this.getAttribute("format") || "";
    let qwe = new Date();
    this.year = qwe.getFullYear();
    this.month = qwe.getMonth();
    this.day = qwe.getDate();
  }

  connectedCallback() {
    function format(d, m, y, k = ".", p = ".") {
      let s = "";
      if (d < 10) s += "0" + d;
      else s += d;
      s += k;
      if (m + 1 < 10) s += "0" + (m + 1);
      else s += m + 1;
      s += p;
      s += y;
      return s;
    }

    const shadow = this.attachShadow({ mode: "open" });
    let div = document.createElement("div");
    div.append(tmpl.content.cloneNode(true));
    shadow.append(div);
    document.onclick = function (event) {
      if (event.target.nodeName != "DATE-PINKER") {
        date_form.style.display = "none";
      }
    };
    let dt = new Date();
    let date = this.day;
    let form = this.format1;
    let prevday = "";
    let moth = this.month;
    let year = this.year;
    let year_m = shadow.getElementById("year_m");
    let wmd_m = shadow.getElementById("wmd_m");
    let main_form = shadow.getElementById("main_form");
    let show_dmy = shadow.getElementById("show_dmy");
    let date_form = shadow.getElementById("date_form");
    let mth_form = shadow.getElementById("mth_form");
    let mth_coll = shadow.getElementById("mth_coll");
    let tbl_bd = shadow.querySelector("tbody");
    let tbl = shadow.querySelector("table");
    let prev = shadow.getElementById("prev");
    let nxt = shadow.getElementById("nxt");

    year_m.innerHTML = this.year;

    show_dmy.innerHTML = format(
      this.day,
      this.month,
      this.year,
      form[1],
      form[3]
    );
    date_form.style.display = "none";

    main_form.onclick = function () {
      if (date_form.style.display) date_form.style.display = "";
      else date_form.style.display = "none";
    };

    /////////////////////////////////////////////////

    function createTable() {
      mth_form.innerHTML = `${month[dt.getMonth()]}, ${dt.getFullYear()}`;
      tbl_bd.innerHTML = `<tr>
      <td style="color: #C0C0C0; font-weight: 900">S</td>
      <td style="color: #C0C0C0; font-weight: 900">M</td>
      <td style="color: #C0C0C0; font-weight: 900">T</td>
      <td style="color: #C0C0C0; font-weight: 900">W</td>
      <td style="color: #C0C0C0; font-weight: 900">T</td>
      <td style="color: #C0C0C0; font-weight: 900">F</td>
      <td style="color: #C0C0C0; font-weight: 900">S</td>
      </tr>`;
      let tr = document.createElement("tr");
      for (let i = 1; i <= 31; i++) {
        let prevmn = dt.getMonth();
        dt.setDate(i);
        if (prevmn != dt.getMonth()) {
          dt.setMonth(prevmn);
          break;
        }
        let day = dt.getDay();
        let td = document.createElement("td");
        td.classList.add("td");

        if (i == 1)
          for (let j = 0; j < day; j++) {
            let td_sc = document.createElement("td");
            tr.appendChild(td_sc);
          }

        td.onclick = function (event) {
          let target = event.target;
          prevday.style.backgroundColor = "";
          prevday.style.color = "#000000";
          dt.setDate(i);
          date = i;
          moth = dt.getMonth();
          year = dt.getFullYear();
          console.log("1");
          show_dmy.innerHTML = format(date, moth, year, form[1], form[3]);
          target.style.backgroundColor = "#68DE56";
          target.style.color = "#FFFFFF";
          wmd_m.innerHTML =
            weeks[dt.getDay()] +
            ", " +
            month[dt.getMonth()].match(/\w\w\w/i) +
            " " +
            dt.getDate();
          prevday = target;
        };
        if (date == i && moth == dt.getMonth() && year == dt.getFullYear()) {
          td.style.backgroundColor = "#68DE56";
          td.style.color = "#FFFFFF";
          prevday = td;
        }

        td.innerHTML = i;
        tr.appendChild(td);
        if (day == 6) {
          tbl_bd.appendChild(tr);
          tr = document.createElement("tr");
        }
      }
      if (tr.innerHTML) tbl_bd.appendChild(tr);
    }

    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    wmd_m.innerHTML =
      weeks[dt.getDay()] +
      ", " +
      month[dt.getMonth()].match(/\w\w\w/i) +
      " " +
      dt.getDate();

    wmd_m.onmouseover = function (event) {
      event.target.style.fontWeight = "bold";
    };
    wmd_m.onmouseout = function (event) {
      event.target.style.fontWeight = "500";
    };

    function changeMounth(plus) {
      dt.setDate(1);
      dt.setMonth(dt.getMonth() + plus);
      createTable();
    }

    function fordatepre() {
      changeMounth(-1);
    }
    function fordatenex() {
      changeMounth(+1);
    }

    builddays();

    ////////////////////////////////////////////////

    mth_form.addEventListener("click", () => {
      prev.removeEventListener("click", fordatepre);
      prev.addEventListener("click", forprevy);
      nxt.removeEventListener("click", fordatenex);
      nxt.addEventListener("click", fornewy);
      createyer();
    });

    function createyer() {
      mth_form.innerHTML = dt.getFullYear();
      tbl_bd.innerHTML = "";

      let tr = document.createElement("tr");

      for (let i = 0; i < 12; i++) {
        if (i % 3 == 0 && i != 0) {
          tbl_bd.appendChild(tr);
          tr = document.createElement("tr");
        }

        let td = document.createElement("td");
        td.innerHTML = month[i].match(/\b\w\w\w/);
        td.classList.add("tdy");
        td.style.border = "1.2px solid #FFFFFF";
        td.style.borderRadius = "3px";
        td.onclick = function () {
          dt.setDate(1);
          dt.setMonth(i);
          builddays();
        };
        if (year == dt.getFullYear() && moth == i) {
          td.style.color = "#FFFFFF";
          td.style.backgroundColor = "#68DE56";
        }
        td.onmouseover = function (event) {
          event.target.style.border = "1.2px solid #68DE56";
          event.target.style.borderRadius = "3px";
        };
        td.onmouseout = function (event) {
          event.target.style.border = "1.2px solid #FFFFFF";
        };

        tr.appendChild(td);
      }
      tbl_bd.appendChild(tr);
    }

    function changeYear(plus) {
      dt.setDate(1);
      dt.setFullYear(dt.getFullYear() + plus);
      createyer();
    }

    function forprevy() {
      changeYear(-1);
    }
    function fornewy() {
      changeYear(1);
    }
    ///////////////////////////
    prev.onmouseout = function (event) {
      let target = event.target;
      target.style.color = "#000000";
      target.style.backgroundColor = "";
    };
    prev.onmouseover = function (event) {
      let target = event.target;
      target.style.backgroundColor = "#68DE56";
      target.style.color = "#FFFFFF";
    };
    nxt.onmouseout = function (event) {
      let target = event.target;
      target.style.color = "#000000";
      target.style.backgroundColor = "";
    };
    nxt.onmouseover = function (event) {
      let target = event.target;
      target.style.color = "#FFFFFF";
      target.style.backgroundColor = "#68DE56";
    };
    year_m.onmouseover = function (event) {
      event.target.style.fontWeight = "900";
    };
    year_m.onmouseout = function (event) {
      event.target.style.fontWeight = "";
    };
    wmd_m.onclick = function () {
      mth_coll.style.display = "";
      tbl.style.overflowY = "";
      tbl.style.height = "auto";
      createTable();
    };
    let prevyear = "";
    year_m.onclick = () => {
      mth_coll.style.display = "none";
      tbl_bd.innerHTML = "";
      let qwe = 0;
      tbl.style.overflowY = "scroll";
      tbl.style.height = "218px";
      for (let i = 1950; i <= 2100; i++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let span = document.createElement("span");
        if (i == dt.getFullYear()) {
          span.style.fontSize = "20px";
          span.style.fontWeight = "900";
          span.style.color = "#0024FF";
          prevyear = span;
          qwe = tbl.scrollHeight;
        }
        span.onmouseover = function () {
          span.style.fontWeight = "bold";
        };
        span.onmouseout = function () {
          if (i != dt.getFullYear()) span.style.fontWeight = "";
        };
        span.onclick = function () {
          prevyear.style.fontSize = "16px";
          prevyear.style.fontWeight = "0";
          prevyear.style.color = "#000000";
          prevyear.style.fontWeight = "";
          span.style.fontSize = "20px";
          span.style.fontWeight = "900";
          year_m.innerHTML = i;
          dt.setFullYear(i);
          dt.setDate(1);
          dt.setMonth(moth);
          dt.setDate(date);
          wmd_m.innerHTML =
            weeks[dt.getDay()] +
            ", " +
            month[dt.getMonth()].match(/\w\w\w/i) +
            " " +
            dt.getDate();
          span.style.color = "#0024FF";
          prevyear = span;
        };
        td.style.width = "210px";
        span.innerHTML = i;
        td.append(span);
        tr.append(td);
        tbl_bd.append(tr);
      }
      tbl.scrollTop = qwe - 80;
    };
    function builddays() {
      createTable();
      prev.removeEventListener("click", forprevy);
      prev.addEventListener("click", fordatepre);
      nxt.removeEventListener("click", fornewy);
      nxt.addEventListener("click", fordatenex);
    }
  }
  
}

customElements.define("date-pinker", DataPinker);
