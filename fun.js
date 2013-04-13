(function(D) {

  function recur() {
    var elements, element, current, sections = D.querySelectorAll('section');
    for (var i = 0, li = sections.length; i < li; i += 1) {
      sections[i].id='THIS';
      elements = document.querySelectorAll('#THIS>*');
      sections[i].id='';
      current = sections[i];
      for (var e = 0, le = elements.length; e < le; e += 1) {
        element = document.createElement('div');
        element.appendChild(elements[e]);
        current.appendChild(element);
        current = element;
      }
    }
  }

  function gs(nme) {
    var sc = D.createElement("script");
    sc.setAttribute('async', 'async');
    sc.src = nme;
    var head = D.head || D.getElementsByTagName("head")[0] || ddE;
    head.insertBefore(sc, head.firstChild);
  }

  window.posterousCB = function(data) {
    var row,target=D.querySelectorAll('.posterous>div')[0];
    if(target){
    for (var i = 0, l = Math.min(10,data.length); i < l; i += 1) {
      row=document.createElement('div');
      row.innerHTML=data[i].title +'<br>'+ data[i].text;
      target.appendChild(row);
      target=row;
    }
    
    
    }
    
  }

  recur();
  gs('http://zbyszek.posterous.com');

})(document)
