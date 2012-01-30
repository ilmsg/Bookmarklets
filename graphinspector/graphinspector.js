(function() {
  var xhr = new XMLHttpRequest(),
      loc = location,
      pathName = loc.pathname,
      doc = document,
      closeIt, fail,
      body = doc.body,
      q,
      pageRegexp = /^\/pages\/.+\/([0-9]+)/;
  
  closeIt = function() {
    var container = doc.getElementById("theInspector");

    if (!!container) {
      body.removeChild(container);
    }
  };

  fail = function(message) {
    alert(message || "4oh4 Not Found");
  };

  if (pathName.search(/profile[.]php/) > -1) {
    q = loc.search.match(/[0-9]+/)[0];
  } else if (pathName.search(pageRegexp) === 0) {
    q = pathName.match(pageRegexp)[1];
  } else {
    try {
      q = pathName.match(/\/([^\/]+)\/?.*/)[1];
    } catch(e) {}
  }


  if (!q) {
    return fail();
  }

  xhr.open("GET", "https://graph.facebook.com/" + q, true);
  xhr.onreadystatechange = function () {
    var result, container, theInput;

    if (xhr.readyState === 4) {
      closeIt();

      result = JSON.parse(xhr.responseText);

      if (result.error) {
        return fail();
      } else if (result === false) {
        return fail("Graph API returned false. The page is probably blocked, unpublished or age restricted.");
      }

      container = doc.createElement("div");
      container.setAttribute("id", "theInspector");

      container.setAttribute("style", "position:fixed;top:99px;left:50%;width:500px;margin-left:-250px;font-size:13px;line-height:21px;box-shadow:0 0 32px #FCC101;z-index:424242");

      container.innerHTML = '<div id="theHeader" style="background-color:#fcc101;padding:7px;color:#fff"><span id="theName"></span><div style="float:right"><input type="text" id="theId"> <a style="color:#fff" href="#null">close</a></div></div><pre style="margin:0;padding:9px;background:#ddd;overflow:auto;max-height:350px"></pre><div id="theFooter" style="padding:7px;background-color:#fcc101;color:#fff"><iframe src="https://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fdiesocialisten&amp;send=false&amp;layout=button_count&amp;width=80&amp;show_faces=false&amp;height=21&amplocale=en_US" scrolling="no" frameborder="0" style="border:none;overflow:hidden;width:80px;height:21px" allowTransparency="true"></iframe><span style="float:right"><a href="https://www.facebook.com/diesocialisten"><img src="http://die.socialisten.at/powered.gif"/></a></span></div>';

      body.appendChild(container);

      doc.getElementById("theId").value = result.id;
      doc.getElementById("theName").innerHTML = result.name;
      doc.querySelector("#theInspector pre").innerHTML = xhr.responseText;

      doc.querySelector("#theFooter a").addEventListener("click", closeIt);
      doc.querySelector("#theHeader a").addEventListener("click", closeIt);

      theInput = doc.querySelector("#theHeader input");

      theInput.focus();
      theInput.select();
    }
  };
  xhr.send(null);
}());